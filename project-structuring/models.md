# Models

Purpose
- Mongoose models define the data schema, default values, and relationships used by the backend.

Key models and responsibilities in this project
- `User` — stores account info, role (`brand` or `creator`), balance, and public profile fields.
- `Pitch` — describes a proposal from a creator to a brand (or campaign); has `status` lifecycle such as `PITCH_SUBMITTED`, `PITCH_ACCEPTED`, `WORK_SUBMITTED`, `COMPLETED`.
- `Escrow` — simulates escrow state for payments (statuses like `ESCROW_LOCKED`, `ESCROW_RELEASED`).
- `Submission` — represents a creator's submitted deliverables; now includes `rejectionReason` and `status` (`SUBMITTED`, `ACCEPTED`, `REJECTED`).
- `Conversation` — stores simple conversation objects with messages and participants.

Design notes & approach
- Use small, focused schemas and reference other documents by ObjectId when modeling relationships (e.g., `creatorId`, `brandId`).
- Keep audit fields: `createdAt`, `updatedAt` where state changes matter.
- Use enums for statuses to centralize allowed state values and make transitions predictable.

Migration/backfill guidance
- Adding a new optional field (e.g., `rejectionReason`) is non-breaking for Mongoose. To backfill existing documents, run a Mongo script: `db.submissions.updateMany({ rejectionReason: { $exists: false } }, { $set: { rejectionReason: '' } })`.
