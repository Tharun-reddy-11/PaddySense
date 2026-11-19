-- PaddySense Normalized MySQL Database Schema
CREATE DATABASE IF NOT EXISTS paddysense_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE paddysense_db;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'ROLE_FARMER',
    phone VARCHAR(30),
    state VARCHAR(100),
    district VARCHAR(100),
    village VARCHAR(100),
    preferred_unit VARCHAR(20) DEFAULT 'hectare',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS fields (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    field_name VARCHAR(150) NOT NULL,
    area_hectares DOUBLE NOT NULL,
    state VARCHAR(100),
    district VARCHAR(100),
    village VARCHAR(100),
    latitude DOUBLE,
    longitude DOUBLE,
    soil_texture VARCHAR(50) DEFAULT 'Clay Loam',
    soil_ph DOUBLE DEFAULT 7.8,
    soil_organic_carbon_pct DOUBLE DEFAULT 0.85,
    rice_variety VARCHAR(100) DEFAULT 'Semi-dwarf High Yielding',
    current_season VARCHAR(50) DEFAULT 'Kharif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS assessments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    field_id BIGINT NOT NULL,
    season VARCHAR(50) NOT NULL,
    planting_date DATE,
    expected_harvest_date DATE,
    status VARCHAR(50) DEFAULT 'COMPLETED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS assessment_inputs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    assessment_id BIGINT NOT NULL UNIQUE,
    soil_ph DOUBLE NOT NULL,
    soil_organic_carbon_pct DOUBLE NOT NULL,
    soil_nitrogen_pct DOUBLE NOT NULL,
    soil_texture VARCHAR(50) NOT NULL,
    bulk_density_g_cm3 DOUBLE NOT NULL,
    water_management_method VARCHAR(100) NOT NULL,
    flooding_duration_days DOUBLE NOT NULL,
    drying_duration_days DOUBLE NOT NULL,
    water_depth_cm DOUBLE NOT NULL,
    irrigation_frequency_season INT NOT NULL,
    nitrogen_fertilizer_kg_ha DOUBLE NOT NULL,
    fertilizer_type VARCHAR(100) NOT NULL,
    fertilizer_application_method VARCHAR(100) NOT NULL,
    fertilizer_split_count INT NOT NULL,
    straw_residue_management VARCHAR(100) NOT NULL,
    straw_residue_kg_ha DOUBLE NOT NULL,
    rice_variety_group VARCHAR(100) NOT NULL,
    crop_duration_days INT NOT NULL,
    planting_method VARCHAR(50) NOT NULL,
    avg_temperature_c DOUBLE NOT NULL,
    total_rainfall_mm DOUBLE NOT NULL,
    relative_humidity_pct DOUBLE NOT NULL,
    FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS predictions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    assessment_id BIGINT NOT NULL UNIQUE,
    estimated_seasonal_ch4_kg_ha DOUBLE NOT NULL,
    unit VARCHAR(50) DEFAULT 'kg CH4/ha/season',
    risk_category VARCHAR(50) NOT NULL,
    pmei_score DOUBLE NOT NULL,
    prob_low DOUBLE DEFAULT 0.0,
    prob_moderate DOUBLE DEFAULT 0.0,
    prob_high DOUBLE DEFAULT 0.0,
    prob_very_high DOUBLE DEFAULT 0.0,
    unc_90_lower DOUBLE NOT NULL,
    unc_90_upper DOUBLE NOT NULL,
    unc_95_lower DOUBLE NOT NULL,
    unc_95_upper DOUBLE NOT NULL,
    model_name VARCHAR(150) NOT NULL,
    model_version VARCHAR(50) NOT NULL,
    scientific_disclaimer TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS prediction_explanations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    prediction_id BIGINT NOT NULL,
    feature_name VARCHAR(100) NOT NULL,
    feature_value VARCHAR(100),
    contribution_kg_ha DOUBLE NOT NULL,
    direction VARCHAR(50) NOT NULL,
    agronomic_note TEXT,
    FOREIGN KEY (prediction_id) REFERENCES predictions(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS recommendations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    assessment_id BIGINT NOT NULL,
    category VARCHAR(100) NOT NULL,
    title VARCHAR(200) NOT NULL,
    current_practice TEXT,
    recommended_action TEXT NOT NULL,
    estimated_impact TEXT,
    potential_trade_offs TEXT,
    evidence_source VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS scenario_comparisons (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    assessment_id BIGINT NOT NULL,
    scenario_title VARCHAR(150) NOT NULL,
    baseline_emission_kg_ha DOUBLE NOT NULL,
    alternative_emission_kg_ha DOUBLE NOT NULL,
    difference_kg_ha DOUBLE NOT NULL,
    percentage_change DOUBLE NOT NULL,
    mitigation_direction VARCHAR(50) NOT NULL,
    trade_off_warning TEXT,
    notes_json TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'INFO',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;
