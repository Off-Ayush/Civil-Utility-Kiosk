const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// In-memory store for demo mode (when database is not available)
let demoUsers = [];
const DEMO_USERS_FILE = path.join(__dirname, '../data/demo_users.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Load demo users from file if exists
const loadDemoUsers = () => {
    try {
        if (fs.existsSync(DEMO_USERS_FILE)) {
            demoUsers = JSON.parse(fs.readFileSync(DEMO_USERS_FILE, 'utf8'));
        }
    } catch (error) {
        console.log('No existing demo users found, starting fresh');
        demoUsers = [];
    }
};

// Save demo users to file
const saveDemoUsers = () => {
    try {
        fs.writeFileSync(DEMO_USERS_FILE, JSON.stringify(demoUsers, null, 2));
    } catch (error) {
        console.error('Failed to save demo users:', error);
    }
};

// Initialize demo users
loadDemoUsers();

// Try to get database pool, but don't fail if unavailable
let pool = null;
let dbAvailable = false;

const initDatabase = async () => {
    try {
        const { pool: dbPool, testConnection } = require('../config/database');
        pool = dbPool;
        await testConnection();
        dbAvailable = true;
        console.log('Database connected - using MySQL');
    } catch (error) {
        console.log('Database not available - using demo mode with file storage');
        dbAvailable = false;
    }
};

initDatabase();

// Import Aadhaar service
let aadhaarService;
try {
    aadhaarService = require('../services/aadhaarService');
} catch (error) {
    // Fallback Aadhaar validation
    aadhaarService = {
        validateFormat: (aadhaar) => {
            const cleaned = aadhaar.replace(/[\s-]/g, '');
            if (!/^\d{12}$/.test(cleaned)) {
                return { isValid: false, message: 'Aadhaar must be 12 digits' };
            }
            if (['0', '1'].includes(cleaned[0])) {
                return { isValid: false, message: 'Aadhaar cannot start with 0 or 1' };
            }
            return { isValid: true, cleanedAadhaar: cleaned, message: 'Valid' };
        },
        verifyAadhaar: async (aadhaar) => ({
            success: true,
            verified: true,
            message: 'Verified (demo mode)'
        }),
        isAadhaarRegistered: async (pool, aadhaar) => {
            const cleaned = aadhaar.replace(/[\s-]/g, '');
            return demoUsers.some(u => u.aadhaarNumber === cleaned);
        }
    };
}

/**
 * Generate Consumer ID from Aadhaar
 */
const generateConsumerId = (aadhaar) => {
    const year = new Date().getFullYear();
    const suffix = aadhaar.slice(-6);
    return `SUV-${year}-${suffix}`;
};

/**
 * Register a new user
 * POST /api/auth/register
 */
exports.register = async (req, res) => {
    try {
        const {
            aadhaarNumber,
            password,
            name,
            email,
            mobile,
            alternateMobile,
            dateOfBirth,
            gender,
            addressLine1,
            addressLine2,
            landmark,
            city,
            district,
            state,
            pincode
        } = req.body;

        // Clean Aadhaar number
        const cleanedAadhaar = aadhaarNumber.replace(/[\s-]/g, '');

        // Validate Aadhaar format
        const aadhaarValidation = aadhaarService.validateFormat(cleanedAadhaar);
        if (!aadhaarValidation.isValid) {
            return res.status(400).json({
                success: false,
                message: aadhaarValidation.message
            });
        }

        // Hash password
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Generate consumer ID
        const consumerId = generateConsumerId(cleanedAadhaar);

        // Handle profile photo if uploaded
        let profilePhotoUrl = null;
        if (req.file) {
            profilePhotoUrl = `/uploads/profiles/${req.file.filename}`;
        }

        if (dbAvailable) {
            // Database mode
            try {
                // Check if Aadhaar is already registered
                const isRegistered = await aadhaarService.isAadhaarRegistered(pool, cleanedAadhaar);
                if (isRegistered) {
                    return res.status(409).json({
                        success: false,
                        message: 'This Aadhaar number is already registered. Please login instead.'
                    });
                }

                // Check if email already exists
                const [existingEmail] = await pool.execute(
                    'SELECT user_id FROM users WHERE email = ?',
                    [email]
                );
                if (existingEmail.length > 0) {
                    return res.status(409).json({
                        success: false,
                        message: 'This email is already registered.'
                    });
                }

                // Check if mobile already exists
                const [existingMobile] = await pool.execute(
                    'SELECT user_id FROM users WHERE mobile = ?',
                    [mobile]
                );
                if (existingMobile.length > 0) {
                    return res.status(409).json({
                        success: false,
                        message: 'This mobile number is already registered.'
                    });
                }

                // Insert user into database
                const [result] = await pool.execute(
                    `INSERT INTO users (
                        consumer_id, password_hash, aadhaar_number, name, email, mobile,
                        alternate_mobile, date_of_birth, gender, profile_photo_url,
                        address_line1, address_line2, landmark, city, district, state, pincode,
                        status
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
                    [
                        consumerId, passwordHash, cleanedAadhaar, name, email, mobile,
                        alternateMobile || null, dateOfBirth || null, gender || null, profilePhotoUrl,
                        addressLine1, addressLine2 || null, landmark || null, city, district, state, pincode
                    ]
                );

                const userId = result.insertId;

                // Generate JWT token
                const token = jwt.sign(
                    { userId, consumerId, aadhaarNumber: cleanedAadhaar.replace(/(\d{4})(\d{4})(\d{4})/, 'XXXX-XXXX-$3') },
                    process.env.JWT_SECRET || 'suvidha-demo-secret-2024',
                    { expiresIn: process.env.JWT_EXPIRE || '24h' }
                );

                res.status(201).json({
                    success: true,
                    message: 'Registration successful',
                    token,
                    user: { consumerId, name, email, mobile, aadhaarVerified: true, profilePhotoUrl }
                });
            } catch (dbError) {
                console.error('Database error during registration:', dbError);
                throw dbError;
            }
        } else {
            // Demo mode - store in memory/file
            // Check for duplicates
            if (demoUsers.some(u => u.aadhaarNumber === cleanedAadhaar)) {
                return res.status(409).json({
                    success: false,
                    message: 'This Aadhaar number is already registered. Please login instead.'
                });
            }
            if (demoUsers.some(u => u.email === email)) {
                return res.status(409).json({
                    success: false,
                    message: 'This email is already registered.'
                });
            }
            if (demoUsers.some(u => u.mobile === mobile)) {
                return res.status(409).json({
                    success: false,
                    message: 'This mobile number is already registered.'
                });
            }

            const userId = Date.now();
            const newUser = {
                userId,
                consumerId,
                passwordHash,
                aadhaarNumber: cleanedAadhaar,
                name,
                email,
                mobile,
                alternateMobile: alternateMobile || null,
                dateOfBirth: dateOfBirth || null,
                gender: gender || null,
                profilePhotoUrl,
                addressLine1,
                addressLine2: addressLine2 || null,
                landmark: landmark || null,
                city,
                district,
                state,
                pincode,
                status: 'active',
                aadhaarVerified: true,
                createdAt: new Date().toISOString()
            };

            demoUsers.push(newUser);
            saveDemoUsers();

            // Generate JWT token
            const token = jwt.sign(
                { userId, consumerId, aadhaarNumber: cleanedAadhaar.replace(/(\d{4})(\d{4})(\d{4})/, 'XXXX-XXXX-$3') },
                process.env.JWT_SECRET || 'suvidha-demo-secret-2024',
                { expiresIn: process.env.JWT_EXPIRE || '24h' }
            );

            res.status(201).json({
                success: true,
                message: 'Registration successful (Demo Mode)',
                token,
                user: { consumerId, name, email, mobile, aadhaarVerified: true, profilePhotoUrl }
            });
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed. Please try again.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Login user
 * POST /api/auth/login
 */
exports.login = async (req, res) => {
    try {
        const { consumerId, password } = req.body;
        const cleanedInput = consumerId.replace(/[\s-]/g, '');

        let user = null;

        if (dbAvailable) {
            // Database mode
            const [users] = await pool.execute(
                `SELECT * FROM users 
                 WHERE consumer_id = ? OR aadhaar_number = ? OR email = ? OR mobile = ?`,
                [consumerId, cleanedInput, consumerId, consumerId]
            );

            if (users.length > 0) {
                user = users[0];
            }
        } else {
            // Demo mode
            user = demoUsers.find(u =>
                u.consumerId === consumerId ||
                u.aadhaarNumber === cleanedInput ||
                u.email === consumerId ||
                u.mobile === consumerId
            );
        }

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials. User not found.'
            });
        }

        // Check if account is active
        if (user.status !== 'active') {
            return res.status(403).json({
                success: false,
                message: `Your account is ${user.status}. Please contact support.`
            });
        }

        // Verify password
        const passwordHash = user.password_hash || user.passwordHash;
        const isPasswordValid = await bcrypt.compare(password, passwordHash);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials. Incorrect password.'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user.user_id || user.userId,
                consumerId: user.consumer_id || user.consumerId,
                aadhaarNumber: (user.aadhaar_number || user.aadhaarNumber).replace(/(\d{4})(\d{4})(\d{4})/, 'XXXX-XXXX-$3')
            },
            process.env.JWT_SECRET || 'suvidha-demo-secret-2024',
            { expiresIn: process.env.JWT_EXPIRE || '24h' }
        );

        res.json({
            success: true,
            token,
            user: {
                consumerId: user.consumer_id || user.consumerId,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                aadhaarVerified: user.aadhaar_verified || user.aadhaarVerified,
                profilePhotoUrl: user.profile_photo_url || user.profilePhotoUrl,
                address: {
                    line1: user.address_line1 || user.addressLine1,
                    line2: user.address_line2 || user.addressLine2,
                    city: user.city,
                    district: user.district,
                    state: user.state,
                    pincode: user.pincode
                }
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed. Please try again.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Verify Aadhaar number
 * POST /api/auth/verify-aadhaar
 */
exports.verifyAadhaar = async (req, res) => {
    try {
        const { aadhaarNumber } = req.body;
        const cleanedAadhaar = aadhaarNumber.replace(/[\s-]/g, '');

        const result = aadhaarService.validateFormat(cleanedAadhaar);

        // Check if already registered
        let isRegistered = false;
        if (dbAvailable) {
            isRegistered = await aadhaarService.isAadhaarRegistered(pool, cleanedAadhaar);
        } else {
            isRegistered = demoUsers.some(u => u.aadhaarNumber === cleanedAadhaar);
        }

        res.json({
            success: result.isValid,
            verified: result.isValid,
            message: result.message,
            isAlreadyRegistered: isRegistered
        });
    } catch (error) {
        console.error('Aadhaar verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Verification failed. Please try again.'
        });
    }
};

/**
 * Verify OTP
 * POST /api/auth/verify-otp
 */
exports.verifyOTP = async (req, res) => {
    try {
        const { mobile, otp } = req.body;

        // In demo mode, accept any 6-digit OTP
        if (otp && otp.length === 6 && /^\d{6}$/.test(otp)) {
            return res.json({
                success: true,
                message: 'OTP verified successfully'
            });
        }

        res.status(400).json({
            success: false,
            message: 'Invalid OTP format'
        });
    } catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json({
            success: false,
            message: 'OTP verification failed.'
        });
    }
};

/**
 * Logout user
 * POST /api/auth/logout
 */
exports.logout = async (req, res) => {
    res.json({ success: true, message: 'Logged out successfully' });
};

/**
 * Get current user profile
 * GET /api/auth/profile
 */
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        let user = null;

        if (dbAvailable) {
            const [users] = await pool.execute(
                `SELECT * FROM users WHERE user_id = ?`,
                [userId]
            );
            if (users.length > 0) user = users[0];
        } else {
            user = demoUsers.find(u => u.userId === userId);
        }

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({
            success: true,
            user: {
                consumerId: user.consumer_id || user.consumerId,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                aadhaarVerified: user.aadhaar_verified || user.aadhaarVerified,
                profilePhotoUrl: user.profile_photo_url || user.profilePhotoUrl,
                address: {
                    line1: user.address_line1 || user.addressLine1,
                    line2: user.address_line2 || user.addressLine2,
                    city: user.city,
                    district: user.district,
                    state: user.state,
                    pincode: user.pincode
                }
            }
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch profile' });
    }
};

/**
 * Upload document
 * POST /api/auth/upload-document
 */
exports.uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const filePath = `/uploads/documents/${req.file.filename}`;

        res.json({
            success: true,
            message: 'Document uploaded successfully',
            filePath,
            fileName: req.file.filename
        });
    } catch (error) {
        console.error('Document upload error:', error);
        res.status(500).json({ success: false, message: 'Failed to upload document' });
    }
};
