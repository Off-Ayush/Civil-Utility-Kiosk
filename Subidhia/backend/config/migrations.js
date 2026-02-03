/**
 * Auto-migration script - creates tables if they don't exist
 * Runs automatically on server startup in production
 */

const runMigrations = async (pool) => {
    console.log('Running database migrations...');

    const tables = [
        // Users table
        `CREATE TABLE IF NOT EXISTS users (
            user_id INT PRIMARY KEY AUTO_INCREMENT,
            consumer_id VARCHAR(50) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            aadhaar_number VARCHAR(12) UNIQUE NOT NULL,
            aadhaar_verified BOOLEAN DEFAULT FALSE,
            aadhaar_verification_date TIMESTAMP NULL,
            name VARCHAR(100) NOT NULL,
            date_of_birth DATE,
            gender ENUM('male', 'female', 'other'),
            profile_photo_url VARCHAR(255),
            email VARCHAR(100) NOT NULL,
            mobile VARCHAR(15) NOT NULL,
            alternate_mobile VARCHAR(15),
            address_line1 VARCHAR(255) NOT NULL,
            address_line2 VARCHAR(255),
            landmark VARCHAR(100),
            city VARCHAR(100) NOT NULL,
            district VARCHAR(100) NOT NULL,
            state VARCHAR(100) NOT NULL,
            pincode VARCHAR(6) NOT NULL,
            preferred_services JSON,
            status ENUM('active', 'inactive', 'suspended', 'pending_verification') DEFAULT 'pending_verification',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            last_login TIMESTAMP NULL,
            INDEX idx_aadhaar (aadhaar_number),
            INDEX idx_email (email),
            INDEX idx_mobile (mobile)
        )`,

        // User documents table
        `CREATE TABLE IF NOT EXISTS user_documents (
            doc_id INT PRIMARY KEY AUTO_INCREMENT,
            user_id INT NOT NULL,
            document_type ENUM('profile_photo', 'aadhaar_front', 'aadhaar_back', 'address_proof') NOT NULL,
            file_name VARCHAR(255) NOT NULL,
            file_path VARCHAR(255) NOT NULL,
            file_size INT,
            mime_type VARCHAR(50),
            uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            verified BOOLEAN DEFAULT FALSE,
            verified_at TIMESTAMP NULL,
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
        )`,

        // Bills table
        `CREATE TABLE IF NOT EXISTS bills (
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
        )`,

        // Transactions table
        `CREATE TABLE IF NOT EXISTS transactions (
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
        )`,

        // Complaints table
        `CREATE TABLE IF NOT EXISTS complaints (
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
        )`,

        // New connections table
        `CREATE TABLE IF NOT EXISTS new_connections (
            connection_id INT PRIMARY KEY AUTO_INCREMENT,
            user_id INT,
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
            processed_at TIMESTAMP NULL,
            FOREIGN KEY (user_id) REFERENCES users(user_id)
        )`,

        // Kiosk logs table
        `CREATE TABLE IF NOT EXISTS kiosk_logs (
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
        )`,

        // OTP records table
        `CREATE TABLE IF NOT EXISTS otp_records (
            otp_id INT PRIMARY KEY AUTO_INCREMENT,
            mobile VARCHAR(15) NOT NULL,
            otp_code VARCHAR(6) NOT NULL,
            purpose ENUM('registration', 'login', 'password_reset', 'aadhaar_verify') NOT NULL,
            expires_at TIMESTAMP NOT NULL,
            verified BOOLEAN DEFAULT FALSE,
            attempts INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_mobile_otp (mobile, otp_code)
        )`
    ];

    let successCount = 0;
    let errorCount = 0;

    for (const tableSQL of tables) {
        try {
            await pool.query(tableSQL);
            successCount++;
        } catch (error) {
            // Ignore duplicate key errors for indexes, they're expected
            if (!error.message.includes('Duplicate key name')) {
                console.error('Migration error:', error.message);
                errorCount++;
            } else {
                successCount++;
            }
        }
    }

    console.log(`Migrations complete: ${successCount} tables ready, ${errorCount} errors`);
    return errorCount === 0;
};

module.exports = { runMigrations };
