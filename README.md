# JobPilot Frontend

[![CI](https://github.com/parth1010444/jobpilot-frontend/actions/workflows/ci.yml/badge.svg?branch=dev)](https://github.com/parth1010444/jobpilot-frontend/actions/workflows/ci.yml)

Phase 12 UI + Phase 13 CI for [jobpilot-backend](https://github.com/parth1010444/jobpilot-backend) (`dev`, Spring Boot 3.5, Phases 1–12). This is the operator console: applications, interviews, analytics, recommendations, reminders, notifications, skills, resumes, and JD preview.

The interface is intentionally **not** a default Vite starter. It is a dark, Linear/Vercel-like command surface with a persistent app shell, skeletons, empty states, and typed API access.

**Pull requests target `dev`, not `main`.**

## Stack

- Vite + React 19 + TypeScript (strict)
- React Router
- TanStack Query v5
- Zustand (JWT session in `localStorage`)
- Tailwind CSS v4 + local shadcn-style primitives
- Recharts, lucide-react, Sonner
- Vitest + React Testing Library
- ESLint

## Talk to the real backend

1. Run JobPilot backend on port `8080` (see its README on `dev`).
2. **CORS must allow `http://localhost:5173`.** Backend Phase 12 defaults `JOBPILOT_CORS_ALLOWED_ORIGINS` to the Vite origins and exposes `Retry-After` for 429s. Override that list if you serve the UI from another origin.
3. Copy env and start the UI:

```bash
cp .env.example .env
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `http://localhost:8080` | Spring Boot origin (no trailing slash) |

Auth: `POST /api/auth/login` and `/register` return `accessToken` + `user`. The app boots with `GET /api/users/me`. Protected routes redirect to `/login` on missing token or **401**. **409** (duplicate email, stale `version`) and **429** (`Retry-After`) surface the backend `message`.

## Scripts

```bash
npm run dev          # Vite on :5173
npm run build        # tsc -b && vite build
npm run preview
npm test
npm run lint
npm run mock-api     # optional local stand-in on :8080 for UI review
```

`npm run mock-api` is **not** the product backend. Use it only when Java/Postgres are not running. Demo login: `parth@jobpilot.dev` / `password123`.

Node **22+** (see `.nvmrc`). The same commands run in GitHub Actions on every push and pull request to `dev`.

## CI

GitHub Actions (`.github/workflows/ci.yml`) installs with `npm ci`, then fails the job if any of these fail:

```bash
npm run lint
npm test
npm run build
```

Dependabot watches npm and GitHub Actions weekly and opens PRs against `dev`.

## Production / deploy

This app is a static Vite SPA. `npm run build` emits `dist/`. Host that folder on any static host (Cloudflare Pages, Netlify, GitHub Pages, S3 + CloudFront, nginx). Configure SPA fallback so unknown paths serve `index.html`.

`VITE_API_BASE_URL` is baked in at **build** time (Vite). Point it at the public Spring Boot origin, with no trailing slash:

```bash
VITE_API_BASE_URL=https://api.example.com npm run build
```

The browser calls that origin directly. The backend must allow the **frontend origin** in CORS (`JOBPILOT_CORS_ALLOWED_ORIGINS` on [jobpilot-backend](https://github.com/parth1010444/jobpilot-backend)), including `Authorization` and `Content-Type`, and must expose `Retry-After` for 429s. A static host does not proxy the API unless you add that yourself.

## App map

| Route | Backend |
| --- | --- |
| `/login`, `/register` | `POST /api/auth/login\|register`, boot `GET /api/users/me` |
| `/` | `/api/analytics/summary\|funnel\|timeline\|skills-gap`, `/api/recommendations` |
| `/applications` | `GET /api/applications?q&status&page&size` |
| `/applications/new` | `POST /api/applications` |
| `/applications/:id` | GET/PATCH (always send `version`), notes, JD, match/analyze, interviews, recommendation |
| `/reminders` | `/api/reminders` |
| `/notifications` | `/api/notifications`, `PATCH .../read` |
| `/skills` | `/api/skills` |
| `/resumes` | `/api/resumes` (name, versionLabel, description, fileUrl only) |
| `/analyze` | `POST /api/job-analysis/preview` |

Application statuses: `SAVED`, `APPLIED`, `OA`, `INTERVIEW`, `OFFER`, `REJECTED`, `WITHDRAWN`. Status moves follow the backend transition table.

## Layout

Feature modules live under `src/features/*`. Shared API types, the fetch client, and UI primitives live under `src/shared`.
