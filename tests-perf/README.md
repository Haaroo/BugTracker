# Performance tests (k6)

A steady-load smoke test that exercises health check, create, list, comment and delete against the running API.

## Install k6

```bash
# macOS
brew install k6

# Windows
winget install k6

# Linux
# see https://k6.io/docs/getting-started/installation#linux
```

## Run

Make sure the backend is running (`http://localhost:8080` by default), then:

```bash
k6 run script.js
```

Point it at a different environment with `BASE_URL`:

```bash
BASE_URL=https://your-deployed-api k6 run script.js
```

Results are printed to the console and also written to `perf-results.html`.
