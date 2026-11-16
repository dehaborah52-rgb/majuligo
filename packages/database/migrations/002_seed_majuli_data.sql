-- ==============================================================================
-- MajuliGo Bike-Taxi Platform: Seed Initial Majuli Service Area & Admin
-- Migration: 002_seed_majuli_data.sql
-- ==============================================================================

-- Insert Majuli Service Area Polygon Boundary (approximate bounding envelope for Majuli Island, Assam)
-- Centered around Kamalabari, Garamur, Jengraimukh, Auniati
INSERT INTO service_areas (
    id,
    name,
    boundary,
    base_fare,
    base_included_km,
    per_km_rate,
    per_minute_rate,
    minimum_fare,
    commission_percent,
    is_active
) VALUES (
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'Majuli Island District',
    ST_PolygonFromText(
        'POLYGON((
            93.9500 26.8500,
            94.4000 26.8500,
            94.4500 27.2000,
            94.0000 27.1500,
            93.9500 26.8500
        ))', 
        4326
    ),
    20.00,  -- ₹20 base fare includes first 1.5 km
    1.50,   -- 1.5 km included
    10.00,  -- ₹10 per km beyond base
    1.00,   -- ₹1 per minute
    25.00,  -- ₹25 minimum ride price
    15.00,  -- 15% platform commission
    TRUE
)
ON CONFLICT (id) DO NOTHING;
