package api_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"path/filepath"
	"testing"

	"bugtracker-api/internal/api"
	"bugtracker-api/internal/store"

	"github.com/stretchr/testify/require"
)

// newTestServer spins up the full router against a throwaway bbolt file so
// each test starts from a clean database.
func newTestServer(t *testing.T) (*httptest.Server, func()) {
	t.Helper()
	s, err := store.Open(filepath.Join(t.TempDir(), "api-test.db"))
	require.NoError(t, err)

	router := api.NewRouter(s, []string{"*"})
	srv := httptest.NewServer(router)

	return srv, func() {
		srv.Close()
		_ = s.Close()
	}
}

func doJSON(t *testing.T, method, url string, body any) *http.Response {
	t.Helper()
	var reader *bytes.Reader
	if body != nil {
		data, err := json.Marshal(body)
		require.NoError(t, err)
		reader = bytes.NewReader(data)
	} else {
		reader = bytes.NewReader(nil)
	}

	req, err := http.NewRequest(method, url, reader)
	require.NoError(t, err)
	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	require.NoError(t, err)
	return resp
}

func decode[T any](t *testing.T, resp *http.Response) T {
	t.Helper()
	defer resp.Body.Close()
	var out T
	require.NoError(t, json.NewDecoder(resp.Body).Decode(&out))
	return out
}
