-- SUVIDHA Kiosk Database Schema

CREATE DATABASE IF NOT EXISTS suvidha_kiosk;
USE suvidha_kiosk;

-- Users Table
CREATE TABLE users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  consumer_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  mobile VARCHAR(15) NOT NULL,
  email VARCHAR(100),
  address TEXT,
  service_type ENUM('electricity', 'gas', 'water', 'waste') NOT NULL,
  status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bills Table
CREATE TABLE bills (
  bill_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  bill_number VARCHAR(50) UNIQUE NOT NULL,
  service_type ENUM('electricity', 'gas', 'water', 'waste') NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  consumption VARCHAR(50),
  billing_period VARCHAR(50),
  due_date DATE NOT NULL,
  status ENUM('pending', 'paid', 'overdue') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Transactions Table
CREATE TABLE transactions (
  transaction_id INT PRIMARY KEY AUTO_INCREMENT,
  bill_id INT NOT NULL,
  user_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method ENUM('upi', 'card', 'netbanking', 'cash') NOT NULL,
  transaction_reference VARCHAR(100) UNIQUE,
  status ENUM('success', 'pending', 'failed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (bill_id) REFERENCES bills(bill_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Complaints Table
CREATE TABLE complaints (
  complaint_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  tracking_id VARCHAR(50) UNIQUE NOT NULL,
  service_type ENUM('electricity', 'gas', 'water', 'waste') NOT NULL,
  complaint_type VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  attachment_url VARCHAR(255),
  status ENUM('registered', 'in_progress', 'resolved', 'closed') DEFAULT 'registered',
  priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- New Connections Table
CREATE TABLE new_connections (
  connection_id INT PRIMARY KEY AUTO_INCREMENT,
  applicant_name VARCHAR(100) NOT NULL,
  mobile VARCHAR(15) NOT NULL,
  email VARCHAR(100),
  address TEXT NOT NULL,
  service_type ENUM('electricity', 'gas', 'water') NOT NULL,
  connection_type ENUM('residential', 'commercial', 'industrial') NOT NULL,
  id_proof_url VARCHAR(255),
  address_proof_url VARCHAR(255),
  application_number VARCHAR(50) UNIQUE NOT NULL,
  status ENUM('pending', 'approved', 'rejected', 'installed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMP NULL
);

-- Kiosk Activity Log
CREATE TABLE kiosk_logs (
  log_id INT PRIMARY KEY AUTO_INCREMENT,
  kiosk_id VARCHAR(50) NOT NULL,
  user_id INT,
  action_type VARCHAR(50) NOT NULL,
  service_type VARCHAR(50),
  details TEXT,
  ip_address VARCHAR(45),
  session_duration INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Create Indexes
CREATE INDEX idx_user_consumer ON users(consumer_id);
CREATE INDEX idx_bill_user ON bills(user_id);
CREATE INDEX idx_bill_status ON bills(status);
CREATE INDEX idx_complaint_tracking ON complaints(tracking_id);
CREATE INDEX idx_transaction_ref ON transactions(transaction_reference);
