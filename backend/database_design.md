# Bien Unido Citizen App - Database Design

## Overview

This document outlines the complete database schema for the Bien Unido Citizen App, detailing table structures, relationships, and key constraints to support all application features.

## Entity Relationship Diagram

```
                           ┌────────────────────┐
                           │       users        │
                           ├────────────────────┤
                           │ id (PK)            │
                           │ first_name         │
                           │ last_name          │
                           │ email              │
                           │ mobile             │
                           │ address            │
                           │ barangay           │◄─────────────────┐
                           │ password_hash      │                  │
                           │ role               │                  │
                           └──────┬─────────────┘                  │
                                  │                                │
          ┌───────────────────────┼────────────────┬──────────────┼──────────────────┐
          │                       │                │              │                  │
          ▼                       ▼                ▼              │                  ▼
┌──────────────────┐    ┌──────────────────┐    ┌─────────────┐   │       ┌──────────────────┐
│  user_devices    │    │      reports     │    │   alerts    │   │       │ service_requests │
├──────────────────┤    ├──────────────────┤    ├─────────────┤   │       ├──────────────────┤
│ id (PK)          │    │ id (PK)          │    │ id (PK)     │   │       │ id (PK)          │
│ user_id (FK)     │◄──┐│ user_id (FK)     │    │ title       │   │       │ service_id (FK)  │◄─┐
│ device_token     │   ││ type             │    │ body        │   │       │ user_id (FK)     │  │
│ device_type      │   ││ title            │    │ category    │   │       │ reference_number │  │
└──────────────────┘   ││ description      │    │ importance  │   │       │ status           │  │
                       ││ location_address │    │ barangay    │◄──┘       │ appointment_date │  │
                       ││ location_lat     │    │ image_url   │           │ assigned_to (FK) │  │
                       ││ location_lng     │    │ is_active   │           └─────┬────────────┘  │
                       ││ barangay         │◄──┐│ created_by  │◄───┐            │               │
                       ││ status           │   ││ created_at  │    │            │               │
                       │└──────┬───────────┘   │└─────┬───────┘    │            ▼               │
                       │       │               │      │            │    ┌─────────────────┐     │
                       │       ▼               │      ▼            │    │request_documents│     │
                       │┌─────────────────┐    │┌────────────┐     │    ├─────────────────┤     │
                       ││  report_images  │    ││ alert_reads │     │    │ id (PK)         │     │
                       │├─────────────────┤    │├────────────┤     │    │ service_request_│     │
                       ││ id (PK)         │    ││ id (PK)    │     │    │ document_url    │     │
                       ││ report_id (FK)  │    ││ alert_id   │     │    │ document_type   │     │
                       ││ image_url       │    ││ user_id    │◄────┘    │ is_verified     │     │
                       │└─────────────────┘    │└────────────┘          └─────────────────┘     │
                       │                       │                                                │
                       ▼                       │                                                │
            ┌───────────────────┐              │                                                │
            │  report_comments  │              │                                                │
            ├───────────────────┤              │                                                │
            │ id (PK)           │              │                                                │
            │ report_id (FK)    │              │                                                │
            │ user_id (FK)      │◄─────────────┘                                                │
            │ comment           │                                                               │
            └───────────────────┘                                                               │
                       │                                                                        │
                       ▼                                                                        │
            ┌─────────────────────────┐                    ┌────────────┐                       │
            │ report_status_history   │                    │  services  │                       │
            ├─────────────────────────┤                    ├────────────┤                       │
            │ id (PK)                 │                    │ id (PK)    │───────────────────────┘
            │ report_id (FK)          │                    │ name       │
            │ user_id (FK)            │◄──┐                │ description│
            │ old_status              │   │                │ category   │
            │ new_status              │   │                │ is_active  │
            └─────────────────────────┘   │                └─────┬──────┘
                                          │                      │
                                          │                      ▼
                                          │                ┌───────────────┐
┌─────────────────────┐                   │                │   documents   │
│      officials      │                   │                ├───────────────┤
├─────────────────────┤                   │                │ id (PK)       │
│ id (PK)             │                   │                │ title         │
│ user_id (FK)        │◄──────────────────┘                │ category      │
│ name                │                                    │ file_url      │
│ position            │                                    │ service_id (FK)│◄─┐
│ department          │                                    └───────────────┘  │
│ barangay            │◄───┐                                                 │
│ is_active           │    │                                                 │
└─────────────────────┘    │                                                 │
                           │                                                 │
                           │                                                 │
┌─────────────────────┐    │             ┌────────────────────┐              │
│     barangays       │    │             │  service_schedules │              │
├─────────────────────┤    │             ├────────────────────┤              │
│ id (PK)             │    │             │ id (PK)            │              │
│ name                │◄───┘             │ service_type       │◄─────────────┘
│ captain_name        │                  │ day_of_week        │
│ contact_number      │                  │ start_time         │
│ office_address      │                  │ end_time           │
│ population          │                  │ barangay           │◄────────────┐
│ lat                 │                  │ recurring          │             │
│ lng                 │                  └────────────────────┘             │
└─────────────────────┘                                                     │
        │                                                                   │
        │                                                                   │
        ▼                                                                   │
┌─────────────────────┐                  ┌────────────────┐                 │
│    app_settings     │                  │  office_hours  │                 │
├─────────────────────┤                  ├────────────────┤                 │
│ id (PK)             │                  │ id (PK)        │                 │
│ setting_key         │                  │ department     │                 │
│ setting_value       │                  │ day_of_week    │                 │
│ description         │                  │ open_time      │                 │
└─────────────────────┘                  │ close_time     │                 │
                                         │ is_closed      │                 │
                                         └────────────────┘                 │
                                                                           │
                                                                           │
                                                                           │
                                                                           │
                                                                           │
                                                                           │
                                                                           │
                                                                           └───────────────────────┘
```

## Tables Schema

### Users & Authentication

#### `users` Table

```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    mobile VARCHAR(20) UNIQUE NOT NULL,
    address VARCHAR(255) NOT NULL,
    barangay VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    profile_photo_url VARCHAR(255),
    role ENUM('citizen', 'admin', 'official') NOT NULL DEFAULT 'citizen',
    verification_status BOOLEAN DEFAULT FALSE,
    verification_code VARCHAR(6),
    reset_token VARCHAR(255),
    reset_token_expires DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### `user_devices` Table

```sql
CREATE TABLE user_devices (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    device_token VARCHAR(255) NOT NULL,
    device_type ENUM('android', 'ios', 'web') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Issue Reporting System

#### `reports` Table

```sql
CREATE TABLE reports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    type ENUM('garbage', 'road_damage', 'flooding', 'electricity', 'water_supply', 'public_safety', 'others') NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    location_address VARCHAR(255) NOT NULL,
    location_lat DECIMAL(10, 8) NOT NULL,
    location_lng DECIMAL(11, 8) NOT NULL,
    barangay VARCHAR(50) NOT NULL,
    status ENUM('pending', 'assigned', 'in_progress', 'resolved', 'closed', 'rejected') DEFAULT 'pending',
    priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    assigned_to INT,
    resolution_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);
```

#### `report_images` Table

```sql
CREATE TABLE report_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    report_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
);
```

#### `report_comments` Table

```sql
CREATE TABLE report_comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    report_id INT NOT NULL,
    user_id INT NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### `report_status_history` Table

```sql
CREATE TABLE report_status_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    report_id INT NOT NULL,
    user_id INT NOT NULL,
    old_status ENUM('pending', 'assigned', 'in_progress', 'resolved', 'closed', 'rejected'),
    new_status ENUM('pending', 'assigned', 'in_progress', 'resolved', 'closed', 'rejected') NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Alerts & Announcements

#### `alerts` Table

```sql
CREATE TABLE alerts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    body TEXT NOT NULL,
    category ENUM('emergency', 'weather', 'event', 'announcement', 'health', 'traffic') NOT NULL,
    importance ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    barangay VARCHAR(50) DEFAULT 'ALL',
    image_url VARCHAR(255),
    start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    end_date DATETIME,
    is_active BOOLEAN DEFAULT TRUE,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);
```

#### `alert_reads` Table

```sql
CREATE TABLE alert_reads (
    id INT PRIMARY KEY AUTO_INCREMENT,
    alert_id INT NOT NULL,
    user_id INT NOT NULL,
    read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (alert_id) REFERENCES alerts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (alert_id, user_id)
);
```

### Public Services

#### `services` Table

```sql
CREATE TABLE services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    category ENUM('sanitation', 'health', 'permits', 'certificates', 'social_welfare', 'payments') NOT NULL,
    requirements TEXT,
    estimated_completion VARCHAR(50),
    fee DECIMAL(10, 2),
    department VARCHAR(100) NOT NULL,
    is_online_application BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### `service_schedules` Table

```sql
CREATE TABLE service_schedules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    service_type VARCHAR(100) NOT NULL,
    day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    barangay VARCHAR(50) NOT NULL,
    description TEXT,
    recurring BOOLEAN DEFAULT TRUE,
    next_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### `service_requests` Table

```sql
CREATE TABLE service_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    service_id INT NOT NULL,
    user_id INT NOT NULL,
    reference_number VARCHAR(20) UNIQUE NOT NULL,
    status ENUM('submitted', 'processing', 'approved', 'rejected', 'completed', 'cancelled') DEFAULT 'submitted',
    appointment_date DATE,
    appointment_time TIME,
    additional_info TEXT,
    rejection_reason TEXT,
    assigned_to INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES services(id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);
```

#### `documents` Table

```sql
CREATE TABLE documents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    category ENUM('form', 'permit', 'certificate', 'brochure', 'guide') NOT NULL,
    file_url VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    service_id INT,
    is_public BOOLEAN DEFAULT TRUE,
    download_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL
);
```

#### `request_documents` Table

```sql
CREATE TABLE request_documents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    service_request_id INT NOT NULL,
    document_url VARCHAR(255) NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (service_request_id) REFERENCES service_requests(id) ON DELETE CASCADE
);
```

### Government Directory

#### `officials` Table

```sql
CREATE TABLE officials (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    barangay VARCHAR(50),
    contact_number VARCHAR(20),
    email VARCHAR(100),
    office_location VARCHAR(255),
    bio TEXT,
    photo_url VARCHAR(255),
    term_start DATE,
    term_end DATE,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

#### `office_hours` Table

```sql
CREATE TABLE office_hours (
    id INT PRIMARY KEY AUTO_INCREMENT,
    department VARCHAR(100) NOT NULL,
    day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
    open_time TIME NOT NULL,
    close_time TIME NOT NULL,
    is_closed BOOLEAN DEFAULT FALSE,
    special_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### System Configuration

#### `barangays` Table

```sql
CREATE TABLE barangays (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    captain_name VARCHAR(100),
    contact_number VARCHAR(20),
    office_address VARCHAR(255),
    population INT,
    lat DECIMAL(10, 8),
    lng DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### `app_settings` Table

```sql
CREATE TABLE app_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(50) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Indexes

```sql
-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_mobile ON users(mobile);
CREATE INDEX idx_users_barangay ON users(barangay);

-- Reports
CREATE INDEX idx_reports_user ON reports(user_id);
CREATE INDEX idx_reports_type ON reports(type);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_barangay ON reports(barangay);
CREATE INDEX idx_reports_created_at ON reports(created_at);

-- Service Requests
CREATE INDEX idx_service_requests_user ON service_requests(user_id);
CREATE INDEX idx_service_requests_status ON service_requests(status);
CREATE INDEX idx_service_requests_reference ON service_requests(reference_number);

-- Alerts
CREATE INDEX idx_alerts_category ON alerts(category);
CREATE INDEX idx_alerts_active ON alerts(is_active);
CREATE INDEX idx_alerts_barangay ON alerts(barangay);
CREATE INDEX idx_alerts_date ON alerts(start_date);
```

## Initial Data

The database should be seeded with initial data including:

1. Default admin user
2. List of all barangays in Bien Unido
3. Basic service categories
4. Common document types
5. Government official positions

## Backup Strategy

1. Daily automated backups
2. Point-in-time recovery capability
3. Backup encryption
4. Off-site backup storage
5. Regular backup restoration testing

## Data Migration Plan

When deploying the application:

1. Create database schema
2. Run seed scripts for default data
3. If upgrading from a previous system, implement appropriate data migration scripts
4. Verify data integrity after migration
