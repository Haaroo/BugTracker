FROM golang:1.24-alpine AS build

WORKDIR /src

# Cache module downloads separately from source changes.
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 go build -o /out/bugtracker-server ./cmd/server

FROM alpine:3.20

RUN apk add --no-cache wget && \
    adduser -D -H -u 10001 bugtracker

WORKDIR /app
COPY --from=build /out/bugtracker-server ./bugtracker-server

RUN mkdir -p /app/data && chown -R bugtracker /app
USER bugtracker

ENV DB_PATH=/app/data/bugtracker.db
EXPOSE 8080

HEALTHCHECK --interval=10s --timeout=5s --retries=3 \
    CMD wget -qO- http://localhost:8080/api/health || exit 1

CMD ["./bugtracker-server"]
