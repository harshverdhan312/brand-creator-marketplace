# Utils

Purpose
- Utility modules hold reusable business logic and integrations that shouldn't live in controllers or models.

Examples in this repo
- `escrowService.js` — simulates escrow creation, release and refunds, and credits user balances. Keeps payment logic isolated so swapping to a real gateway is straightforward.
- `jwt.js` — helper for signing and verifying access/refresh tokens.

Guidelines
- Keep utils side-effect free when possible; return results rather than writing directly to response.
- Handle errors clearly and let controllers decide HTTP response codes.
