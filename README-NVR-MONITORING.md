# CCTV NVR Monitoring System

A comprehensive CCTV NVR monitoring solution with separated frontend and backend architecture, built with modern web technologies and containerized for easy deployment.

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local development)
- Git

### One-Command Setup
```bash
# Clone and setup
git clone <repository-url>
cd .nvr-monitoring
make setup
```

### Manual Setup
```bash
# 1. Create environment file
cp config/.env.development .env

# 2. Install dependencies
cd cctv-nvr-monitor-frontend && npm install
cd ../cctv-nvr-monitor-backend && npm install

# 3. Start development
make dev
```

## Available Commands

```bash
make help              # Show all available commands
make setup             # Initialize project environment
make dev               # Start development environment
make run               # Run services in background
make build             # Build Docker images
make deploy            # Deploy to production
make health            # Check system health
make logs              # View service logs
make status            # Show service status
make backup            # Backup database
make clean             # Clean up resources
```

## Architecture

### Frontend (React + Vite)
- **Technology**: React 18, TypeScript, Vite
- **UI Framework**: Material-UI, Tailwind CSS
- **State Management**: React Hooks
- **Build Tool**: Vite
- **Port**: 3000 (prod) / 5173 (dev)

### Backend (Node.js + Express)
- **Technology**: Node.js, Express, TypeScript
- **Database**: PostgreSQL
- **API**: RESTful endpoints
- **Authentication**: JWT (future)
- **Port**: 3001

### Database (PostgreSQL)
- **Version**: PostgreSQL 15
- **Schema**: Optimized for NVR monitoring
- **Backup**: Automated with scripts
- **Port**: 5432

## Project Structure

```
.nvr-monitoring/
├── config/              # Configuration files
├── scripts/             # Utility scripts
├── docs/                # Documentation
├── deploy/              # Deployment configs
├── cctv-nvr-monitor-frontend/  # React app
└── cctv-nvr-monitor-backend/   # Node.js API
```

## Access URLs

| Environment | Frontend | Backend API | Database |
|-------------|-----------|-------------|-----------|
| Development | http://localhost:5173 | http://localhost:3001 | localhost:5432 |
| Production | http://localhost:80 | http://localhost:3001 | localhost:5432 |

## Configuration

### Environment Variables
Copy the appropriate template and update values:
- Development: `config/.env.development`
- Production: `config/.env.production`

### Key Settings
- `VITE_API_URL`: Backend API endpoint
- `DATABASE_URL`: PostgreSQL connection string
- `FRONTEND_URL`: Frontend URL for CORS

## Docker Deployment

### Development
```bash
make dev               # Start with hot reload
make dev-detach       # Start in background
```

### Production
```bash
make deploy            # Full production deployment
make run-prod         # Run production services
```

## Monitoring & Maintenance

### Health Checks
```bash
make health            # Check all services
curl http://localhost:3001/health  # Backend health
```

### Backup & Restore
```bash
make backup           # Create database backup
make restore FILE=backup.sql  # Restore from backup
```

### Logs
```bash
make logs              # Development logs
make logs-prod         # Production logs
```

## Development Workflow

### 1. Feature Development
```bash
# Start development
make dev

# Make changes to code
# Frontend: cctv-nvr-monitor-frontend/
# Backend: cctv-nvr-monitor-backend/

# Services auto-reload
```

### 2. Testing
```bash
make test             # Run all tests
cd cctv-nvr-monitor-frontend && npm test
cd cctv-nvr-monitor-backend && npm test
```

### 3. Building
```bash
make build            # Build images
make build-prod       # Build production images
```

## Troubleshooting

### Common Issues

**Port Conflicts**
```bash
# Check what's using ports
netstat -tulpn | grep :3000
netstat -tulpn | grep :3001

# Kill processes if needed
sudo kill -9 <PID>
```

**Docker Issues**
```bash
# Reset Docker
make clean
docker system prune -a
```

**Database Connection**
```bash
# Check database logs
docker-compose logs postgres

# Test connection
docker-compose exec postgres psql -U postgres -d cctv_nvr_monitor
```

### Recovery Commands
```bash
# Complete reset
make clean && make setup

# Restart services
make stop && make run
```

## Documentation

- [Project Structure](docs/PROJECT_STRUCTURE.md)
- [API Documentation](docs/API.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Frontend Docs](cctv-nvr-monitor-frontend/README.md)
- [Backend Docs](cctv-nvr-monitor-backend/README.md)

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

## License

[Add your license information here]

## Support

For issues and questions:
- Check documentation in `docs/`
- Review troubleshooting section
- Create issue in repository

---

**Built with ❤️ for modern CCTV monitoring**
