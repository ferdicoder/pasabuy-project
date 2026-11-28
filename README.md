# Pasabuy

<p align="center">
  <img width="1000" height="551" alt="image" src="https://github.com/user-attachments/assets/a485d6b8-af30-43f2-a18b-e6be3cad799f" />
</p>

<strong>
  <i><p align="center"> A route-based pasabu<i>y</i> marketplace that connects travelers with buyers across the Philippines.</p></i>
</p>
</strong>

<p>
  <a href="https://react.dev/" title="React"><img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19" /></a>
  <a href="https://vite.dev/" title="Vite"><img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" /></a>
  <a href="https://www.typescriptlang.org/" title="TypeScript"><img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://tailwindcss.com/" title="Tailwind CSS"><img src="https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS v4" /></a>
  <a href="https://reactrouter.com/" title="React Router"><img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white" alt="React Router" /></a>
  <a href="https://tanstack.com/query" title="TanStack Query"><img src="https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white" alt="TanStack Query" /></a>
  <a href="https://axios-http.com/" title="Axios"><img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" alt="Axios" /></a>
  
  <a href="https://nodejs.org/" title="Node.js"><img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" /></a>
  <a href="https://expressjs.com/" title="Express"><img src="https://img.shields.io/badge/Express_5-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express 5" /></a>
  <a href="https://better-auth.com/" title="Better Auth"><img src="https://img.shields.io/badge/Better_Auth-000000?style=for-the-badge&logo=auth0&logoColor=white" alt="Better Auth" /></a>
  <a href="https://zod.dev/" title="Zod"><img src="https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white" alt="Zod" /></a>
  <a href="https://www.postgresql.org/" title="PostgreSQL"><img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" /></a>
  <a href="https://neon.com/" title="Neon"><img src="https://img.shields.io/badge/Neon-00E699?style=for-the-badge&logo=postgresql&logoColor=black" alt="Neon" /></a>
  <a href="https://cloudinary.com/" title="Cloudinary"><img src="https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" alt="Cloudinary" /></a>
    <a href="https://www.docker.com/" title="Docker"><img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" /></a>
</p>

## Introduction

Pasabuy is a full-stack matching marketplace for people who need an item delivered along an existing trip. Buyers can post requests with an estimated price, origin, delivery location, details, and a reference image. Travelers can publish their route, departure and arrival dates, available capacity, and destination image.

The system brings both sides together by route and trip data. Matching logic is powered by PostgreSQL functions and an outbox worker: requests and trips enqueue match work, the worker refreshes scored candidates, and the frontend presents the available requests and trips through one marketplace feed.








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
