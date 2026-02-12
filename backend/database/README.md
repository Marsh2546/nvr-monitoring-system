# Database Initialization Scripts

This directory contains SQL scripts for initializing the NVR monitoring database.

## Files

### 01-init-database.sql
- Creates all necessary tables for the NVR monitoring system
- Sets up indexes for optimal performance
- Inserts sample NVR stations and cameras
- Inserts initial NVR status history data

### 02-sample-data.sql
- Contains sample NVR status history data with different timestamps
- Includes historical data (1 hour, 1 day, 1 week ago)
- Adds sample snapshot logs for testing

### 03-create-user.sql
- Creates dedicated database users:
  - `nvr_app_user`: Full access for the application
  - `nvr_readonly_user`: Read-only access for reporting

## Tables Created

### nvr_stations
Stores NVR device information and connection details.

### cameras
Stores camera information linked to NVR stations.

### nvr_status_history
Stores historical NVR status data for monitoring and reporting.

### snapshot_logs
Stores snapshot execution logs and status.

## Usage

These scripts are automatically executed when:
1. Starting a new PostgreSQL container with the init volume mounted
2. Running `make dev` with Docker Compose
3. Manual database initialization

## Security Notes

- Default passwords are for development only
- Change passwords in production environment
- Use environment variables for sensitive data
- Consider using secrets management in production

## Data Flow

1. NVR devices report status → `nvr_status_history`
2. System processes snapshots → `snapshot_logs`
3. Frontend queries API → Backend reads from these tables
4. Historical data is preserved for trend analysis
