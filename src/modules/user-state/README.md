# User State (Backend Reference)

This module exposes backend-aligned user-state definitions and events for frontend usage.

## API

- GET /api/user-states/definitions
  - Returns `states` and `events` with the current backend state machine definitions.

## Source of Truth

- State resolution logic: `src/lib/user-state.ts`
- Definitions + events: `src/lib/user-state-events.ts`

## Notes for Frontend

- The backend uses `recordUserActivity(...)` to log events and refresh user state.
- Use the `/api/user-states/definitions` endpoint to render state labels, order, and descriptions.
