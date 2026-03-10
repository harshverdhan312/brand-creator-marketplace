# Brand–Creator Marketplace

A production-ready MERN scaffold for a brand–creator collaboration marketplace (backend + frontend).

## Project layout

- `backend/` — Express API, MongoDB (Mongoose), JWT auth (access + refresh), controllers, routes, models.
- `frontend/` — React (Vite) + Tailwind, Axios API client, contexts for Auth & Notifications, pages/components.

Recent frontend additions:
- `frontend/src/pages/Messages.jsx` — new Messages page listing connected brands/creators and opening `ChatBox` to message them.
- `frontend/src/components/ChatBox.jsx` — chat UI used across Profile and Messages page.
- `frontend/src/components/Navbar.jsx` — now contains a `Messages` link for logged-in users.

## Features

- Role-based users: `brand` and `creator`.
- Authentication with access & refresh tokens (httpOnly refresh cookie).
- Campaigns: create, request (creator → brand), approve/reject (brand), per-piece pricing in INR.
- Pitches: creators can pitch to campaigns or directly to brands; brands can accept/reject.
- Escrow simulation: escrow created on acceptance/approval; working lists for brands/creators.
- In-app notifications (toast style).
- Profile pages (view & editable) with social links (Instagram, LinkedIn, Website).
- Landing page for unauthenticated visitors.

New/updated flows (messaging & submissions):
- Messaging is only allowed between a creator and brand when there is an accepted (or later) pitch connecting them. The backend enforces this check before creating or returning conversations.
- A dedicated `Messages` page lists connected Brands (for creators) or Creators (for brands) and embeds `ChatBox` to message selected connection.
- Submission flow: when a creator submits work the backend creates a `Submission` and updates the `Pitch` status to `WORK_SUBMITTED`. Brands can view submitted work from the Dashboard and accept or reject it.
- Rejection requires a mandatory feedback message; the `Submission` model now includes `rejectionReason` which is visible to the creator in their "My Submissions" list.
- Accepting a submission releases the escrow (simulated) and credits the creator's balance via `backend/utils/escrowService.js`.

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

If you add new backend models (like the `rejectionReason` field on `Submission`) while your DB already has `Submission` documents, you don't strictly need a migration — Mongoose will accept the new field when present. If you want to backfill or ensure the field exists with defaults, use a small Mongo script (example given below).

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
Message endpoints (new/important):
- `POST /api/messages/send` — send a message. Body: `{ toUserId, text, conversationId? }` (requires users to be connected by accepted pitch).
- `GET /api/messages` — list conversations for current user (backend filters to connections with accepted pitch).
- `GET /api/messages/with/:userId` — get or create permitted conversation with another user (only if connected by accepted pitch).
- `GET /api/messages/:id` — get conversation by id (only participants allowed and requires accepted pitch between participants).

Submission endpoints (updated behavior):
- `POST /api/submissions` — creator submits work. Body: `{ escrowId, pitchId, deliverables, notes }`.
- `GET /api/submissions/brand` — brand: list submissions for brand.
- `GET /api/submissions/creator` — creator: list own submissions.
- `POST /api/submissions/:id/accept` — brand accepts submission → backend releases escrow and updates `Pitch` to `COMPLETED`.
- `POST /api/submissions/:id/reject` — brand rejects submission → backend sets submission `status` to `REJECTED`, stores `rejectionReason`, creates a `Dispute`, and notifies the creator. Request body must include `{ reason }`.
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

Testing the new flows (quick guide)
1. Create two users: one `creator` and one `brand` (via `/api/auth/register`).
2. As the creator, create a pitch to the brand (`POST /api/pitches/to-brand` or `POST /api/pitches` with `brandId`).
3. As the brand, accept the pitch: `POST /api/pitches/:id/accept`. This will create an `Escrow` and set `Pitch.status` to `PITCH_ACCEPTED`.
4. As the creator, submit work from the Dashboard (`Submit Work` button). Backend will create a `Submission` and set `Pitch.status` to `WORK_SUBMITTED`.
5. As the brand, open Dashboard → click `View Work` for the pitch. The modal shows deliverables and notes. Use `Accept` to release escrow (creator's `balance` credited) or `Reject` to open the rejection widget and require a feedback reason.
6. As the creator, view `My Submissions` on Dashboard to see statuses and any `rejectionReason` provided.

Database migration / backfill example (Mongo shell):
```js
// Add `rejectionReason` as empty string for existing submissions
db.submissions.updateMany({ rejectionReason: { $exists: false } }, { $set: { rejectionReason: '' } })
```

Files changed (recent)
- `backend/controllers/messageController.js` — enforces accepted-pitch checks for messaging.
- `backend/models/Submission.js` — added `rejectionReason` field.
- `backend/controllers/submissionController.js` — stores rejection reason and includes it in notifications.
- `frontend/src/pages/Messages.jsx` — new Messages UI.
- `frontend/src/components/Navbar.jsx` — added Messages link.
- `frontend/src/pages/Dashboard.jsx` — added View Work modal and My Submissions list; accept/reject flows wired to APIs.

If you'd like, I can:
- Run the dev servers and do an end-to-end test of the pitch → accept → submit → view → accept/reject flow.
- Add a small API test or Postman collection that exercises the key endpoints above.

---
If you want, I can run the dev servers now and fix any runtime issues (your last run showed exit code 130). Tell me to proceed and I'll start them and report back any errors.
