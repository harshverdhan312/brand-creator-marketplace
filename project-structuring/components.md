# Components (frontend)

Purpose
- Reusable UI pieces used across pages: cards, chat box, loading spinner, navbar, protected route wrapper.

Key components
- `Navbar.jsx` — top navigation, shows links based on `AuthContext`.
- `ChatBox.jsx` — small chat UI for conversation messages and sending.
- `PitchCard.jsx`, `BrandCard.jsx`, `CreatorCard.jsx` — visual tiles used in lists.

Design approach
- Keep components presentational where possible; move data fetching into pages or services to simplify testing.
- Accept props to configure behavior; avoid internal fetches unless the component is clearly a container.

Styling
- Uses Tailwind utility classes; keep components small to encourage composition.
