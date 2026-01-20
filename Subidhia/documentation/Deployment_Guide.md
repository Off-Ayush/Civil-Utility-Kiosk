# SUVIDHA Kiosk Deployment Guide

## Prerequisites

- Node.js v16+
- MySQL 8.0+
- Docker & Docker Compose (optional)
- Razorpay Account (for payments)

---

## Local Development Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd SUVIDHA-Kiosk
```

### 2. Setup Database
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p suvidha_kiosk < database/seed.sql
```

### 3. Setup Backend
```bash
cd backend
npm install
cp ../.env.example .env
# Edit .env with your configurations
npm run dev
```

### 4. Setup Frontend
```bash
cd frontend
npm install
npm start
```

---

## Docker Deployment

### Quick Start
```bash
cd docker
docker-compose up -d
```

This will start:
- Frontend on port 3000
- Backend on port 5000
- MySQL on port 3306

### Building Images
```bash
docker-compose build
```

### Stopping Services
```bash
docker-compose down
```

---

## Production Deployment

### 1. Environment Setup

Create production `.env` file:
```bash
NODE_ENV=production
PORT=5000
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-secure-password
DB_NAME=suvidha_kiosk
JWT_SECRET=your-very-long-secret-key
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
```

### 2. Build Frontend
```bash
cd frontend
npm run build
```

### 3. Deploy with PM2
```bash
npm install -g pm2
cd backend
pm2 start server.js --name suvidha-api
```

### 4. Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        root /var/www/suvidha/frontend/build;
        try_files $uri /index.html;
    }

    # API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## SSL/HTTPS Setup

Using Certbot:
```bash
sudo certbot --nginx -d yourdomain.com
```

---

## Monitoring

### PM2 Logs
```bash
pm2 logs suvidha-api
```

### Health Check
```bash
curl http://localhost:5000/health
```

---

## Backup

### Database Backup
```bash
mysqldump -u root -p suvidha_kiosk > backup_$(date +%Y%m%d).sql
```

### Restore
```bash
mysql -u root -p suvidha_kiosk < backup_YYYYMMDD.sql
```
