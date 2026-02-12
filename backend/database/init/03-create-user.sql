-- Create database user for the application
-- This script creates a dedicated user for the NVR monitoring application

-- Create application user
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'nvr_app_user') THEN
        RAISE NOTICE 'User nvr_app_user already exists';
    ELSE
        CREATE USER nvr_app_user WITH PASSWORD 'nvr_app_password';
        GRANT CONNECT ON DATABASE cctv_nvr_monitor TO nvr_app_user;
        GRANT USAGE ON SCHEMA public TO nvr_app_user;
        GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO nvr_app_user;
        GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO nvr_app_user;
        RAISE NOTICE 'User nvr_app_user created successfully';
    END IF;
END
$$;

-- Create read-only user for reporting
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'nvr_readonly_user') THEN
        RAISE NOTICE 'User nvr_readonly_user already exists';
    ELSE
        CREATE USER nvr_readonly_user WITH PASSWORD 'readonly_password';
        GRANT CONNECT ON DATABASE cctv_nvr_monitor TO nvr_readonly_user;
        GRANT USAGE ON SCHEMA public TO nvr_readonly_user;
        GRANT SELECT ON ALL TABLES IN SCHEMA public TO nvr_readonly_user;
        GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO nvr_readonly_user;
        RAISE NOTICE 'User nvr_readonly_user created successfully';
    END IF;
END
$$;
