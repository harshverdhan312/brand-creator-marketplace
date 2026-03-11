# App (frontend entry & routing)

Purpose
- `App.jsx` composes the frontend: providers (`AuthProvider`, `NotificationProvider`), the `Navbar`, and React Router `Routes` for pages.

Key responsibilities
- Register global providers that manage auth and notifications.
- Add the top-level layout (container, spacing) and place `Navbar` outside `Routes` so it persists between pages.
- Define route-to-page mapping and guard protected routes via `ProtectedRoute` where needed.

Approach & rationale
- Keep `App.jsx` minimal and declarative — heavy page-specific logic belongs to page components.
- Use route-based code splitting if page bundle sizes grow.

Notes on auth flow
- `AuthProvider` manages access/refresh tokens and exposes `user` to the rest of the app. The Axios instance uses the auth tokens and `withCredentials: true` for refresh cookie handling.
