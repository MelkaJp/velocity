# VeloCity - Agent Instructions

## Dev Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Frontend only (Vite, port **8080**) |
| `npm run build` | Build frontend to `dist/` |
| `npm run lint` | ESLint check |
| `python -m uvicorn main:app --reload` | Backend only (port 8000, run from `backend/`) |
| `npm run start` | Runs backend then frontend **sequentially** (not concurrently) |

## Demo Mode (Frontend Standalone)

Frontend works without backend. Uses in-memory demo data. API calls fail gracefully when backend is offline.

**Demo accounts** (from `src/data/demoUsers.js`):
- `developer/dev123` — developer_admin
- `municipality/muni123` — municipality_admin
- `stationmgr/station123` — station_manager
- `stationworker/worker123` — station_worker
- `fleet1/fleet123` — fleet_owner
- `driver1/driver123` — driver

## Backend

- Run from `backend/`: `python -m uvicorn main:app --reload`
- Database: JSON file (`backend/database_v3.json`), auto-initializes on first run
- Default users: `developer/dev123`, `municipality/muni123`
- Seed more data: `curl -X POST http://localhost:8000/api/admin/seed`

## Architecture Notes

- **Auth layer**: Supabase (`src/utils/supabase.js`) with hardcoded credentials + `AuthContext`. Backend has its own token-based auth (parallel auth system).
- **State**: `VeloCityContext` uses `useReducer` with 6 access levels (SUPER_ADMIN=100 down to DRIVER=10).
- **Translations**: 3 languages — English, Amharic, Afaan Oromo (`src/data/dictionary.js`).
- **ESLint**: `no-unused-vars` and `react-refresh/only-export-components` are **disabled**. Don't add unused-vars fixes.
- **Vite config**: Port 8080, not the default 5173. Host 127.0.0.1.
- **Supabase schema** for PostgreSQL lives in `supabase/schema.sql` (not currently in use).
- **`npm run start`** starts backend first (blocks), then frontend. Does **not** use the installed `concurrently` package.

## Channels

| Directory | Purpose | Tech |
|-----------|---------|------|
| `src/` | Frontend web app | React + Vite |
| `backend/` | REST API | FastAPI |
| `telegram-bot/` | Telegram bot | python-telegram-bot |
| `telegram-mini-app/` | Telegram Mini App | Vanilla HTML/JS |
| `mobile-app/` | Mobile app | React Native + Expo |

## Testing

No test framework configured. Verify with `npm run build` and manual browser check.
