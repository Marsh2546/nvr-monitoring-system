# Database Import Instructions

## วิธี Import ข้อมูลจากไฟล์ Database ที่มีอยู่

### 📁 วางไฟล์ของคุณ:

1. **Copy ไฟล์ database** ของคุณไปยัง:
   ```
   backend/database/init/
   ```

2. **ชนิดไฟล์ที่รองรับ:**
   - `.sql` - SQL dump files
   - `.csv` - CSV data files

### 🔧 แก้ไข `03-import-database.sql`:

#### **สำหรับ SQL files:**
```sql
-- แก้ไขชื่อไฟล์ตามที่คุณมี
\i your-nvr-data.sql
\i your-camera-data.sql
\i your-repair-data.sql
```

#### **สำหรับ CSV files:**
```sql
-- แก้ไขชื่อไฟล์และ columns ตามที่คุณมี
COPY nvr_stations (nvr_name, nvr_ip, nvr_port, username, password, status)
FROM '/docker-entrypoint-initdb.d/your-nvr-stations.csv'
WITH (FORMAT csv, HEADER true);
```

### 🗄️ Tables ที่มีอยู่:

| Table | Columns | คำอธิบาย |
|-------|---------|-----------|
| `nvr_stations` | nvr_name, nvr_ip, nvr_port, username, password, status | ข้อมูล NVR stations |
| `cameras` | camera_name, nvr_station_id, camera_channel, status | ข้อมูลกล้อง |
| `nvr_snapshot_history` | camera_name, nvr_ip, nvr_name, snapshot_status, comment, image_url, recorded_at | ประวัติ snapshot |
| `repair_requests` | location, district, issue, status, priority, reported_by, contact_phone, created_at | รายการแจ้งซ่อม |

### 🚀 รัน Database:

```bash
make dev
```

**Docker จะ:**
1. ✅ สร้าง tables จาก `01-create-tables.sql`
2. ✅ สร้าง users จาก `03-create-user.sql`
3. ✅ Import ข้อมูลจาก `03-import-database.sql`
4. ✅ Setup cron jobs จาก `02-setup-cron.sql`

### ⚠️ ข้อควรระวัง:

- **Foreign Keys**: ตรวจสอบว่า `nvr_station_id` มีอยู่ใน `nvr_stations`
- **Data Types**: ตรวจสอบว่าข้อมูลตรงกับ table definitions
- **Timestamps**: ใช้ `timestamptz` สำหรับ timezone support
- **Encoding**: ใช้ UTF-8 สำหรับข้อมูลภาษาไทย

### 📝 ตัวอย่างโครงสร้างไฟล์:

```
backend/database/init/
├── 01-create-tables.sql      # ✅ สร้าง tables
├── 02-setup-cron.sql         # ✅ Cron jobs  
├── 03-create-user.sql        # ✅ Database users
├── 03-import-database.sql    # 🔄 Import ข้อมูลของคุณ
├── your-nvr-data.sql         # 📁 ไฟล์ของคุณ
├── your-camera-data.sql      # 📁 ไฟล์ของคุณ
└── your-repair-data.sql      # 📁 ไฟล์ของคุณ
```

**พร้อม import ข้อมูลจริงของคุณ!** 🎯
