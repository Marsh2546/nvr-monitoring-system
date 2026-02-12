# CCTV NVR Monitoring System

ระบบตรวจสอบสถานะการ CCTV NVR ที่พัฒนาด้วยสถาปัตยกระบบใหม่ แยกส่วน Frontend และ Backend พร้อมการใช้งาน Docker แบบเต็มระบบ

## เริ่มต้นใช้งาน

### สิ่งที่ต้องเตรียม
- Docker & Docker Compose
- Node.js 18+ (สำหรับ development ในเครื่อง)
- Git

### เริ่มต้นด้วยคำสั่งเดียว
```bash
# Clone และ setup
git clone <repository-url>
cd .nvr-monitoring
make setup
```

### ติดตั้งแบบ manual
```bash
# 1. สร้าง environment file
cp config/.env.development .env

# 2. ติดตั้ง dependencies
cd frontend && npm install
cd ../backend && npm install

# 3. เริ่ม development
make dev
```

## คำสั่งที่ใช้ได้

```bash
make help              # แสดงคำสั่งทั้งหมด
make setup             # เตรียมสภาพแวดล้อมการทำงาน
make dev               # เริ่มสภาพแวดล้อมการพัฒนา
make run               # รัน services ใน background
make build             # Build Docker images
make deploy            # Deploy ไปยัง production
make health            # ตรวจสอบสถานะระบบ
make logs              # ดู logs ของ services
make status            # แสดงสถานะ services
make backup            # Backup ฐานข้อมูล
make clean             # ลบ resources ที่ไม่ใช้
```

## สถาปัตยกระบบ

### Frontend (React + Vite)
- **เทคโนโลยี**: React 18, TypeScript, Vite
- **UI Framework**: Material-UI, Tailwind CSS
- **State Management**: React Hooks
- **Build Tool**: Vite
- **Port**: 3000 (production) / 5173 (development)

### Backend (Node.js + Express)
- **เทคโนโลยี**: Node.js, Express, TypeScript
- **ฐานข้อมูล**: PostgreSQL
- **API**: RESTful endpoints
- **Authentication**: JWT (อนาคต)
- **Port**: 3001

### Database (PostgreSQL)
- **เวอร์ชัน**: PostgreSQL 15
- **โครงสร้าง**: ปรับแต่งสำหรับการตรวจสอบ NVR
- **Backup**: ทำงานอัตโนมัติ
- **Port**: 5432

## โครงสร้างโปรเจค

```
nvr-monitoring/
├── backend/              # API หลัง
├── frontend/             # React application
├── docker/               # ค่าย Docker
│   ├── docker-compose.yml
│   └── nginx.conf
├── config/               # ตั้งค่าต่างๆ
├── scripts/              # scripts ช่วยเหลือ
├── docs/                 # เอกสาร
├── deploy/               # ค่ายสำหรับ deployment
├── .env.example          # template สำหรับ environment
├── .gitignore            # กฎการ ignore สำหรับ Git
├── Makefile              # คำสั่ง build และ deployment
└── README.md             # เอกสารหลัก
```

## URL สำหรับเข้าใช้งาน

| สภาพแวดล้อม | Frontend | Backend API | Database |
|-------------|-----------|-------------|-----------|
| Development | http://localhost:5173 | http://localhost:3001 | localhost:5432 |
| Production | http://localhost:80 | http://localhost:3001 | localhost:5432 |

## การใช้ Docker

### Development (พัฒนา)
```bash
make dev               # เริ่มพร้อม hot reload
make dev-detach       # เริ่มใน background
```

### Production (ใช้จริง)
```bash
make deploy            # Deployment ไป production ทั้งหมด
make run-prod         # รัน production services
```

## การตั้งค่า

### Environment Variables
คัดลอก template ที่เหมาะสมและอัพเดตค่า:
- Development: `config/.env.development`
- Production: `config/.env.production`

### ค่าที่สำคัญ
- `VITE_API_URL`: Backend API endpoint
- `DATABASE_URL`: PostgreSQL connection string
- `FRONTEND_URL`: Frontend URL สำหรับ CORS

## การตรวจสอบและบำรุงรักษา

### การตรวจสอบสถานะ
```bash
make health            # ตรวจสอบทุก services
curl http://localhost:3001/health  # ตรวจสอบ backend
```

### Backup และ Restore
```bash
make backup           # สร้าง backup ฐานข้อมูล
make restore FILE=backup.sql  # กู้คืนจาก backup
```

### Logs
```bash
make logs              # Development logs
make logs-prod         # Production logs
```

## ขั้นตอนการพัฒนา

### 1. การพัฒนาฟีเจอร์
```bash
# เริ่ม development
make dev

# แก้ไขโค้ด
# Frontend: frontend/
# Backend: backend/

# Services จะรีโหลดอัตโนมัติ
```

### 2. การทดสอบ
```bash
make test             # รัน tests ทั้งหมด
cd frontend && npm test
cd backend && npm test
```

### 3. การ Build
```bash
make build            # Build images
make build-prod       # Build production images
```

## การแก้ไขปัญหา

### ปัญหาที่พบบ่อย

**Port ชนกัน**
```bash
# ตรวจสอบว่า port ใช้อยู่
netstat -tulpn | grep :3000
netstat -tulpn | grep :3001

# ฆ่า process ถ้าจำเป็น
sudo kill -9 <PID>
```

**ปัญหา Docker**
```bash
# รีเซ็ต Docker
make clean
docker system prune -a
```

**การเชื่อมต่อ Database**
```bash
# ตรวจสอบ database logs
docker-compose logs postgres

# ทดสอบการเชื่อมต่อ
docker-compose exec postgres psql -U postgres -d cctv_nvr_monitor
```

### คำสั่งกู้คืน
```bash
# รีเซ็ตทั้งหมด
make clean && make setup

# รีสตาร์ท services
make stop && make run
```

## เอกสารอ้างอิง

- [โครงสร้างโปรเจค](docs/PROJECT_STRUCTURE.md)
- [เอกสาร API](docs/API.md)
- [คู่มือการ Deploy](docs/DEPLOYMENT.md)
- [เอกสาร Frontend](frontend/README.md)
- [เอกสาร Backend](backend/README.md)

## การมีส่วนร่วม

1. Fork repository
2. สร้าง feature branch
3. แก้ไขโค้ดพร้อม tests
4. ส่ง pull request

## ลิขสิทธิ์

[เพิ่มข้อมูลลิขสิทธิ์ที่นี่]

## การสนับสนุน

สำหรับปัญหาและคำถาม:
- ตรวจสอบเอกสารใน `docs/`
- อ่านส่วนการแก้ไขปัญหา
- สร้าง issue ใน repository

---

**พัฒนาด้วย ❤️ สำหรับระบบตรวจสอบ CCTV สมัยใหม่**
