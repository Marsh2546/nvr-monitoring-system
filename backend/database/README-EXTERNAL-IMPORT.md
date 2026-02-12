# วิธีการนำเข้าข้อมูลจากภายนอก

## 📁 โครงสร้างไฟล์สำหรับ import

```
backend/database/init/
├── 01-create-tables.sql           # ✅ สร้าง tables
├── 02-setup-cron.sql             # ✅ Cron jobs
├── 03-create-user.sql            # ✅ Database users
├── 04-import-external-data.sql   # 🔄 Import script
├── your-external-data.sql        # 📁 ไฟล์ข้อมูลของคุณ
├── your-data.csv                # 📊 ไฟล์ CSV ของคุณ
└── README-EXTERNAL-IMPORT.md      # 📖 คำแนะนำการ
```

## 🔄 วิธีการ import มี 4 วิธี:

### 1️⃣ Import จากไฟล์ SQL

**ขั้นตอน:**
1. สร้างไฟล์ SQL ของคุณ (เช่น `my-data.sql`)
2. วางไว้ใน `backend/database/init/`
3. แก้ไข `04-import-external-data.sql`

**ตัวอย่างไฟล์ SQL:**
```sql
-- my-data.sql
INSERT INTO nvr_stations (nvr_name, nvr_ip, nvr_port, username, password, status) VALUES
('NVR_External_1', '192.168.1.200', 554, 'admin', 'extpass123', 'active'),
('NVR_External_2', '192.168.1.201', 554, 'admin', 'extpass456', 'active');
```

**แก้ไข import script:**
```sql
-- ใน 04-import-external-data.sql
\i my-data.sql
```

### 2️⃣ Import จากไฟล์ CSV

**ขั้นตอน:**
1. สร้างไฟล์ CSV พร้อม headers
2. ใช้ UTF-8 encoding สำหรับภาษาไทย
3. วางไว้ใน `backend/database/init/`

**ตัวอย่างไฟล์ CSV:**
```csv
nvr_name,nvr_ip,nvr_port,username,password,status
NVR_External_1,192.168.1.200,554,admin,extpass123,active
NVR_External_2,192.168.1.201,554,admin,extpass456,active
```

**แก้ไข import script:**
```sql
-- ใน 04-import-external-data.sql
COPY nvr_stations (nvr_name, nvr_ip, nvr_port, username, password, status)
FROM '/docker-entrypoint-initdb.d/nvr_stations.csv'
WITH (FORMAT csv, HEADER true, DELIMITER ',', ENCODING 'UTF-8');
```

### 3️⃣ Import จาก SQL Dump

**ขั้นตอน:**
1. Export database เป็น SQL dump
2. วางไว้ใน `backend/database/init/`
3. แก้ไข import script

**แก้ไข import script:**
```sql
-- ใน 04-import-external-data.sql
\i your-database-backup.sql
```

### 4️⃣ Direct INSERT Statements

**เหมาะสำหรับข้อมูลไม่มาก:**
```sql
-- ใน 04-import-external-data.sql
INSERT INTO nvr_stations (nvr_name, nvr_ip, nvr_port, username, password, status) VALUES
('NVR_External_1', '192.168.1.200', 554, 'admin', 'extpass123', 'active');
```

## 📊 Tables ที่รองรับ import:

| Table | Columns | ตัวอย่างข้อมูล |
|-------|---------|----------------|
| `nvr_stations` | nvr_name, nvr_ip, nvr_port, username, password, status | ชื่อ NVR, IP, port |
| `cameras` | camera_name, nvr_station_id, camera_channel, status | ชื่อกล้อง, ID NVR |
| `repair_requests` | location, district, issue, status, priority, reported_by, contact_phone | สถานที่, ปัญหา, สถานะ |
| `nvr_snapshot_history` | camera_name, nvr_ip, nvr_name, snapshot_status, comment, image_url, recorded_at | ข้อมูล snapshot |

## 🚀 การรัน:

```bash
# หยุด services เก่า
make stop

# ลบ volumes เก่า (ถ้าต้องการ)
docker-compose down -v

# รันใหม่พร้อมข้อมูลใหม่
make dev
```

## ⚠️ ข้อควรระวัง:

1. **Foreign Keys**: ตรวจสอบว่า `nvr_station_id` มีอยู่ใน `nvr_stations`
2. **Data Types**: ตรวจสอบว่าข้อมูลตรงกับ table definitions
3. **Encoding**: ใช้ UTF-8 สำหรับข้อมูลภาษาไทย
4. **Permissions**: ตรวจสอบว่า postgres user อ่านไฟล์ได้
5. **Backups**: สำรองข้อมูลเก่าก่อน import ข้อมูลใหม่

## 📝 ตัวอย่างเต็ม:

**สำหรับ import ข้อมูล NVR และ cameras:**
```sql
-- 04-import-external-data.sql
\i external-nvr-stations.sql
\i external-cameras.sql
```

**สำหรับ import ข้อมูล repair requests:**
```sql
-- 04-import-external-data.sql
COPY repair_requests (location, district, issue, status, priority, reported_by, contact_phone, created_at)
FROM '/docker-entrypoint-initdb.d/repair_requests.csv'
WITH (FORMAT csv, HEADER true, DELIMITER ',', ENCODING 'UTF-8');
```

**พร้อม import ข้อมูลจากภายนอก!** 🎯
