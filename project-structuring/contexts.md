# Contexts (frontend)

Purpose
- React Contexts provide app-level state: authentication, notifications, and other shared state.

Contexts in this repo
- `AuthContext.jsx` — exposes `user`, `login`, `logout`, and token-aware Axios client configuration. Many components rely on `AuthContext` to show role-specific UI.
- `NotificationContext.jsx` — lightweight toast notifications used across the app.

Design notes
- Keep contexts small and only expose what consumers need. Keep local UI state inside components.
- Use `withCredentials` and refresh token flow at Auth layer to transparently maintain sessions.
