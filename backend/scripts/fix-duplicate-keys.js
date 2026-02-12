import { Pool } from 'pg';

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "cctv_nvr_monitor",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
});

async function fixDuplicateKeys() {
  console.log("🔧 Starting duplicate key fix...");
  
  try {
    // 1. Check for duplicates
    console.log("📊 Checking for duplicates...");
    const duplicateCheck = await pool.query(`
      SELECT id, COUNT(*) as count 
      FROM nvr_status_history 
      GROUP BY id 
      HAVING COUNT(*) > 1
    `);
    
    if (duplicateCheck.rows.length > 0) {
      console.log("❌ Found duplicates:", duplicateCheck.rows);
      
      // 2. Remove duplicates (keep the first occurrence)
      console.log("🗑️ Removing duplicates...");
      const deleteResult = await pool.query(`
        DELETE FROM nvr_status_history 
        WHERE ctid NOT IN (
          SELECT MIN(ctid) 
          FROM nvr_status_history 
          GROUP BY id
        )
      `);
      
      console.log(`✅ Removed ${deleteResult.rowCount} duplicate records`);
    } else {
      console.log("✅ No duplicates found");
    }
    
    // 3. Get max ID
    const maxIdResult = await pool.query('SELECT MAX(id) as max_id FROM nvr_status_history');
    const maxId = maxIdResult.rows[0].max_id || 0;
    console.log(`📈 Current max ID: ${maxId}`);
    
    // 4. Reset sequence
    console.log("🔄 Resetting sequence...");
    await pool.query(`
      SELECT setval('nvr_status_history_id_seq', ${maxId + 1}, true)
    `);
    console.log("✅ Sequence reset successfully");
    
    // 5. Verify no more duplicates
    const finalCheck = await pool.query(`
      SELECT id, COUNT(*) as count 
      FROM nvr_status_history 
      GROUP BY id 
      HAVING COUNT(*) > 1
    `);
    
    if (finalCheck.rows.length === 0) {
      console.log("🎉 All duplicates fixed successfully!");
    } else {
      console.log("⚠️ Some duplicates still exist:", finalCheck.rows);
    }
    
  } catch (error) {
    console.error("❌ Error fixing duplicates:", error);
  } finally {
    await pool.end();
  }
}

// Run the fix
fixDuplicateKeys();
