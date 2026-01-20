# SUVIDHA Kiosk API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## Auth Endpoints

### Login
**POST** `/auth/login`

Request:
```json
{
  "consumerId": "ELEC001234",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "consumerId": "ELEC001234",
    "name": "Rajesh Kumar",
    "mobile": "+91 9876543210"
  }
}
```

### Verify OTP
**POST** `/auth/verify-otp`

Request:
```json
{
  "mobile": "9876543210",
  "otp": "123456"
}
```

---

## Payment Endpoints

### Get Bills
**GET** `/payment/bills/:userId`

Response:
```json
{
  "success": true,
  "bills": [
    {
      "billId": "BILL001",
      "amount": 2450,
      "dueDate": "2026-01-25",
      "status": "pending",
      "consumption": "245 kWh"
    }
  ]
}
```

### Initiate Payment
**POST** `/payment/initiate`

Request:
```json
{
  "amount": 2450,
  "billId": "BILL001",
  "userId": 1
}
```

Response:
```json
{
  "success": true,
  "order": {
    "id": "order_...",
    "amount": 245000,
    "currency": "INR"
  }
}
```

### Verify Payment
**POST** `/payment/verify`

Request:
```json
{
  "razorpay_order_id": "order_...",
  "razorpay_payment_id": "pay_...",
  "razorpay_signature": "...",
  "billId": "BILL001"
}
```

---

## Complaint Endpoints

### Register Complaint
**POST** `/complaint/register`

Content-Type: `multipart/form-data`

Fields:
- `userId`: User ID
- `serviceType`: electricity | gas | water | waste
- `complaintType`: Type of complaint
- `description`: Detailed description
- `attachment`: (optional) Image/PDF file

Response:
```json
{
  "success": true,
  "trackingId": "CMP12345678"
}
```

### Get Complaint Status
**GET** `/complaint/status/:trackingId`

Response:
```json
{
  "success": true,
  "complaint": {
    "trackingId": "CMP12345678",
    "status": "in_progress",
    "updates": [...]
  }
}
```

---

## Service Endpoints

### Apply for New Connection
**POST** `/service/new-connection`

Content-Type: `multipart/form-data`

Fields:
- `applicantName`: Full name
- `mobile`: Mobile number
- `email`: Email address
- `address`: Complete address
- `serviceType`: electricity | gas | water
- `connectionType`: residential | commercial | industrial
- `idProof`: ID proof document
- `addressProof`: Address proof document

Response:
```json
{
  "success": true,
  "applicationNumber": "APP12345678"
}
```

### Submit Meter Reading
**POST** `/service/meter-reading`

Request:
```json
{
  "userId": 1,
  "consumerId": "ELEC001234",
  "reading": "12345",
  "readingDate": "2026-01-20"
}
```

---

## Error Responses

All error responses follow this format:
```json
{
  "success": false,
  "message": "Error description"
}
```

## Status Codes

- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Server Error
