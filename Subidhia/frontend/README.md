# SUVIDHA Kiosk Frontend

A React-based frontend for the Smart Urban Virtual Interactive Digital Helpdesk Assistant (SUVIDHA) kiosk system.

## Features

- 🌐 Multilingual Support (English, Hindi, Tamil)
- ⚡ Electricity Bill Payment
- 🔥 Gas Bill Payment
- 💧 Water Bill Payment
- ♻️ Waste Management Services
- 📝 Complaint Registration
- 📊 Real-time Status Tracking
- 🔐 Secure Authentication

## Installation

```bash
npm install
```

## Development

```bash
npm start
```

## Build

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── HomeScreen.jsx     # Service selection landing page
│   ├── LoginScreen.jsx    # User authentication
│   ├── DashboardScreen.jsx # User dashboard
│   ├── PaymentScreen.jsx  # Bill payment flow
│   ├── ComplaintScreen.jsx # Complaint registration
│   └── AdminDashboard.jsx # Admin management panel
├── translations.js        # Multi-language support
├── App.jsx               # Main app component
└── index.js              # Entry point
```

## Environment Variables

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```
