# Server (backend entry)

Purpose
- `server.js` is the backend entry point. It wires Express, middleware, routes, DB connection, and error handling.

What's done here
- Loads environment variables and connects to MongoDB via `config/db.js`.
- Registers global middleware: `cors`, `cookieParser`, `express.json`, and any custom middlewares.
- Mounts route modules under `/api` (auth, pitches, messages, submissions, users, etc.).
- Attaches a global error handler (`errorHandler.js`).

Approach & rationale
- Keep `server.js` focused on composition and configuration. Route logic lives in `routes/*` and controllers.
- Configure `cors` to allow the frontend origin and `withCredentials` to support refresh cookies.

Tips for deployment
- Ensure environment variables for DB and JWT secrets are set in production.
- Add logging middleware and graceful shutdown handlers for robust production behavior.
