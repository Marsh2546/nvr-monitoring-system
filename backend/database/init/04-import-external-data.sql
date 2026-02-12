-- Import External Database Data
-- This script demonstrates how to import data from external SQL files
-- Place your external SQL files in the same directory as this script

-- Method 1: Import from SQL files
-- Copy your SQL files to this directory and uncomment the lines below

-- Example: Import NVR stations from external file
-- \i external-nvr-stations.sql
-- \i backend/database/init/data-sql/nvr_snapshot_history.sql

-- Example: Import NVR snapshot history from external file
-- \i backend/database/init/data-sql/nvr_snapshot_history.sql

-- Method 4: Import from backup SQL dump
-- If you have a complete SQL dump file, you can restore it
-- \i backend/database/init/data-sql/nvr_snapshot_history.sql
-- \i backend/database/init/data-sql/nvr_status_history.sql

-- Notes:
-- 1. Place your external files in the same directory as this script
-- 2. Make sure file permissions allow reading by the postgres user
-- 3. Check that foreign key relationships are maintained
-- 4. Verify data types match table definitions
-- 5. Use UTF-8 encoding for Thai text data

-- After import, you can verify the data:
-- SELECT COUNT(*) FROM nvr_snapshot_history;
-- SELECT COUNT(*) FROM nvr_status_history;

