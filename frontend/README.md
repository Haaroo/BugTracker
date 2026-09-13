# BugTracker Frontend

Next.js (Pages Router) + TypeScript + Tailwind CSS frontend for BugTracker. Bugs are shown on a kanban-style board grouped by status (Open / In Progress / Resolved) instead of a plain table, with a detail page per bug for its full description and comment thread.

## Running locally

```bash
npm install
npm run dev
```

Opens on http://localhost:3000 and expects the API at `http://localhost:8080` by default. Override with an env var if needed:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080 npm run dev
```

## Project structure

- `src/pages` – routes (`/` board, `/bugs/[id]` detail page)
- `src/components/board` – the kanban board, columns and cards
- `src/components/bugs` – create/edit/delete modals and the comment thread
- `src/components/ui` – small reusable primitives (Modal, Button, Badge, Toast, EmptyState)
- `src/lib` – typed API client (`api.ts`) built on a thin fetch wrapper (`http.ts`)

## Tests

```bash
npm test
```

Unit tests (Jest + React Testing Library) cover the API client and every interactive component: form validation and submission for the create/edit/delete flows, the comment thread, and the board's loading/error/empty states.

## Build

```bash
npm run build
npm start
```

## Docker

```bash
docker build -t bugtracker-frontend --build-arg NEXT_PUBLIC_API_URL=http://localhost:8080 .
docker run -p 3000:3000 bugtracker-frontend
```
