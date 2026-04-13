# VeloCity - Fuel Access Ecosystem

A complete, multi-channel digital fuel access ecosystem with QR-code based authentication, anti-fraud mechanisms, and automated municipal revenue sharing.

## Project Structure

```
VeloCity/
├── backend/                 # FastAPI Backend
│   ├── main.py            # API server
│   ├── requirements.txt   # Python dependencies
│   └── database.json      # SQLite-like JSON database
│
├── src/                    # React Frontend (WebApp)
│   ├── components/
│   ├── pages/
│   ├── context/
│   ├── utils/
│   └── data/
│
├── telegram-bot/           # Telegram Bot (Python)
│   ├── bot.py             # Bot commands & handlers
│   └── requirements.txt
│
├── telegram-mini-app/      # Telegram Mini App (HTML/JS)
│   └── index.html
│
├── mobile-app/             # React Native Mobile App
│   ├── App.js
│   └── package.json
│
└── dist/                  # Built frontend files
```

## Quick Start

### 1. Start the Backend (requires Python)

```bash
cd VeloCity/backend
pip install fastapi uvicorn pydantic
python main.py
```

Backend runs at: `http://localhost:8000`

### 2. Start the Frontend

```bash
cd VeloCity
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

### 3. Test the API

```bash
# Seed sample data
curl -X POST http://localhost:8000/api/admin/seed

# Check health
curl http://localhost:8000/api/health
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API info |
| GET | `/api/health` | Health check |
| POST | `/api/vehicles/register` | Register vehicle |
| GET | `/api/vehicles` | List vehicles |
| GET | `/api/vehicles/{id}` | Get vehicle |
| GET | `/api/vehicles/qr/{code}` | Get by QR |
| POST | `/api/transactions/create` | Create transaction |
| GET | `/api/transactions` | List transactions |
| GET | `/api/stations` | List stations |
| POST | `/api/bookings/create` | Create booking |
| POST | `/api/wallet/topup` | Add funds |
| GET | `/api/wallet/{id}` | Get wallet |
| GET | `/api/stats` | System stats |
| GET | `/api/revenue/split` | Revenue 70/30 split |
| GET | `/api/audit/anomalies` | Flagged transactions |
| POST | `/api/admin/seed` | Seed sample data |

## Channels

### 1. WebApp (React)
- Landing page with features
- Driver portal for registration
- Station dashboard for QR scanning
- Fleet manager for bulk operations
- Admin dashboard for monitoring

### 2. Telegram Bot
```bash
cd VeloCity/telegram-bot
pip install -r requirements.txt
# Set BOT_TOKEN in bot.py
python bot.py
```

Commands: `/start`, `/book`, `/status`, `/wallet`, `/register`, `/history`

### 3. Telegram Mini App
- Host `telegram-mini-app/index.html` on a web server
- Configure in BotFather as Inline Web App

### 4. Mobile App (React Native)
```bash
cd VeloCity/mobile-app
npm install
npx expo start
```

Features: Vehicle registration, QR scanner, wallet, stations map, transaction history

## Features Implemented

- QR-code based vehicle authentication
- Color-coded vehicle types (Green/Blue/Black)
- Wallet management with top-up
- Transaction logging with anomaly detection
- Capacity exceeded detection
- GPS location verification
- Station inventory tracking
- 70/30 revenue split calculation
- Automated settlement system
- Anti-fraud mechanisms
- Real-time statistics

## Tech Stack

- **Backend:** FastAPI, Python
- **Frontend:** React, Vite, Framer Motion, Recharts
- **Telegram Bot:** python-telegram-bot
- **Mobile:** React Native, Expo
- **Database:** JSON file (easily replaceable with PostgreSQL)