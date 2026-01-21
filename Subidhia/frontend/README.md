# SUVIDHA - Smart Civic Services Kiosk

![SUVIDHA Logo](public/logo.svg)

**Smart Urban Virtual Interactive Digital Helpdesk Assistant**

A modern, multilingual civic services kiosk application for utility bill payments, service requests, and complaint management.

## 🌐 Languages Supported

| Language | Script | Region |
|----------|--------|--------|
| English | Latin | General |
| हिंदी (Hindi) | Devanagari | General |
| தமிழ் (Tamil) | Tamil | General |
| অসমীয়া (Assamese) | Assamese | Assam |
| বাংলা (Bengali) | Bengali | Barak Valley |
| बड़ो (Bodo) | Devanagari | Bodoland |
| কাৰ্বি (Karbi) | Assamese | Karbi Anglong |

## 🚀 Quick Start

### Development
```bash
npm install
npm start
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm run serve
```

## 📦 Deployment

### Deploy to Vercel (Recommended)
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Sign in with GitHub
4. Click "New Project" → Import this repository
5. Vercel will auto-detect React and deploy!

**Or use CLI:**
```bash
npm i -g vercel
vercel --prod
```

### Deploy to Netlify
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the `build/` folder
3. Your site is live!

**Or use CLI:**
```bash
npm i -g netlify-cli
npm run build
netlify deploy --prod --dir=build
```

## 🏗️ Project Structure

```
frontend/
├── public/
│   ├── index.html      # Main HTML with SEO & PWA
│   ├── manifest.json   # PWA manifest
│   └── logo.svg        # App logo
├── src/
│   ├── App.jsx         # Main app component
│   ├── translations.js # i18n translations
│   └── components/     # React components
├── vercel.json         # Vercel config
└── package.json        # Dependencies & scripts
```

## ⚡ Features

- **Utility Services**: Electricity, Gas, Water, Waste Management
- **Bill Payments**: Secure payment processing
- **Complaint System**: Register and track complaints
- **Multi-language**: 7 languages including Assam regional languages
- **PWA Ready**: Installable as a mobile app
- **Responsive**: Works on all devices

## 📄 License

© 2026 SUVIDHA Kiosk. All rights reserved.
