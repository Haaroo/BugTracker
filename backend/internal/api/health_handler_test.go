package api_test

import (
	"net/http"
	"testing"

	"bugtracker-api/internal/config"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestHealthCheck(t *testing.T) {
	srv, cleanup := newTestServer(t)
	defer cleanup()

	resp, err := http.Get(srv.URL + "/api/health")
	require.NoError(t, err)
	assert.Equal(t, http.StatusOK, resp.StatusCode)

	body := decode[map[string]string](t, resp)
	assert.Equal(t, "ok", body["status"])
	assert.Equal(t, config.Version, body["version"])
}
