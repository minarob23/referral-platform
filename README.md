# AI-Assisted Referral Tracking Platform

A full-stack web application that enables users to refer friends to job opportunities and track referral statuses, powered by an AI assistant for smart recommendations.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL 16 |
| ORM | Prisma |
| AI | Google Gemini API (`gemini-1.5-flash`) |
| Auth | JWT (Bearer token) |
| DevOps | Docker, Docker Compose, GitHub Actions |

## Project Structure

```
referral-platform/
├── client/          # Next.js frontend (port 3000)
├── server/          # Express backend (port 4000)
├── docker-compose.yml
├── .github/
│   └── workflows/
│       └── test.yml  # CI stub
└── README.md
```

---

## Prerequisites

- [Node.js 20+](https://nodejs.org/)
- [PostgreSQL 16](https://www.postgresql.org/) (or use Docker)
- [Docker + Docker Compose](https://docs.docker.com/compose/) _(optional, for containerized setup)_
- A [Gemini API key](https://aistudio.google.com/app/apikey) _(optional — the app runs with stub AI responses if not provided)_

---

## Environment Variables

### Backend — `server/.env`

Create this file by copying the example:
```bash
cp server/.env.example server/.env
```

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/referral_db` |
| `JWT_SECRET` | Secret key for signing JWTs — **change this!** | `my-super-secret-key` |
| `GEMINI_API_KEY` | Google Gemini API key (optional) | `AIza...` |
| `PORT` | Port for the Express server | `4000` |

### Frontend — `client/.env.local`

Create this file by copying the example:
```bash
cp client/.env.local.example client/.env.local
```

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | URL of the backend API | `http://localhost:4000` |

---

## Option A — Local Development (without Docker)

### 1. Set up the database

Ensure PostgreSQL is running locally, then create the database:

```bash
psql -U postgres -c "CREATE DATABASE referral_db;"
```

### 2. Set up the backend

```bash
cd server

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit server/.env — set DATABASE_URL, JWT_SECRET, and optionally GEMINI_API_KEY

# Run database migrations
npx prisma migrate dev --name init

# Seed the database with 5 sample job listings
npm run db:seed

# Start the development server
npm run dev
```

The backend will be available at **http://localhost:4000**

### 3. Set up the frontend

Open a **new terminal**:

```bash
cd client

# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local
# Edit client/.env.local if needed (default points to http://localhost:4000)

# Start the development server
npm run dev
```

The frontend will be available at **http://localhost:3000**

---

## Option B — Docker Compose (Recommended)

This starts all three services (database, backend, frontend) with a single command.

### 1. Configure environment

Create a `.env` file in the project root (used by Docker Compose):

```bash
# referral-platform/.env
JWT_SECRET=your-super-secret-jwt-key-change-this
GEMINI_API_KEY=your-gemini-api-key-here   # Optional
```

### 2. Start all services

```bash
docker compose up --build
```

This will:
1. Start PostgreSQL and wait for it to be healthy
2. Build and start the backend — runs migrations and seeds automatically
3. Build and start the frontend

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:4000 |
| PostgreSQL | localhost:5432 |

### 3. Stop services

```bash
docker compose down

# To also remove the database volume:
docker compose down -v
```

---

## Database Seeding

The seed script creates **5 sample job listings**:

1. Senior Frontend Engineer — San Francisco, CA
2. Data Analyst — New York, NY
3. DevOps Engineer — Remote
4. Product Manager — Austin, TX
5. Backend Engineer (Node.js) — London, UK

**Manual seeding** (local dev):
```bash
cd server
npm run db:seed
```

**Docker**: seeding runs automatically on container startup.

---

## API Reference

All protected endpoints require the header:
```
Authorization: Bearer <token>
```

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | ✗ | Register a new user |
| `POST` | `/api/auth/login` | ✗ | Login and receive a JWT |
| `GET` | `/api/auth/me` | ✓ | Get current user info |
| `GET` | `/api/jobs` | ✓ | List all job listings |
| `GET` | `/api/referrals` | ✓ | List current user's referrals |
| `POST` | `/api/referrals` | ✓ | Submit a referral (auto-generates AI fit summary) |
| `PATCH` | `/api/referrals/:id/status` | ✓ | Update referral status |
| `POST` | `/api/ai/suggest-note` | ✓ | Generate an AI-powered referral note |

---

## Features Demo

1. **Register / Login** — Go to http://localhost:3000/register to create an account
2. **View Jobs** — Dashboard shows all 5 seeded job listings
3. **Refer a Friend** — Click "Refer a Friend →" on any job card
   - Fill in friend's name and email
   - Click **✨ Suggest a Note** — the AI generates a personalized referral note
   - Submit the form — an AI Fit Summary is automatically generated and saved
4. **Manage Referrals** — Go to "My Referrals" to see all referrals in a table
   - Update status via dropdown: Submitted → Interviewed → Hired / Rejected

---

## AI Integration Notes

- **Suggest Note**: Calls Gemini with the job description + friend's name to generate a warm 2–3 sentence referral note
- **Fit Summary**: Automatically generated on referral submission — a 1–2 sentence analysis of candidate fit
- **Fallback**: If `GEMINI_API_KEY` is not set (or the key is invalid), the app works normally with sensible placeholder text — no crashes

---

## CI/CD

A GitHub Actions workflow at `.github/workflows/test.yml` runs on every push/PR to `main`:
- Installs dependencies for both `server` and `client`
- Runs `npm test` (currently stubs — extend with real tests as needed)

---

## Development Scripts

### Backend (`server/`)

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript for production |
| `npm start` | Start production server |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed sample jobs |
| `npm run db:generate` | Regenerate Prisma client |

### Frontend (`client/`)

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

