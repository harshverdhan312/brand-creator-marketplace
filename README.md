# Brand–Creator Marketplace

A production-ready MERN scaffold for a brand–creator collaboration marketplace (backend + frontend).

## Project layout

- `backend/` — Express API, MongoDB (Mongoose), JWT auth (access + refresh), controllers, routes, models.
- `frontend/` — React (Vite) + Tailwind, Axios API client, contexts for Auth & Notifications, pages/components.

## Features

- Role-based users: `brand` and `creator`.
- Authentication with access & refresh tokens (httpOnly refresh cookie).
- Campaigns: create, request (creator → brand), approve/reject (brand), per-piece pricing in INR.
- Pitches: creators can pitch to campaigns or directly to brands; brands can accept/reject.
- Escrow simulation: escrow created on acceptance/approval; working lists for brands/creators.
- In-app notifications (toast style).
- Profile pages (view & editable) with social links (Instagram, LinkedIn, Website).
- Landing page for unauthenticated visitors.

## Environment

Create a `.env` in `backend/` with values similar to:

```
MONGO_URI=mongodb://localhost:27017/brand_creator_db
JWT_ACCESS_SECRET=replace_me
JWT_REFRESH_SECRET=replace_me_too
PORT=5136
NODE_ENV=development
```

Frontend dev server defaults to port `5137` (see `frontend/vite.config.js`).

## Running (development)

Start the backend from the `backend/` folder:

```bash
cd backend
npm install
npm run dev
```

Start the frontend from the `frontend/` folder:

```bash
cd frontend
npm install
npm run dev
```

The frontend is configured to call the API at `http://localhost:5136/api` and uses `withCredentials` to support refresh cookies.

## Important routes (summary)

Backend (example):
- `POST /api/auth/register` — register (accepts `bio` and `socialLinks`)
- `POST /api/auth/login`
- `POST /api/auth/refresh` — refresh access token (uses refresh cookie)
- `GET /api/users/brands`, `GET /api/users/creators`
- `GET /api/users/:id` — public profile view
- `GET/PUT /api/users/me/profile` — current user profile
- `GET /api/campaigns` (open), `GET /api/campaigns/for-brand`
- `POST /api/pitches`, `POST /api/pitches/to-brand`
- `POST /api/escrow/:escrowId/approve` — release escrow (brand)

Frontend (important pages/routes):
- `/` — Landing (if not logged in) or Home (if logged in)
- `/login`, `/register`
- `/dashboard` — role-specific dashboard
- `/profile` — edit/view own profile
- `/profile/:id` — view another user's profile
- `/my-brands` — creator: brands you work with + active campaigns
- `/working-creators` — brand: creators you work with + pending campaign requests

## Notes & Next steps

- Escrow is simulated via `backend/utils/escrowService.js` — replace with payment gateway or smart-contract integration for production.
- Add input validation, rate limiting, and more security hardening before deploying.
- Add tests (unit & integration) and CI pipeline.

---
If you want, I can run the dev servers now and fix any runtime issues (your last run showed exit code 130). Tell me to proceed and I'll start them and report back any errors.
