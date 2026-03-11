# Routes

Purpose
- Routes map HTTP endpoints to controller functions and attach middleware (authentication, role checks, error handling).

Conventions used
- Route files are grouped by resource: `authRoutes.js`, `pitchRoutes.js`, `messageRoutes.js`, `submissionRoutes.js`, etc.
- Each route file creates an Express `router` and exports it to be mounted under `/api` in `server.js`.

Best practices followed here
- Use `authMiddleware` to protect endpoints and `roleMiddleware` to restrict role-specific actions (e.g., only `brand` may accept a pitch).
- Keep route handlers thin: delegate to controllers.
- Use RESTful naming for clarity (`POST /pitches/:id/accept`, `POST /submissions/:id/accept`).
