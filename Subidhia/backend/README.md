# SUVIDHA Kiosk Backend API

A Node.js/Express backend for the Smart Urban Virtual Interactive Digital Helpdesk Assistant (SUVIDHA) kiosk system.

## Features

- 🔐 JWT Authentication
- 💳 Razorpay Payment Integration
- 📝 Complaint Management
- 📊 Service Management
- 🗄️ MySQL Database

## Installation

```bash
npm install
```

## Configuration

1. Copy the environment file:
```bash
cp ../.env.example .env
```

2. Update the `.env` file with your configurations

## Development

```bash
npm run dev
```

## Production

```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/auth/logout` - User logout

### Payment
- `GET /api/payment/bills/:userId` - Get user bills
- `POST /api/payment/initiate` - Initiate payment
- `POST /api/payment/verify` - Verify payment
- `GET /api/payment/history/:userId` - Payment history

### Complaints
- `POST /api/complaint/register` - Register complaint
- `GET /api/complaint/status/:trackingId` - Check status
- `GET /api/complaint/user/:userId` - User complaints
- `PUT /api/complaint/update/:complaintId` - Update complaint

### Services
- `POST /api/service/new-connection` - Apply for new connection
- `GET /api/service/connection-status/:applicationNumber` - Check status
- `POST /api/service/meter-reading` - Submit meter reading
- `GET /api/service/service-info/:serviceType` - Service information

## Health Check

```bash
curl http://localhost:5000/health
```
