import express from "express";
import { Pool } from "pg";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

import {
  pool,
  fetchNVRStations,
  fetchCameras,
  fetchNVRSnapshots,
  fetchSnapshotLogs,
  fetchNVRStatusHistory,
  fetchAllNVRHistory,
  query,
  testDatabaseConnection,
} from "./databaseService";

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use("/snapshots", express.static(path.join(__dirname, "../../snapshots")));

// Health check endpoint
app.get("/health", async (req, res) => {
  const isHealthy = await testDatabaseConnection();
  if (isHealthy) {
    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: "connected",
    });
  } else {
    res.status(500).json({
      status: "unhealthy",
      database: "disconnected",
    });
  }
});

// Get all NVR stations
app.get("/api/nvr-status-history", async (req, res) => {
  try {
    const history = await fetchAllNVRHistory();
    res.json(history);
  } catch (error) {
    console.error("Error fetching NVR status history:", error);
    res.status(500).json({ error: "Failed to fetch NVR status history" });
  }
});

// Get NVR status (for compatibility with nvrService.ts)
app.get("/api/nvr-status", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const history = await fetchNVRStatusHistory(
      startDate as string,
      endDate as string,
    );

    // Transform to match legacy format if needed by nvrService.ts
    const transformedData = history.map((item) => ({
      id: item.nvr_id?.toString() || "", // Ensure id is string
      nvr: item.nvr_name,
      district: item.district,
      location: item.location,
      onu_ip: item.onu_ip,
      ping_onu: item.ping_onu,
      nvr_ip: item.nvr_ip,
      ping_nvr: item.ping_nvr,
      hdd_status: item.hdd_status,
      normal_view: item.normal_view,
      check_login: item.check_login,
      camera_count: item.camera_count || 0,
      recorded_at: item.recorded_at,
    }));

    res.json({
      success: true,
      data: transformedData,
      count: transformedData.length,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching NVR status:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch NVR status",
    });
  }
});

// Get all cameras
app.get("/api/cameras", async (req, res) => {
  try {
    const cameras = await fetchCameras();
    res.json(cameras);
  } catch (error) {
    console.error("Error fetching cameras:", error);
    res.status(500).json({ error: "Failed to fetch cameras" });
  }
});

// Get NVR status history OR snapshots
app.get("/api/snapshots", async (req, res) => {
  try {
    const { nvrName, startDate, endDate, limit } = req.query;

    if (nvrName) {
      console.log(`Fetching snapshots for NVR: ${nvrName}`);
      const snapshots = await fetchNVRSnapshots(
        nvrName as string,
        startDate as string,
        endDate as string,
      );
      if (limit) {
        res.json(snapshots.slice(0, Number(limit)));
      } else {
        res.json(snapshots);
      }
    } else {
      console.log(`Fetching global NVR status history`);
      const history = await fetchNVRStatusHistory(
        startDate as string,
        endDate as string,
        limit ? Number(limit) : undefined,
      );
      res.json(history);
    }
  } catch (error) {
    console.error("Error fetching NVR data:", error);
    res.status(500).json({ error: "Failed to fetch NVR data" });
  }
});

// Get snapshot logs
app.get("/api/snapshot-logs", async (req, res) => {
  try {
    const { cameraName, limit = 50 } = req.query;
    
    let query = `
      SELECT camera_name, nvr_ip, nvr_name, snapshot_status, comment, recorded_at, created_at
      FROM nvr_snapshot_history
      WHERE snapshot_status IN ('SCHEDULED', 'TRIGGERED', 'FAILED')
    `;
    const params: any[] = [];

    if (cameraName) {
      query += ` AND camera_name = $1`;
      params.push(cameraName);
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
    params.push(Number(limit));

    const result = await pool.query(query, params);
    
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching snapshot logs:", error);
    res.status(500).json({ error: "Failed to fetch snapshot logs" });
  }
});

// Manual snapshot trigger endpoint
app.post("/api/trigger-snapshots", async (req, res) => {
  try {
    const { cameraNames } = req.body;

    // Get unique cameras from nvr_snapshot_history
    let query = `
      SELECT DISTINCT camera_name, nvr_ip, nvr_name
      FROM nvr_snapshot_history
      WHERE snapshot_status = 'TRUE'
    `;
    const params: any[] = [];

    if (cameraNames && cameraNames.length > 0) {
      query += ` AND camera_name = ANY($1)`;
      params.push(cameraNames);
    }

    const result = await pool.query(query, params);
    const cameras = result.rows;

    // Log snapshot attempts (insert into nvr_snapshot_history)
    for (const camera of cameras) {
      await pool.query(`
        INSERT INTO nvr_snapshot_history (camera_name, nvr_ip, nvr_name, snapshot_status, comment, recorded_at, created_at)
        VALUES ($1, $2, $3, 'TRIGGERED', 'Manual trigger via API', NOW(), NOW())
      `, [camera.camera_name, camera.nvr_ip, camera.nvr_name]);

      console.log(
        `Triggered snapshot for camera: ${camera.camera_name} (${camera.nvr_ip})`,
      );
    }

    res.json({
      message: `Triggered snapshots for ${cameras.length} cameras`,
      cameras: cameras.map((c) => ({ name: c.camera_name, nvr: c.nvr_name })),
    });
  } catch (error) {
    console.error("Error triggering snapshots:", error);
    res.status(500).json({ error: "Failed to trigger snapshots" });
  }
});

// Log snapshots endpoint (for cron job or external calls)
app.post("/api/log-snapshots", async (req, res) => {
  try {
    // Get unique cameras from nvr_snapshot_history
    const result = await pool.query(`
      SELECT DISTINCT camera_name, nvr_ip, nvr_name
      FROM nvr_snapshot_history
      WHERE snapshot_status = 'TRUE'
    `);

    // Log scheduled snapshot attempts
    for (const camera of result.rows) {
      await pool.query(`
        INSERT INTO nvr_snapshot_history (camera_name, nvr_ip, nvr_name, snapshot_status, comment, recorded_at, created_at)
        VALUES ($1, $2, $3, 'SCHEDULED', 'Scheduled snapshot via cron', NOW(), NOW())
      `, [camera.camera_name, camera.nvr_ip, camera.nvr_name]);
    }

    res.json({
      message: `Logged ${result.rows.length} cameras for snapshot processing`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error logging snapshots:", error);
    res.status(500).json({ error: "Failed to log snapshots" });
  }
});

// Cleanup old logs endpoint (for cron job)
app.post("/api/cleanup-logs", async (req, res) => {
  try {
    // Delete all entries older than 1 year (including TRUE status)
    // Then start fresh collection from current date
    const result = await pool.query(`
      DELETE FROM nvr_snapshot_history 
      WHERE created_at < NOW() - INTERVAL '1 year'
    `);

    console.log(`Cleaned up ${result.rowCount} old entries (older than 1 year)`);
    console.log(`Starting fresh data collection from current date`);

    res.json({
      message: `Cleaned up ${result.rowCount} old entries (older than 1 year)`,
      timestamp: new Date().toISOString(),
      schedule: "Runs every 7:00 AM",
      retention: "Keep 1 year, then delete and restart collection",
      note: "All data (including TRUE status) deleted after 1 year to start fresh"
    });
  } catch (error) {
    console.error("Error cleaning up logs:", error);
    res.status(500).json({ error: "Failed to cleanup logs" });
  }
});

// NVR status endpoints
app.get("/api/nvr-status", async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        id,
        nvr_id,
        nvr_name,
        district,
        location,
        onu_ip,
        ping_onu,
        nvr_ip,
        ping_nvr,
        hdd_status,
        normal_view,
        check_login,
        camera_count,
        recorded_at
      FROM nvr_status_history
      ORDER BY recorded_at DESC
      LIMIT 100
    `);
    
    res.json({
      success: true,
      data: result,
      count: result.length,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching NVR status:", error);
    res.status(500).json({ error: "Failed to fetch NVR status" });
  }
});

// Repair requests endpoints
app.get("/api/repair-requests", async (req, res) => {
  try {
    // Since repair_requests table was removed, return empty data with proper structure
    // This endpoint can be enhanced later to use data from nvr_status_history for issues
    const repairRequests: any[] = [];
    
    res.json({
      success: true,
      data: repairRequests,
      count: 0,
      lastUpdated: new Date().toISOString(),
      message: "Repair requests table not available. This endpoint returns empty data."
    });
  } catch (error) {
    console.error("Error fetching repair requests:", error);
    res.status(500).json({ error: "Failed to fetch repair requests" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`CCTV NVR Backend server running on port ${port}`);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("Received SIGTERM, shutting down gracefully");
  await pool.end();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("Received SIGINT, shutting down gracefully");
  await pool.end();
  process.exit(0);
});
