# Routes (Backend Index)

This folder is the central backend route index for frontend integration.

## Files
- api-routes.ts: All API routes with feature mapping and user-state events
- user-state-events.ts: Source-of-truth list of user state events + definitions

## Notes
- Do NOT move Next.js route handlers from `src/app/api/*`.
- Use this folder as a single source for frontend routing and state awareness.
