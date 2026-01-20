# SUVIDHA Kiosk Technical Architecture

## System Overview

SUVIDHA is a full-stack web application designed for civic utility service management. The architecture follows a client-server model with a React frontend, Node.js backend, and MySQL database.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    React Frontend                         │  │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────────┐ │  │
│  │  │   Home  │ │  Login  │ │Dashboard│ │ Payment/Complaint││  │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ REST API (HTTPS)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API LAYER                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  Express.js Backend                       │  │
│  │  ┌──────────┐ ┌───────────┐ ┌──────────┐ ┌─────────────┐ │  │
│  │  │   Auth   │ │  Payment  │ │Complaint │ │   Service   │ │  │
│  │  │ Routes   │ │  Routes   │ │  Routes  │ │   Routes    │ │  │
│  │  └──────────┘ └───────────┘ └──────────┘ └─────────────┘ │  │
│  │              ┌──────────────────────────┐                 │  │
│  │              │  Middleware (Auth/Valid) │                 │  │
│  │              └──────────────────────────┘                 │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ MySQL Protocol
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATA LAYER                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                     MySQL Database                        │  │
│  │  ┌───────┐ ┌───────┐ ┌───────────┐ ┌──────────────────┐  │  │
│  │  │ Users │ │ Bills │ │Complaints │ │   Transactions   │  │  │
│  │  └───────┘ └───────┘ └───────────┘ └──────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| Tailwind CSS | Styling |
| Lucide React | Icons |
| Axios | HTTP Client |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js | Web Framework |
| JWT | Authentication |
| Razorpay | Payment Gateway |
| Multer | File Uploads |

### Database
| Technology | Purpose |
|------------|---------|
| MySQL 8.0 | Primary Database |
| mysql2 | Node.js Driver |

### Infrastructure
| Technology | Purpose |
|------------|---------|
| Docker | Containerization |
| Nginx | Reverse Proxy |
| PM2 | Process Manager |

---

## Data Flow

### Authentication Flow
```
User → Login Request → Auth Controller → JWT Token → Secure Endpoints
```

### Payment Flow
```
Select Bill → Initiate Payment → Razorpay Order → 
Complete Payment → Verify Signature → Update Database → Generate Receipt
```

### Complaint Flow
```
Submit Form → Upload Attachment → Generate Tracking ID → 
Store in Database → Return Confirmation
```

---

## Database Schema

### Core Tables
- **users** - Consumer accounts
- **bills** - Utility bills
- **transactions** - Payment records
- **complaints** - Complaint tickets
- **new_connections** - Connection applications
- **kiosk_logs** - Activity tracking

### Relationships
```
users (1) ─────── (N) bills
users (1) ─────── (N) transactions
users (1) ─────── (N) complaints
bills (1) ─────── (N) transactions
```

---

## Security Measures

1. **Authentication** - JWT tokens with 24h expiry
2. **Password Hashing** - bcrypt with salt rounds
3. **Input Validation** - express-validator
4. **CORS** - Configured origins
5. **Rate Limiting** - API throttling
6. **SSL/TLS** - HTTPS encryption
7. **SQL Injection** - Parameterized queries

---

## Scalability Considerations

- **Horizontal Scaling** - Load balancer with multiple app instances
- **Database Replication** - Read replicas for improved performance
- **Caching** - Redis for session and data caching
- **CDN** - Static asset delivery
- **Microservices** - Can be split into service-specific APIs

---

## Monitoring & Logging

- **Application Logs** - Winston/Morgan
- **Error Tracking** - Sentry integration
- **Performance** - APM tools
- **Database** - Query optimization monitoring
