# JobPilot Frontend

Phase 12 UI for [jobpilot-backend](https://github.com/parth1010444/jobpilot-backend) (`dev`, Spring Boot 3.5, Phases 1–11). This is the operator console: applications, interviews, analytics, recommendations, reminders, notifications, skills, resumes, and JD preview.

The interface is intentionally **not** a default Vite starter. It is a dark, Linear/Vercel-like command surface with a persistent app shell, skeletons, empty states, and typed API access.

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
2. **CORS must allow `http://localhost:5173`.** The backend enables `cors(Customizer.withDefaults())` but ships no `CorsConfigurationSource`. Add one on the API (or a reverse proxy) that permits the Vite origin, `Authorization`, and `Content-Type`, and exposes `Retry-After` for 429s.
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
