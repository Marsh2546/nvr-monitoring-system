-- NVR Monitoring System - Cron Jobs Configuration
-- 
-- Note: Cron jobs are handled by Node Cron in the Backend service
-- 
-- Why Node Cron instead of PostgreSQL pg_cron:
-- 1. More flexible error handling and retry logic
-- 2. Better integration with application logging
-- 3. No need for custom PostgreSQL image
-- 4. Easier to monitor and debug
-- 5. Can make HTTP requests to external NVR APIs
--
-- Node Cron implementation is located in:
// backend/src/services/snapshotService.js
//
-- Example cron schedule:
-- */5 * * * * - Every 5 minutes for snapshot capture
-- 0 */1 * * * - Every hour for NVR status check

-- Note: For cron functionality, use the backend API endpoints:
-- POST /api/log-snapshots - to log snapshot attempts
-- POST /api/trigger-snapshots - to manually trigger snapshots
-- Or set up an external cron job to call these endpoints
