# Controllers

Purpose
- Controllers contain request handlers that implement business logic for API routes. They orchestrate model access, validation, notifications, and external services (e.g., escrowService).

Structure & approach used in this project
- Each controller exports named async functions (e.g., `createPitch`, `acceptPitch`, `sendMessage`).
- Controllers assume an `auth` middleware has set `req.user`.
- They keep HTTP concerns (status codes, JSON responses) at the edges and delegate data operations to Mongoose models and utility modules.

Guidelines for authors
- Validate required inputs early and return `400`/`403`/`404` as appropriate.
- Minimize duplication: reuse services (e.g., `escrowService`) for state transitions.
- Create notifications after state changes (e.g., pitch accepted → notify creator).
- Keep controller functions small and focused; move complex logic to `utils` when needed.

Files of interest
- `backend/controllers/pitchController.js` — pitch lifecycle (create, accept, reject, list).
- `backend/controllers/submissionController.js` — handles submission create/accept/reject and ties to escrow/dispute flows.
- `backend/controllers/messageController.js` — conversation/message endpoints; enforces connection checks.

Testing tips
- Mock `req.user` and Mongoose models when unit-testing controllers.
