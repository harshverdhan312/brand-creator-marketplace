# Middlewares

Purpose
- Middlewares perform cross-cutting concerns: authentication, authorization, error handling, input parsing.

Key middlewares in this project
- `authMiddleware.js` — verifies JWT access token, sets `req.user`.
- `roleMiddleware.js` — helper to restrict access based on `user.role`.
- `errorHandler.js` — global Express error handler to return consistent JSON errors.

Design notes
- Keep middlewares focused. Do not perform heavy data manipulation; instead, set context for controllers.
- Middleware order matters: parsing (JSON), cookie parser, auth, then routes, then error handler.
