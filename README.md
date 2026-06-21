# Hospital Ward Management System

A full-stack web application for managing hospital wards and beds, built with **FastAPI**, **PostgreSQL**, **React**, and **Vite**.

## Features

- **Authentication** — JWT-based signup/login with bcrypt password hashing
- **Ward Management** — Create, view, update, and delete hospital wards
- **Bed Management** — Create beds under wards, track status (Available / Occupied / Maintenance)
- **Dashboard** — Real-time aggregate statistics computed via a single optimized SQL query
- **Ownership Scoping** — Each user only sees and manages their own wards and beds
- **Responsive UI** — Dark-themed, glassmorphism design that works across devices

## Architecture

```
┌──────────────┐       ┌──────────────────┐       ┌────────────┐
│  React SPA   │──────▸│  FastAPI Server   │──────▸│ PostgreSQL │
│  (Vite)      │ Axios │  Router → Service │ ORM   │            │
│              │◂──────│  → Repository     │◂──────│            │
└──────────────┘ JSON  └──────────────────┘ SQL   └────────────┘
```

**Backend layers:** Router (thin) → Service (business logic + ownership) → Repository (queries) → Database

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, React Router, Axios |
| Backend | FastAPI, SQLAlchemy 2.0, Pydantic v2, Alembic |
| Database | PostgreSQL |
| Auth | JWT (python-jose), bcrypt (passlib) |
| Styling | Vanilla CSS (dark theme, glassmorphism) |

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── main.py                    # FastAPI app + middleware + routers
│   │   ├── core/                      # Config, security, exceptions
│   │   ├── api/v1/routers/            # Auth, wards, beds, dashboard
│   │   ├── models/                    # SQLAlchemy ORM models
│   │   ├── schemas/                   # Pydantic request/response schemas
│   │   ├── services/                  # Business logic layer
│   │   ├── repositories/             # Data access layer
│   │   └── db/                        # Engine + session setup
│   ├── alembic/                       # Database migrations
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/                       # Axios client + API modules
│   │   ├── context/                   # AuthContext (global state)
│   │   ├── routes/                    # App routes + protected route
│   │   ├── pages/                     # Page components
│   │   ├── components/                # Reusable UI components
│   │   └── hooks/                     # Custom hooks (useWards, useBeds)
│   ├── .env.example
│   └── package.json
└── README.md
```

## Prerequisites

- **Python 3.11+**
- **Node.js 18+** and npm
- **PostgreSQL 14+**

## Setup

### 1. Database

```bash
# Create the PostgreSQL database
createdb hospital_ward_mgmt

# Or via psql:
psql -U postgres -c "CREATE DATABASE hospital_ward_mgmt;"
```

### 2. Backend

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your database URL and a strong JWT secret

# Run database migrations
alembic upgrade head

# Start the server
uvicorn app.main:app --reload --port 8000
```

The API docs will be available at:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

### 3. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Ensure VITE_API_BASE_URL points to your backend

# Start dev server
npm run dev
```

The app will be available at http://localhost:5173

## Environment Variables

### Backend (`.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:password@localhost:5432/hospital_ward_mgmt` |
| `JWT_SECRET_KEY` | Secret key for signing JWTs | *(required, change in production)* |
| `JWT_ALGORITHM` | JWT signing algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiry in minutes | `60` |
| `CORS_ORIGINS` | Allowed frontend origins (JSON array) | `["http://localhost:5173"]` |

### Frontend (`.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8000/api/v1` |

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/auth/signup` | No | Register a new user |
| POST | `/api/v1/auth/login` | No | Login, returns JWT |
| GET | `/api/v1/auth/me` | Yes | Get current user profile |
| GET | `/api/v1/wards` | Yes | List user's wards (with bed counts) |
| POST | `/api/v1/wards` | Yes | Create a ward |
| GET | `/api/v1/wards/{id}` | Yes | Get ward details with beds |
| PUT | `/api/v1/wards/{id}` | Yes | Update a ward |
| DELETE | `/api/v1/wards/{id}` | Yes | Delete a ward (cascades to beds) |
| GET | `/api/v1/wards/{id}/beds` | Yes | List beds in a ward |
| POST | `/api/v1/wards/{id}/beds` | Yes | Create a bed |
| GET | `/api/v1/beds/{id}` | Yes | Get a bed |
| PUT | `/api/v1/beds/{id}` | Yes | Update a bed's number |
| PATCH | `/api/v1/beds/{id}/status` | Yes | Update a bed's status |
| DELETE | `/api/v1/beds/{id}` | Yes | Delete a bed |
| GET | `/api/v1/dashboard/stats` | Yes | Dashboard aggregate stats |

## Design Decisions

### Token Storage
JWT tokens are stored in `localStorage` for simplicity. In a production environment handling real patient data, an `httpOnly` cookie with CSRF protection would be the preferred approach. This is a deliberate, scope-appropriate trade-off documented here.

### Cascade Deletes
Deleting a ward cascades to all its beds via `ON DELETE CASCADE`. A bed cannot meaningfully exist without its ward, so this avoids orphaned rows. The frontend shows a confirmation warning with the affected bed count.

### Dashboard Query
Stats are computed in a single indexed SQL query using `LEFT JOIN` + conditional aggregation — not N+1 loops. This keeps dashboard load constant-time regardless of ward/bed count.

### Ward Capacity
The `capacity` field on wards is stored metadata, not an enforced constraint. Actual occupancy is always derived from `beds.status`, never stored redundantly.

## Known Limitations & Future Work

- **No pagination** — Ward and bed lists return all records. Fine for typical hospital scales (hundreds), but should be paginated for larger datasets.
- **Client-side logout only** — No server-side token blacklist. A stolen token remains valid until expiry (60 min).
- **No automated test suite** — `tests/` is scaffolded but needs actual pytest coverage.
- **Hard deletes** — No soft-delete or audit trail; appropriate for an internal tool but would need revision for compliance-heavy environments.

## License

MIT
