# Z-CV — Resume Builder & Career Platform

Next.js 16 full-stack application: resume builder, CV tools, learning hub, payments (Fiserv), and job search. This document is intended for **DevOps** for containerization, deployment, and environment setup.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | React 19, MUI 7, Tailwind CSS 4, Framer Motion |
| Database | PostgreSQL (Prisma ORM) |
| Auth | JWT (cookie-based) |
| Payments | Fiserv |
| AI / PDF | OpenAI, jsPDF, pdf-parse |

---

## Requirements

- **Node.js** 18.x or 20.x (LTS recommended)
- **pnpm** or **npm** (lockfile present for npm)
- **PostgreSQL** 14+ (for production)

---

## Environment Variables

These must be set for build/runtime. Use a `.env` or `.env.local` in development; in Docker/K8s use secrets or env files.

### Required (core)

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/dbname` |
| `JWT_SECRET` | Secret for signing JWT tokens (use a strong value in production) | long random string |

### Required for payment (Fiserv)

| Variable | Description |
|----------|-------------|
| `FISERV_API_KEY` | Fiserv API key |
| `FISERV_SECRET` | Fiserv secret |
| `FISERV_STORE_ID` | Fiserv store ID |
| `FISERV_WEBHOOK_URL` | Public URL for payment webhooks (production) |

Optional: `FISERV_BASE_URL`, `FISERV_WEBHOOK_URL` (override defaults).

### Payment webhook verification

| Variable | Description |
|----------|-------------|
| `PAYMENT_WEBHOOK_SECRET` | Secret used to verify Fiserv webhook payloads |

### Optional (features)

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | OpenAI API key (CV improve, cover letter, analyze) |
| `NEXT_PUBLIC_API_URL` | Public API base URL (if different from same origin) |
| `NEXT_PUBLIC_BASE_URL` | Public app base URL (e.g. for auth refresh) |
| `YOUTUBE_API_KEY` | YouTube Data API (learning hub) |
| `RAPIDAPI_KEY` | RapidAPI key (courses, jobs) |
| `ADZUNA_APP_ID` | Adzuna app ID (job search) |
| `ADZUNA_APP_KEY` | Adzuna app key (job search) |
| `JOB_DATA_API_KEY` | Job data API key (if used) |
| `DATABASE_PATH` | Optional path for SQLite (dev only; production uses PostgreSQL) |

### Build / runtime

- `NODE_ENV`: `development` | `production`

---

## Local Development (reference for DevOps)

```bash
# Install dependencies
npm ci

# Set env (see above); ensure DATABASE_URL points to a running PostgreSQL
cp .env.example .env   # if you provide one; then fill values

# Generate Prisma client and run migrations
npx prisma generate
npx prisma migrate deploy

# Run dev server (default port 3000)
npm run dev
```

---

## Build & Start (production)

```bash
npm ci
npx prisma generate
npx prisma migrate deploy   # or your migration strategy
npm run build
npm run start
```

- **Build command:** `npm run build` (uses `next build --webpack`)
- **Start command:** `npm run start` (uses `next start`)
- **Default port:** 3000 (override with `PORT` env if needed)

---

## Database (Prisma)

- **Provider:** PostgreSQL.
- **Migrations:** Prisma. Apply in deployment with:
  - `npx prisma migrate deploy` (recommended for production), or
  - Your CI/CD migration step.
- **Schema location:** `prisma/schema.prisma`.
- **Client:** Generated with `npx prisma generate`; must run before `npm run build` in Docker/CI.

---

## Docker (for DevOps)

There is no Dockerfile in the repo yet. Below is a minimal multi-stage setup you can add and adjust.

### Suggested `Dockerfile`

```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

**Note:** The above uses Next.js **standalone** output. You must enable it in `next.config.mjs`:

```js
const nextConfig = {
  output: 'standalone',
  // ... rest of config
};
```

If you prefer not to use `standalone`, run `npm run start` instead and copy the full app:

```dockerfile
COPY --from=builder /app ./
CMD ["npm", "run", "start"]
```

### Suggested `docker-compose.yml` (app + DB for local/staging)

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/zcv
      - JWT_SECRET=${JWT_SECRET}
      # Add other env vars or use env_file
    env_file:
      - .env
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: zcv
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  pgdata:
```

**Migrations:** Run once after DB is up, e.g.:

```bash
docker compose up -d db
docker compose run --rm app npx prisma migrate deploy
docker compose up -d app
```

Or run migrations from an init container / entrypoint script in your orchestration.

---

## Ports

| Service | Default port |
|---------|--------------|
| Next.js app | 3000 |
| PostgreSQL (if run locally) | 5432 |

---

## Health & Readiness

- Next.js does not expose a built-in health endpoint. For Kubernetes/load balancers you can:
  - Use a simple **HTTP GET** to `/` or any public route (e.g. `/pricing`) and expect 200, or
  - Add a small **API route** (e.g. `GET /api/health`) that returns 200 and optionally checks `DATABASE_URL`/Prisma connectivity.

---

## Security Notes for Production

1. **JWT_SECRET:** Use a long, random secret; never commit it.
2. **DATABASE_URL:** Restrict DB access by network and use strong credentials.
3. **Cookies:** The app sets `secure: true` when `NODE_ENV === 'production'`; ensure HTTPS in front of the app.
4. **Webhooks:** `PAYMENT_WEBHOOK_SECRET` must match Fiserv configuration; keep it secret.
5. **Env files:** Do not commit `.env` or `.env.local`; use secrets management in CI/CD and orchestration.

---

## Repo Structure (relevant to deploy)

```
├── prisma/
│   └── schema.prisma    # DB schema and migrations
├── public/              # Static assets
├── src/
│   ├── app/             # Next.js App Router (pages, API routes)
│   ├── components/
│   ├── lib/             # DB (Prisma), auth
│   ├── services/        # OpenAI, jobs, learning hub
│   └── ...
├── next.config.mjs
├── package.json
└── package-lock.json
```

---

## Quick reference for DevOps

| Task | Command / note |
|------|-----------------|
| Install deps | `npm ci` |
| Generate Prisma client | `npx prisma generate` |
| Run DB migrations | `npx prisma migrate deploy` |
| Build | `npm run build` |
| Start production server | `npm run start` |
| Default app port | 3000 |
| Database | PostgreSQL; connection via `DATABASE_URL` |
| Enable standalone Docker build | Set `output: 'standalone'` in `next.config.mjs` |

If you need a `.env.example` with placeholder keys for the team, it can be added alongside this README.
