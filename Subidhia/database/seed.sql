-- SUVIDHA Kiosk Seed Data

USE suvidha_kiosk;

-- Insert Sample Users
INSERT INTO users (consumer_id, name, mobile, email, address, service_type) VALUES
('ELEC001234', 'Rajesh Kumar', '9876543210', 'rajesh@email.com', '123, Main Street, Sector 15, City', 'electricity'),
('GAS0005678', 'Priya Sharma', '9876543211', 'priya@email.com', '456, Park Avenue, Block A, City', 'gas'),
('WATR009012', 'Amit Singh', '9876543212', 'amit@email.com', '789, Garden Road, Phase 2, City', 'water'),
('ELEC003456', 'Sunita Devi', '9876543213', 'sunita@email.com', '321, Hill View, Sector 22, City', 'electricity'),
('ADMIN', 'Admin User', '9999999999', 'admin@suvidha.gov.in', 'SUVIDHA Head Office', 'electricity');

-- Insert Sample Bills
INSERT INTO bills (user_id, bill_number, service_type, amount, consumption, billing_period, due_date, status) VALUES
(1, 'BILL2025120001', 'electricity', 2450.00, '245 kWh', 'December 2025', '2026-01-25', 'pending'),
(1, 'BILL2025110001', 'electricity', 2180.00, '218 kWh', 'November 2025', '2025-12-25', 'paid'),
(2, 'BILL2025120002', 'gas', 1890.00, '18 SCM', 'December 2025', '2026-01-20', 'pending'),
(3, 'BILL2025120003', 'water', 850.00, '12 KL', 'December 2025', '2026-01-28', 'pending'),
(4, 'BILL2025120004', 'electricity', 3200.00, '320 kWh', 'December 2025', '2026-01-15', 'overdue');

-- Insert Sample Transactions
INSERT INTO transactions (bill_id, user_id, amount, payment_method, transaction_reference, status) VALUES
(2, 1, 2180.00, 'upi', 'TXN2025121501234', 'success'),
(2, 1, 2050.00, 'card', 'TXN2025111401234', 'success');

-- Insert Sample Complaints
INSERT INTO complaints (user_id, tracking_id, service_type, complaint_type, description, status, priority) VALUES
(1, 'CMP12345678', 'electricity', 'Power Outage', 'Frequent power outages in the area during evening hours', 'in_progress', 'high'),
(3, 'CMP23456789', 'water', 'Low Pressure', 'Very low water pressure on upper floors', 'registered', 'medium'),
(2, 'CMP34567890', 'gas', 'Billing Issue', 'Incorrect meter reading in the last bill', 'resolved', 'low');

-- Insert Sample New Connection Applications
INSERT INTO new_connections (applicant_name, mobile, email, address, service_type, connection_type, application_number, status) VALUES
('Rahul Verma', '9876543220', 'rahul@email.com', '555, New Colony, Sector 30, City', 'electricity', 'residential', 'APP12345678', 'pending'),
('ABC Industries', '9876543221', 'contact@abc.com', 'Industrial Area, Plot 45, City', 'electricity', 'industrial', 'APP23456789', 'approved'),
('Green Mart', '9876543222', 'info@greenmart.com', 'Market Complex, Shop 12, City', 'gas', 'commercial', 'APP34567890', 'installed');
