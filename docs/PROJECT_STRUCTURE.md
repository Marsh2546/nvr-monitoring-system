# 🎥 CCTV NVR Monitoring System - Project Structure

## 📁 Directory Structure

```
.nvr-monitoring/
├── 📄 README-NVR-MONITORING.md     # Main project documentation
├── 📄 Makefile                     # Build and deployment commands
├── 📄 .gitignore                   # Git ignore rules
├── 📁 config/                      # Configuration files
│   ├── 📄 .env.development         # Development environment template
│   ├── 📄 .env.production          # Production environment template
│   ├── 📄 docker-compose.separated.yml    # Development Docker setup
│   └── 📄 docker-compose.production.yml    # Production Docker setup
├── 📁 scripts/                     # Utility scripts
│   ├── 📄 build-images.bat         # Windows build script
│   ├── 📄 build-images.sh          # Linux/Mac build script
│   └── 📄 nvr-monitoring-setup.bat # Environment setup
├── 📁 docs/                        # Documentation
│   ├── 📄 PROJECT_STRUCTURE.md     # This file
│   └── 📄 README-SEPARATED.md     # Separation documentation
├── 📁 deploy/                      # Deployment configurations
├── 📁 cctv-nvr-monitor-frontend/    # React frontend application
│   ├── 📄 package.json             # Frontend dependencies
│   ├── 📄 Dockerfile              # Frontend Docker build
│   ├── 📄 nginx.conf              # Nginx configuration
│   └── 📁 src/                   # Frontend source code
└── 📁 cctv-nvr-monitor-backend/     # Node.js backend API
    ├── 📄 package.json             # Backend dependencies
    ├── 📄 Dockerfile              # Backend Docker build
    └── 📁 src/                   # Backend source code
```

## 🎯 Best Practices Implemented

### 1. **Separation of Concerns**
- **Frontend**: React/Vite application
- **Backend**: Node.js/Express API
- **Database**: PostgreSQL with proper schema
- **Configuration**: Environment-specific configs

### 2. **Environment Management**
- **Development**: Local development setup
- **Production**: Production-ready configuration
- **Environment Variables**: Secure credential management

### 3. **Docker Strategy**
- **Multi-stage builds**: Optimized image sizes
- **Service isolation**: Separate containers
- **Network management**: Internal communication
- **Volume persistence**: Data persistence

### 4. **Development Workflow**
- **Automated setup**: One-command initialization
- **Hot reload**: Development efficiency
- **Health checks**: Service monitoring
- **Logging**: Centralized logging

### 5. **Deployment Strategy**
- **Zero-downtime**: Rolling updates
- **Backup/Restore**: Data protection
- **Health monitoring**: Service availability
- **Environment parity**: Dev/prod consistency

## 🚀 Quick Start Commands

```bash
# Initialize project
make setup

# Start development
make dev

# Build and run production
make deploy

# Check system health
make health

# View all commands
make help
```

## 📋 Service URLs

| Environment | Frontend | Backend API | Database |
|-------------|-----------|-------------|-----------|
| Development | http://localhost:5173 | http://localhost:3001 | localhost:5432 |
| Production | http://localhost:80 | http://localhost:3001 | localhost:5432 |

## 🔧 Configuration Management

### Development Environment
- Copy `config/.env.development` to `.env`
- Update values as needed
- Run `make setup` to initialize

### Production Environment
- Copy `config/.env.production` to `.env`
- Update with production values
- Ensure security best practices

## 📊 Monitoring & Maintenance

### Health Checks
- Backend: `GET /health`
- Frontend: HTTP status check
- Database: Connection validation

### Backup Strategy
- Automated backups: `make backup`
- Manual restore: `make restore FILE=backup.sql`
- Data persistence: Docker volumes

### Logging
- Application logs: Docker containers
- Access logs: Nginx
- Database logs: PostgreSQL

## 🛠️ Troubleshooting

### Common Issues
1. **Port conflicts**: Check if ports 3000, 3001, 5432 are available
2. **Database connection**: Verify `.env` configuration
3. **Build failures**: Check Docker daemon and disk space
4. **Permission issues**: Ensure Docker permissions

### Recovery Commands
```bash
# Reset everything
make clean && make setup

# Restart services
make stop && make run

# Check logs
make logs
```

## 🔄 CI/CD Integration

### GitHub Actions Example
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy
        run: |
          make deploy
```

## 📚 Additional Resources

- [Frontend Documentation](cctv-nvr-monitor-frontend/README.md)
- [Backend Documentation](cctv-nvr-monitor-backend/README.md)
- [API Documentation](docs/API.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
