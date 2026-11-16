# AGENTS.md

## Layout
- Two separate npm packages: `backend/` and `frontend/`. Not a workspace — install, run, and build inside each directory (each has its own lockfile).
- Root `package.json` / `tsconfig.base.json` are unused; nothing extends them.
- Backend entry: `backend/src/server.ts` (Express 5, Better Auth, pg/Neon). Frontend entry: `frontend/src/main.tsx` (React 19, Vite, TanStack Query, Tailwind v4).

## Commands
```bash
# backend (cwd = backend/)
npm run dev     # tsx watch src/server.ts → :5000
npm run build   # tsc → dist/ (also the typecheck; no lint/test scripts)
npm start       # node dist/server.js

# frontend (cwd = frontend/)
npm run dev     # vite → :5173
npm run lint    # eslint .
npm run build   # tsc -b && vite build (typecheck only happens here)
npm start       # serve -s dist -l $PORT
```
- No test suite exists; do not invent test commands.
- Verify frontend changes with: `npm run lint` then `npm run build`.
- Verify backend changes with: `npm run build`.

## Backend conventions
- ESM + NodeNext: relative imports in `.ts` must end in `.js` (e.g. `import { pool } from './config/connectDB.js'`).
- Layering: routers → controllers → services → `sql()` helper in `src/config/query.ts`. Zod validation via `src/utils/validateBody.ts`.
- Better Auth mounted at `/api/auth/*splat` (Express 5 splat syntax) before body parsers; app APIs under `/api/v1/{users,request,trips}`.
- Auth is cookie-based. Protected routes use `requireAuth` (`src/middlewares/requireAuth.ts`); session user lands on `req.user`. Reads like `/getAll` and `/get/:id` are intentionally public.
- CORS origin and Better Auth `trustedOrigins` are hardcoded to `http://localhost:5173`.
- Env (see `backend/.env.example`): `PORT`, `PGHOST`/`PGDATABASE`/`PGUSER`/`PGPASSWORD`/`PGPORT`, `BETTER_AUTH_URL`. Loaded via `import "dotenv/config"`.
- DB pool always sets `ssl: { rejectUnauthorized: false }` (Neon).
- `*.sql` is gitignored: `backend/better-auth_migrations/*.sql` (Better Auth schema) is not in git — may be missing on a fresh clone.

## Frontend conventions
- All API URLs go through `src/config/api.ts` (`VITE_API_URL` prefix); React Query keys live in `src/config/queryKeys.ts`; shared fetch/mutation hooks (axios `withCredentials: true`) in `src/hooks/useAPI.tsx`.
- Auth: `ProtectedRoutes` checks `GET /api/v1/users/me` and redirects to `/login` on 401. After login, session is read via that endpoint (not a Better Auth client SDK).
- Tailwind v4: configured only by the `@tailwindcss/vite` plugin; styles via `@import "tailwindcss"` in `src/index.css` — no `tailwind.config`.
- Cloudinary uploads happen client-side (`src/utils/uploadImage.ts`) with an unsigned preset; requires `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET`.
- Env (see `frontend/.env.example`): `VITE_API_URL`, Cloudinary vars.

## Gotchas
- Backend tsconfig is strict: `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noUnusedLocals`/`noUnusedParameters`, `verbatimModuleSyntax`.
- Interface files use inconsistent extensions (`.ts` vs `.tsx`); backend has a typo'd filename `user.internface.ts` — don't "fix" renames casually (imports depend on them).
- Vite has no proxy: the frontend calls the backend directly at `VITE_API_URL`; both dev servers must run for full-stack work.
