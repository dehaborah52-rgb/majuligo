-- ==============================================================================
-- MajuliGo Bike-Taxi Platform: Initial PostgreSQL + PostGIS Schema
-- Migration: 001_initial_schema.sql
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 2. Core Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(15) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    email VARCHAR(255),
    role VARCHAR(20) NOT NULL DEFAULT 'RIDER' CHECK (role IN ('RIDER', 'CAPTAIN', 'ADMIN', 'SUPER_ADMIN', 'SUPPORT')),
    avatar_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    fcm_token TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_phone ON users (phone);
CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);

-- 3. Captains Profile Table
CREATE TABLE IF NOT EXISTS captains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    driving_licence_number VARCHAR(50) UNIQUE NOT NULL,
    dl_expiry_date DATE,
    verification_status VARCHAR(30) NOT NULL DEFAULT 'PENDING_VERIFICATION' 
        CHECK (verification_status IN ('PENDING_VERIFICATION', 'APPROVED', 'REJECTED', 'SUSPENDED')),
    rejection_reason TEXT,
    is_online BOOLEAN NOT NULL DEFAULT FALSE,
    current_location GEOMETRY(Point, 4326),
    heading NUMERIC(5, 2),
    last_location_update TIMESTAMPTZ,
    rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00,
    total_rides INT NOT NULL DEFAULT 0,
    total_earnings NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- PostGIS Spatial Index for lightning-fast radius matching (e.g., ST_DWithin)
CREATE INDEX IF NOT EXISTS idx_captains_location ON captains USING GIST (current_location);
CREATE INDEX IF NOT EXISTS idx_captains_status_online ON captains (verification_status, is_online);

-- 4. Captain Vehicles Table
CREATE TABLE IF NOT EXISTS vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    captain_id UUID UNIQUE NOT NULL REFERENCES captains(id) ON DELETE CASCADE,
    registration_number VARCHAR(20) UNIQUE NOT NULL,
    make_model VARCHAR(100) NOT NULL,
    color VARCHAR(30),
    vehicle_type VARCHAR(20) NOT NULL DEFAULT 'BIKE' CHECK (vehicle_type IN ('BIKE', 'AUTO', 'CAB')),
    photo_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Captain KYC Documents Table
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    captain_id UUID NOT NULL REFERENCES captains(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL CHECK (document_type IN (
        'DRIVING_LICENSE',
        'VEHICLE_REGISTRATION_RC',
        'VEHICLE_INSURANCE',
        'AADHAAR_CARD',
        'PAN_CARD',
        'VEHICLE_PHOTO'
    )),
    document_url TEXT NOT NULL,
    verification_status VARCHAR(30) NOT NULL DEFAULT 'PENDING_VERIFICATION'
        CHECK (verification_status IN ('PENDING_VERIFICATION', 'APPROVED', 'REJECTED')),
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_documents_captain ON documents (captain_id);

-- 6. Configurable Service Areas (Geo-fencing & Local Pricing)
CREATE TABLE IF NOT EXISTS service_areas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    boundary GEOMETRY(Polygon, 4326),
    base_fare NUMERIC(8, 2) NOT NULL DEFAULT 20.00,
    base_included_km NUMERIC(5, 2) NOT NULL DEFAULT 1.50,
    per_km_rate NUMERIC(8, 2) NOT NULL DEFAULT 10.00,
    per_minute_rate NUMERIC(8, 2) NOT NULL DEFAULT 1.00,
    minimum_fare NUMERIC(8, 2) NOT NULL DEFAULT 25.00,
    commission_percent NUMERIC(5, 2) NOT NULL DEFAULT 15.00,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_service_areas_boundary ON service_areas USING GIST (boundary);

-- 7. Rides Booking Lifecycle Table
CREATE TABLE IF NOT EXISTS rides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rider_id UUID NOT NULL REFERENCES users(id),
    captain_id UUID REFERENCES captains(id),
    service_area_id UUID REFERENCES service_areas(id),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN (
        'PENDING',
        'SEARCHING',
        'ACCEPTED',
        'ARRIVED',
        'IN_PROGRESS',
        'COMPLETED',
        'CANCELLED'
    )),
    pickup_address TEXT NOT NULL,
    pickup_location GEOMETRY(Point, 4326) NOT NULL,
    destination_address TEXT NOT NULL,
    destination_location GEOMETRY(Point, 4326) NOT NULL,
    estimated_distance_km NUMERIC(6, 2) NOT NULL,
    estimated_duration_mins INT NOT NULL,
    estimated_fare NUMERIC(8, 2) NOT NULL,
    final_fare NUMERIC(8, 2),
    payment_method VARCHAR(20) NOT NULL DEFAULT 'CASH' CHECK (payment_method IN ('CASH', 'UPI', 'CARD', 'WALLET')),
    payment_status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED')),
    start_otp VARCHAR(6) NOT NULL,
    cancellation_reason TEXT,
    cancelled_by VARCHAR(20) CHECK (cancelled_by IN ('RIDER', 'CAPTAIN', 'ADMIN', 'SYSTEM')),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rides_rider ON rides (rider_id);
CREATE INDEX IF NOT EXISTS idx_rides_captain ON rides (captain_id);
CREATE INDEX IF NOT EXISTS idx_rides_status ON rides (status);
CREATE INDEX IF NOT EXISTS idx_rides_pickup_location ON rides USING GIST (pickup_location);
CREATE INDEX IF NOT EXISTS idx_rides_destination_location ON rides USING GIST (destination_location);

-- 8. Live GPS Breadcrumbs for Active Rides
CREATE TABLE IF NOT EXISTS ride_locations (
    id BIGSERIAL PRIMARY KEY,
    ride_id UUID NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
    location GEOMETRY(Point, 4326) NOT NULL,
    heading NUMERIC(5, 2),
    speed NUMERIC(5, 2),
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ride_locations_ride_time ON ride_locations (ride_id, recorded_at DESC);

-- 9. Captain Financial Earnings Table
CREATE TABLE IF NOT EXISTS captain_earnings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    captain_id UUID NOT NULL REFERENCES captains(id),
    ride_id UUID UNIQUE NOT NULL REFERENCES rides(id),
    gross_fare NUMERIC(8, 2) NOT NULL,
    platform_commission NUMERIC(8, 2) NOT NULL,
    net_earnings NUMERIC(8, 2) NOT NULL,
    payout_status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (payout_status IN ('PENDING', 'SETTLED', 'FAILED')),
    payout_reference TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_captain_earnings_captain ON captain_earnings (captain_id);

-- 10. Ratings & Reviews Table
CREATE TABLE IF NOT EXISTS ratings_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ride_id UUID UNIQUE NOT NULL REFERENCES rides(id),
    reviewer_id UUID NOT NULL REFERENCES users(id),
    reviewee_id UUID NOT NULL REFERENCES users(id),
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Immutable Audit Logging for Security & Compliance
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    target_id VARCHAR(100) NOT NULL,
    details JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs (actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs (action);
