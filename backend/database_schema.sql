-- Create database
CREATE DATABASE IF NOT EXISTS bien_unido_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bien_unido_app;

-- Users & Authentication
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

CREATE TABLE user_devices (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    device_token VARCHAR(255) NOT NULL,
    device_type ENUM('android', 'ios', 'web') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Issue Reporting System
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

CREATE TABLE report_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    report_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
);

CREATE TABLE report_comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    report_id INT NOT NULL,
    user_id INT NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

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

-- Alerts & Announcements
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

CREATE TABLE alert_reads (
    id INT PRIMARY KEY AUTO_INCREMENT,
    alert_id INT NOT NULL,
    user_id INT NOT NULL,
    read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (alert_id) REFERENCES alerts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (alert_id, user_id)
);

-- Public Services
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

-- Government Directory
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

-- System Configuration
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

CREATE TABLE app_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(50) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Indexes
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

-- Seed Data

-- Insert default admin user (password: admin123)
INSERT INTO users (first_name, last_name, email, mobile, address, barangay, password_hash, role, verification_status)
VALUES ('Admin', 'User', 'admin@bienunido.gov.ph', '09123456789', 'Bien Unido Municipal Hall', 'Poblacion', '$2b$10$XKYBGVUe5OtFJ3OFPT6CFutYqdA9FdWy5fLAUl3jVxVhxt.XlGIeK', 'admin', TRUE);

-- Insert list of barangays in Bien Unido
INSERT INTO barangays (name, captain_name, office_address) VALUES
('Bilangbilangan Diot', 'Captain Name', 'Barangay Hall, Bilangbilangan Diot'),
('Bilangbilangan Daku', 'Captain Name', 'Barangay Hall, Bilangbilangan Daku'),
('Hingotanan East', 'Captain Name', 'Barangay Hall, Hingotanan East'),
('Hingotanan West', 'Captain Name', 'Barangay Hall, Hingotanan West'),
('Liberty', 'Captain Name', 'Barangay Hall, Liberty'),
('Mandawa', 'Captain Name', 'Barangay Hall, Mandawa'),
('Malingin', 'Captain Name', 'Barangay Hall, Malingin'),
('New Poblacion', 'Captain Name', 'Barangay Hall, New Poblacion'),
('Poblacion', 'Captain Name', 'Barangay Hall, Poblacion'),
('Puerto San Pedro', 'Captain Name', 'Barangay Hall, Puerto San Pedro'),
('Sagasa', 'Captain Name', 'Barangay Hall, Sagasa'),
('Saguise', 'Captain Name', 'Barangay Hall, Saguise'),
('Tam-is', 'Captain Name', 'Barangay Hall, Tam-is'),
('Tuboran', 'Captain Name', 'Barangay Hall, Tuboran'),
('Tuburan', 'Captain Name', 'Barangay Hall, Tuburan'),
('Villa Hermosa', 'Captain Name', 'Barangay Hall, Villa Hermosa');

-- Insert common services
INSERT INTO services (name, description, category, department, estimated_completion, fee, is_online_application) VALUES
('Birth Certificate', 'Official birth certificate issuance', 'certificates', 'Civil Registry', '1-2 days', 100.00, TRUE),
('Death Certificate', 'Official death certificate issuance', 'certificates', 'Civil Registry', '1-2 days', 100.00, TRUE),
('Marriage Certificate', 'Official marriage certificate issuance', 'certificates', 'Civil Registry', '1-2 days', 100.00, TRUE),
('Business Permit', 'Business permit application and renewal', 'permits', 'Business Permit and Licensing', '3-5 days', 500.00, TRUE),
('Barangay Clearance', 'Clearance issued by the barangay', 'certificates', 'Barangay Affairs', '1 day', 50.00, FALSE),
('Building Permit', 'Permit for construction of buildings', 'permits', 'Engineering', '5-7 days', 1000.00, TRUE),
('Garbage Collection', 'Regular garbage collection services', 'sanitation', 'Waste Management', 'Weekly', 0.00, FALSE),
('Medical Mission', 'Free medical checkups and services', 'health', 'Health Department', 'Monthly', 0.00, FALSE),
('Community Aid', 'Financial assistance for qualified residents', 'social_welfare', 'Social Welfare', '7-14 days', 0.00, TRUE),
('Real Property Tax Payment', 'Payment for real property taxes', 'payments', 'Treasury', 'Same day', 0.00, TRUE);

-- Insert sample service schedules
INSERT INTO service_schedules (service_type, day_of_week, start_time, end_time, barangay, description, recurring) VALUES
('Garbage Collection', 'Monday', '07:00:00', '10:00:00', 'Poblacion', 'Weekly garbage collection', TRUE),
('Garbage Collection', 'Tuesday', '07:00:00', '10:00:00', 'New Poblacion', 'Weekly garbage collection', TRUE),
('Garbage Collection', 'Wednesday', '07:00:00', '10:00:00', 'Liberty', 'Weekly garbage collection', TRUE),
('Medical Mission', 'Friday', '08:00:00', '16:00:00', 'Poblacion', 'Monthly medical checkups', TRUE),
('Vaccination Drive', 'Saturday', '08:00:00', '15:00:00', 'Poblacion', 'COVID-19 Vaccination', TRUE);

-- Insert common document types
INSERT INTO documents (title, category, file_url, description, is_public) VALUES
('Business Permit Application Form', 'form', '/docs/business_permit_form.pdf', 'Form for new business permit applications', TRUE),
('Birth Certificate Request Form', 'form', '/docs/birth_cert_request.pdf', 'Form for requesting birth certificates', TRUE),
('Building Permit Requirements', 'guide', '/docs/building_permit_guide.pdf', 'Guide on requirements for building permits', TRUE),
('Community Tax Certificate Guide', 'guide', '/docs/cedula_guide.pdf', 'Guide on getting your Community Tax Certificate', TRUE),
('COVID-19 Safety Guidelines', 'brochure', '/docs/covid_guidelines.pdf', 'Safety guidelines during the pandemic', TRUE);

-- Insert app settings
INSERT INTO app_settings (setting_key, setting_value, description) VALUES
('app_name', 'Bien Unido Citizen App', 'Name of the application'),
('municipality_name', 'Municipality of Bien Unido', 'Name of the municipality'),
('contact_email', 'info@bienunido.gov.ph', 'Contact email for the municipality'),
('contact_phone', '(038) 123-4567', 'Contact phone for the municipality'),
('map_center_lat', '10.1452', 'Default latitude for map center'),
('map_center_lng', '124.3433', 'Default longitude for map center'),
('map_default_zoom', '14', 'Default zoom level for maps');

-- Insert government officials
INSERT INTO officials (name, position, department, office_location, term_start, term_end, is_active, display_order) VALUES
('Juan Dela Cruz', 'Mayor', 'Office of the Mayor', 'Municipal Hall, 2nd Floor', '2022-07-01', '2025-06-30', TRUE, 1),
('Maria Santos', 'Vice Mayor', 'Office of the Vice Mayor', 'Municipal Hall, 2nd Floor', '2022-07-01', '2025-06-30', TRUE, 2),
('Pedro Reyes', 'Municipal Administrator', 'Administration', 'Municipal Hall, 1st Floor', '2022-07-01', '2025-06-30', TRUE, 3),
('Ana Gomez', 'Municipal Health Officer', 'Health Department', 'Municipal Health Office', '2022-07-01', '2025-06-30', TRUE, 4),
('Ramon Torres', 'Municipal Engineer', 'Engineering', 'Municipal Hall Annex', '2022-07-01', '2025-06-30', TRUE, 5);

-- Insert office hours
INSERT INTO office_hours (department, day_of_week, open_time, close_time, is_closed) VALUES
('Office of the Mayor', 'Monday', '08:00:00', '17:00:00', FALSE),
('Office of the Mayor', 'Tuesday', '08:00:00', '17:00:00', FALSE),
('Office of the Mayor', 'Wednesday', '08:00:00', '17:00:00', FALSE),
('Office of the Mayor', 'Thursday', '08:00:00', '17:00:00', FALSE),
('Office of the Mayor', 'Friday', '08:00:00', '17:00:00', FALSE),
('Office of the Mayor', 'Saturday', '08:00:00', '12:00:00', FALSE),
('Office of the Mayor', 'Sunday', '00:00:00', '00:00:00', TRUE),

('Civil Registry', 'Monday', '08:00:00', '17:00:00', FALSE),
('Civil Registry', 'Tuesday', '08:00:00', '17:00:00', FALSE),
('Civil Registry', 'Wednesday', '08:00:00', '17:00:00', FALSE),
('Civil Registry', 'Thursday', '08:00:00', '17:00:00', FALSE),
('Civil Registry', 'Friday', '08:00:00', '17:00:00', FALSE),
('Civil Registry', 'Saturday', '00:00:00', '00:00:00', TRUE),
('Civil Registry', 'Sunday', '00:00:00', '00:00:00', TRUE),

('Treasury', 'Monday', '08:00:00', '17:00:00', FALSE),
('Treasury', 'Tuesday', '08:00:00', '17:00:00', FALSE),
('Treasury', 'Wednesday', '08:00:00', '17:00:00', FALSE),
('Treasury', 'Thursday', '08:00:00', '17:00:00', FALSE),
('Treasury', 'Friday', '08:00:00', '17:00:00', FALSE),
('Treasury', 'Saturday', '00:00:00', '00:00:00', TRUE),
('Treasury', 'Sunday', '00:00:00', '00:00:00', TRUE);
