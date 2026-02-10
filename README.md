# SUVIDHA - Smart Urban Virtual Interactive Digital Helpdesk Assistant

<div align="center">

![SUVIDHA Logo](https://via.placeholder.com/150x150?text=SUVIDHA)

**A comprehensive kiosk-based solution for civic service delivery**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-18.2.0-blue.svg)](https://reactjs.org/)

</div>

---

## 🌟 Overview

SUVIDHA is a unified kiosk system that provides seamless access to multiple civic utility services:

-  **Electricity** - Bill payments, new connections, complaints
-  **Gas** - Bill payments, safety checks, leak reports
-  **Water** - Bill payments, quality issues, supply problems
-  **Waste Management** - Pickup scheduling, disposal requests

##  Features

- **Multilingual Support** - English, Hindi, Tamil
-  **Secure Authentication** - JWT-based with OTP support
-  **Integrated Payments** - Razorpay with UPI, Card, Net Banking
-  **Responsive Design** - Works on all screen sizes
-  **Admin Dashboard** - Real-time analytics and management
-  **Complaint Tracking** - Full lifecycle management
-  **Document Upload** - Support for ID and address proofs

##  Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React, Tailwind CSS, Lucide Icons |
| Backend | Node.js, Express.js |
| Database | MySQL 8.0 |
| Auth | JWT, bcryptjs |
| Payments | Razorpay |
| Deployment | Docker, Nginx |

##  Project Structure

```
SUVIDHA-Kiosk/
├── frontend/           # React frontend application
├── backend/            # Node.js/Express API server
├── database/           # SQL schema and seed data
├── docker/             # Docker configuration
└── documentation/      # Project documentation
```

##  Quick Start

### Prerequisites
- Node.js v16+
- MySQL 8.0+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd SUVIDHA-Kiosk
```

2. **Setup Database**
```bash
mysql -u root -p < database/schema.sql
```

3. **Setup Backend**
```bash
cd backend
npm install
cp ../.env.example .env
npm run dev
```

4. **Setup Frontend**
```bash
cd frontend
npm install
npm start
```

### Using Docker

```bash
cd docker
docker-compose up -d
```

##  Documentation

- [API Documentation](documentation/API_Documentation.md)
- [Deployment Guide](documentation/Deployment_Guide.md)
- [User Manual](documentation/User_Manual.md)
- [Technical Architecture](documentation/Technical_Architecture.md)

##  Configuration

Copy `.env.example` to `.env` and configure:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=suvidha_kiosk
JWT_SECRET=your_secret
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
```

##  Screenshots

| Home Screen | Dashboard | Payment |
|-------------|-----------|---------|
| Service Selection | User Dashboard | Bill Payment |

##  Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

##  Support

- **Helpline**: 1800-XXX-XXXX
- **Email**: support@suvidha.gov.in

---

<div align="center">
Made with for Digital India
</div>
