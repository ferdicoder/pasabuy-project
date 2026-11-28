# Pasabuy

<p align="center">
  <img src="./frontend/src/assets/pasabuy-logo.svg" alt="Pasabuy logo" width="260" />
</p>

<p align="center">
  A route-based pasabu<i>y</i> marketplace that connects travelers with buyers across the Philippines.
</p>

## Introduction

Pasabuy is a full-stack matching marketplace for people who need an item delivered along an existing trip. Buyers can post requests with an estimated price, origin, delivery location, details, and a reference image. Travelers can publish their route, departure and arrival dates, available capacity, and destination image.

The system brings both sides together by route and trip data. Matching logic is powered by PostgreSQL functions and an outbox worker: requests and trips enqueue match work, the worker refreshes scored candidates, and the frontend presents the available requests and trips through one marketplace feed.

### Tech Stack

| Area | Technologies |
|---|---|
| Frontend | React 19, Vite, TypeScript, Tailwind CSS v4, React Router, TanStack Query, Axios, Lucide React |
| Backend | Node.js, Express 5, TypeScript, Better Auth, Zod, pg |
| Database | PostgreSQL on Neon, PostgreSQL functions/triggers, `pg_trgm`, PSGC place data |
| Media | Cloudinary unsigned client uploads |
| Development and deployment | npm, Docker, Docker Compose, Nginx |

## Features

- Email-and-password registration and login with cookie-based Better Auth sessions
- Protected account areas and current-user profile updates
- Buyer request creation, editing, deletion, and personal activity management
- Traveler trip creation, editing, deletion, and personal activity management
- Request details including item, estimated price, origin, delivery location, description, and reference image
- Trip details including origin, destination, departure and arrival dates, capacity in kilograms, and destination image
- Public request and trip feeds with separate authenticated views for user activity
- Route, date, capacity, and locality-aware matching data stored in PostgreSQL candidate tables
- Database-driven match outbox with a dedicated worker and dead-letter queue
- Philippines geography support through regions, provinces, places, aliases, and place proximity tables
- Responsive landing, authentication, marketplace, activity, and profile interfaces

## How It Works

1. A buyer creates a request with the item, expected price, and delivery location.
2. A traveler creates a trip with the route, travel dates, and available kilogram capacity.
3. PostgreSQL triggers add rematching work to `match_outbox`.
4. `npm run worker:match` drains the outbox and refreshes `match_candidates`.
5. Buyers and travelers can browse the matching results and manage their listings.

> Matching requires the dedicated worker process. Requests and trips may remain queued until the worker is running.

## Project Structure

```text
backend/
  src/
    server.ts                 Express entry point
    config/                   Database, auth, query, and match worker
    controllers/              HTTP request handling
    routers/                  API routes
    services/                 Database and business operations
    middlewares/              Authentication middleware
    utils/                    Request validation helpers
  schema/                     Pulled PostgreSQL schema snapshot
  better-auth_migrations/     Better Auth SQL migrations
  db/places_seeds/            PSGC geography seed data

frontend/
  src/
    pages/                    Top-level routed pages
    Layouts/                  Application and protected route layouts
    components/               Marketplace and form components
    hooks/                    TanStack Query API hooks
    config/                   API and query configuration
    utils/                    Cloudinary upload helper
```

## API Overview

Authentication is provided by Better Auth at `/api/auth/*splat`.

| Resource | Endpoints | Notes |
|---|---|---|
| Users | `GET /api/v1/users/me`, `PATCH /api/v1/users/update/:id` | Protected |
| Requests | `POST /api/v1/request/create`, `GET /api/v1/request/getAll`, `GET /api/v1/request/get/:id`, `GET /api/v1/request/myRequests`, `PATCH /api/v1/request/update/:id`, `DELETE /api/v1/request/delete/:id` | Listing reads are public; mutations require authentication |
| Trips | `POST /api/v1/trips/create`, `GET /api/v1/trips/getAll`, `GET /api/v1/trips/get/:id`, `GET /api/v1/trips/myTrips`, `PATCH /api/v1/trips/update/:id`, `DELETE /api/v1/trips/delete/:id` | Listing reads are public; mutations require authentication |
| Health | `GET /`, `GET /health` | Backend status checks |

## Prerequisites

- Node.js and npm
- PostgreSQL database, preferably Neon
- A Cloudinary account for image uploads
- PostgreSQL prerequisites on the live database:
  - `pg_trgm`
  - `uuid_generate_v7()`

## Local Setup

Backend and frontend are separate npm packages. Install dependencies and run commands inside each package directory.

### 1. Configure the backend

```bash
cd backend
cp .env.example .env
npm install
```

Fill in `backend/.env`:

```dotenv
PORT=5000
PGHOST=
PGDATABASE=
PGUSER=
PGPASSWORD=
PGPORT=
BETTER_AUTH_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173

# Required only by the matching worker
DATABASE_URL=
CONCURRENCY=4
IDLE_POLL_MS=3000
USE_LISTEN=0
```

### 2. Configure the frontend

```bash
cd ../frontend
cp .env.example .env
npm install
```

Set the frontend environment values:

```dotenv
VITE_API_URL=http://localhost:5000
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
```

The Cloudinary preset must allow unsigned uploads.

### 3. Start the services

Open a terminal for the backend:

```bash
cd backend
npm run dev
```

Open a second terminal for the frontend:

```bash
cd frontend
npm run dev
```

Open a third terminal for the matching worker:

```bash
cd backend
npm run worker:match
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- Backend health: `http://localhost:5000/health`

## Docker Setup

From the repository root:

```bash
docker compose up --build
```

This starts the frontend on `http://localhost:5173` and the backend on `http://localhost:5000`. The backend container reads `backend/.env`.

Set Cloudinary build variables before starting Docker if image uploads are needed:

```bash
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name \
VITE_CLOUDINARY_UPLOAD_PRESET=your-upload-preset \
docker compose up --build
```

The current Compose setup starts the frontend and backend but not the matching worker. Start it separately from `backend/` when matching is required.

## Database

`backend/schema/` is a pull-only snapshot of the live Neon database. It is not an apply/migration system; database changes should be made in the live database, then the snapshot should be refreshed with:

```bash
cd backend
./scripts/pull-schema.sh
```

The matching worker depends on database-side triggers and functions. Matching failures are recorded in `match_outbox_dead`. Geography seed files are available in `backend/db/places_seeds/` and can be loaded manually with `psql`.

## Validation

Backend:

```bash
cd backend
npm run build
```

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

## Routes

| Route | Access | Purpose |
|---|---|---|
| `/` | Public | Product landing page |
| `/login` | Public | Sign in |
| `/register` | Public | Create an account |
| `/home` | Protected | Matched requests and trips |
| `/activities` | Protected | Create, edit, and delete personal listings |
| `/requests` | Protected | Request marketplace view |
| `/trips` | Protected | Trip marketplace view |
| `/profile` | Protected | User profile |
