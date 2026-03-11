# Services (frontend)

Purpose
- Services are thin HTTP clients that centralize API calls (using Axios) so components/pages import descriptive functions instead of repeating URLs.

Examples
- `messageService.js` — `sendMessage`, `getConversation`, `getOrCreateWithUser`, `listConversations`.
- `pitchService.js` — functions to create, accept, list pitches.
- `submissionService.js` — create submissions and brand/creator listing, accept/reject.

Benefits & guidelines
- Keep service function names expressive and return Axios responses (so callers can handle `.data` and errors consistently).
- Centralize base Axios config in `services/api.js` (base URL, `withCredentials`, interceptors).
