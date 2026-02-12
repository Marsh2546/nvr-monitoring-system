# CCTV NVR Monitor - Backend

Node.js/Express backend API for CCTV NVR monitoring system.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Configure your database connection in `.env`

5. Start development server:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3001`

## 📦 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run start` - Start production server
- `npm run build` - Build TypeScript files

## 🐳 Docker Deployment

Build and run with Docker:
```bash
docker build -t cctv-nvr-backend .
docker run -p 3001:3001 --env-file .env cctv-nvr-backend
```

Or use docker-compose with the frontend:
```bash
docker-compose -f ../docker-compose.separated.yml up backend
```

## 🔧 Environment Variables

- `PORT` - Server port (default: 3001)
- `DATABASE_URL` - PostgreSQL connection string
- `DB_HOST` - Database host
- `DB_PORT` - Database port
- `DB_NAME` - Database name
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:5173)

## 📡 API Endpoints

### Health Check
- `GET /health` - Check server and database health

### NVR Data
- `GET /api/nvr-status` - Get current NVR status
- `GET /api/nvr-status-history` - Get NVR status history
- `GET /api/cameras` - Get all cameras

### Snapshots
- `GET /api/snapshots` - Get snapshot data
- `GET /api/snapshot-logs` - Get snapshot logs
- `POST /api/trigger-snapshots` - Trigger manual snapshots
- `POST /api/log-snapshots` - Log scheduled snapshots
- `POST /api/cleanup-logs` - Cleanup old log entries

### Static Files
- `GET /snapshots/*` - Serve snapshot files

## 🗄️ Database Setup

The database schema is automatically created from SQL files in the `database/init/` directory when using Docker. For manual setup:

1. Create database:
   ```sql
   CREATE DATABASE cctv_nvr_monitor;
   ```

2. Run initialization scripts:
   ```bash
   psql -d cctv_nvr_monitor -f database/init/01-create-tables.sql
   psql -d cctv_nvr_monitor -f database/init/02-setup-cron.sql
   psql -d cctv_nvr_monitor -f database/init/03-sample-data.sql
   ```

## 🔒 CORS Configuration

The backend is configured to accept requests from the frontend URL specified in the `FRONTEND_URL` environment variable. Make sure this matches your frontend deployment URL.

## 📁 Project Structure

```
src/
├── server.ts           # Main Express server
├── databaseService.ts  # Database operations
└── types/             # TypeScript types

database/
└── init/              # Database initialization scripts
```

## 🔄 Development

The server automatically restarts on file changes when using `npm run dev`. Database connection errors are logged, and the server will attempt to reconnect.
