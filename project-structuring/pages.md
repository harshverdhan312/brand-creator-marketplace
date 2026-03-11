# Pages (frontend)

Purpose
- Pages are route-level containers that fetch data, orchestrate components, and handle user interactions for specific routes.

Important pages
- `Dashboard.jsx` — role-specific dashboard; creators see their pitches and can submit work; brands see received pitches and can view work submissions.
- `Messages.jsx` — lists connected users and opens `ChatBox` for messaging.
- `Profile.jsx`, `Home.jsx`, `Login.jsx`, `Register.jsx` — standard pages for profile and auth flows.

Design guidance
- Fetch data in `useEffect` hooks and pass to child components.
- Keep UI logic and async flows (loading, error handling) in pages rather than in pure presentational components.
