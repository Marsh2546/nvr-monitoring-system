# CCTV NVR Monitor - Separated Architecture

This project has been separated into two independent repositories for better scalability and maintainability.

## 📁 Repository Structure

```
├── cctv-nvr-monitor-frontend/    # React frontend application
├── cctv-nvr-monitor-backend/     # Node.js/Express backend API
└── docker-compose.separated.yml  # Docker composition for both services
```

## 🚀 Quick Start

### Using Docker Compose (Recommended)

1. Start all services:
   ```bash
   docker-compose -f docker-compose.separated.yml up -d
   ```

2. Access the applications:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Database: localhost:5432

### Manual Setup

#### Frontend
```bash
cd cctv-nvr-monitor-frontend
npm install
cp .env.example .env
npm run dev
```

#### Backend
```bash
cd cctv-nvr-monitor-backend
npm install
cp .env.example .env
# Configure database connection in .env
npm run dev
```

## 🔗 Service Communication

- **Frontend** runs on port 3000 (production) or 5173 (development)
- **Backend** runs on port 3001
- **Database** runs on port 5432

The frontend communicates with the backend through REST API endpoints. CORS is configured to allow requests from the frontend URL.

## 🐳 Docker Services

### Frontend Container
- Built with multi-stage Dockerfile
- Served by Nginx in production
- Includes API proxy configuration

### Backend Container
- Node.js 18 Alpine base image
- TypeScript compilation
- Express server with PostgreSQL connection

### Database Container
- PostgreSQL 15 Alpine
- Automatic schema initialization
- Persistent data volume

## 🔧 Configuration

### Environment Variables

**Frontend (.env):**
- `VITE_API_URL` - Backend API URL
- `VITE_API_FALLBACK_URL` - Fallback API URL

**Backend (.env):**
- `PORT` - Server port
- `DATABASE_URL` - PostgreSQL connection string
- `FRONTEND_URL` - Frontend URL for CORS

## 📡 API Documentation

The backend provides the following main endpoints:

- `GET /api/nvr-status` - NVR status data
- `GET /api/cameras` - Camera information
- `GET /api/snapshots` - Snapshot data
- `GET /health` - Health check

See the backend README for complete API documentation.

## 🔄 Development Workflow

1. **Frontend Development**: Focus on UI/UX improvements
2. **Backend Development**: Focus on API and database logic
3. **Independent Deployment**: Each service can be deployed separately
4. **Scaling**: Services can be scaled independently based on load

## 🚀 Deployment Options

### Development
- Frontend: Vite dev server (port 5173)
- Backend: Node.js with tsx watch (port 3001)

### Production
- Frontend: Nginx serving static files (port 3000)
- Backend: Node.js Express server (port 3001)
- Database: PostgreSQL (port 5432)

### Cloud Deployment
- Frontend: Vercel, Netlify, or static hosting
- Backend: Heroku, AWS, Google Cloud, or similar
- Database: PostgreSQL cloud service

## 🛠️ Benefits of Separation

1. **Independent Scaling**: Scale frontend and backend separately
2. **Technology Flexibility**: Use different tech stacks if needed
3. **Team Collaboration**: Frontend and backend teams can work independently
4. **Deployment Flexibility**: Deploy updates to one service without affecting the other
5. **Better Security**: Isolate sensitive backend logic
6. **Microservices Ready**: Easy to extend to additional services

## 📝 Migration Notes

This separation maintains all existing functionality while providing better architecture. The original monorepo structure has been preserved in the original project for reference.

## 🔍 Troubleshooting

1. **CORS Issues**: Ensure `FRONTEND_URL` in backend matches frontend URL
2. **Database Connection**: Verify database is running and credentials are correct
3. **API Connection**: Check that backend is accessible from frontend
4. **Port Conflicts**: Ensure ports 3000, 3001, and 5432 are available
