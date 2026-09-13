# BugTracker API

Go backend for BugTracker: a small REST API for tracking bugs and their comments, built with an embedded database (no external DB server to install).

## Stack

- Go 1.24
- [gorilla/mux](https://github.com/gorilla/mux) for routing
- [gorilla/handlers](https://github.com/gorilla/handlers) for CORS and access logging
- [bbolt](https://github.com/etcd-io/bbolt) as an embedded, file-based key/value store
- [swaggo](https://github.com/swaggo/swag) for generating an OpenAPI/Swagger spec from code comments

## Running locally

```bash
go mod download
go run ./cmd/server
```

The API listens on `http://localhost:8080` by default. Config comes from environment variables (all optional):

| Variable          | Default                  | Purpose                              |
|-------------------|---------------------------|---------------------------------------|
| `PORT`            | `8080`                    | HTTP port                             |
| `DB_PATH`         | `bugtracker.db`           | Path to the bbolt database file       |
| `FRONTEND_ORIGIN` | `http://localhost:3000`   | Origin allowed by CORS                |

## API docs (Swagger)

Once the server is running, open **http://localhost:8080/api/docs/index.html** for an interactive Swagger UI, or fetch the raw spec at `/api/docs/doc.json`.

If you change any `@...` annotations in the handlers, regenerate the docs with:

```bash
go install github.com/swaggo/swag/cmd/swag@latest
swag init -g cmd/server/main.go -o docs
```

## Endpoints

| Method | Path                     | Description             |
|--------|--------------------------|--------------------------|
| GET    | `/api/health`             | Health check             |
| GET    | `/api/bugs`                | List all bugs            |
| POST   | `/api/bugs`                | Create a bug             |
| DELETE | `/api/bugs`                | Delete all bugs          |
| GET    | `/api/bugs/{id}`           | Get a single bug         |
| PUT    | `/api/bugs/{id}`           | Update a bug             |
| DELETE | `/api/bugs/{id}`           | Delete a bug             |
| GET    | `/api/bugs/{id}/comments`  | List comments on a bug   |
| POST   | `/api/bugs/{id}/comments`  | Add a comment to a bug   |

Bug `status` is one of `Open`, `In Progress`, `Resolved`. Priority is one of `Low`, `Medium`, `High`.

## Tests

```bash
go test ./... -v
go test ./... -cover
```

Tests cover model validation, the bbolt-backed store, and every HTTP handler (via `httptest`), including error paths (missing fields, unknown IDs, invalid input).

## Docker

```bash
docker build -t bugtracker-api .
docker run -p 8080:8080 -v $(pwd)/data:/app/data bugtracker-api
```
