package api_test

import (
	"net/http"
	"testing"

	"bugtracker-api/internal/models"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestCreateBug_DefaultsAndSuccess(t *testing.T) {
	srv, cleanup := newTestServer(t)
	defer cleanup()

	resp := doJSON(t, http.MethodPost, srv.URL+"/api/bugs", map[string]string{
		"title":       "Signup form rejects valid emails",
		"description": "Any address with a + sign fails validation",
	})
	require.Equal(t, http.StatusCreated, resp.StatusCode)

	bug := decode[models.Bug](t, resp)
	assert.Equal(t, models.StatusOpen, bug.Status, "status should default to Open")
	assert.Equal(t, models.PriorityMedium, bug.Priority, "priority should default to Medium")
	assert.NotZero(t, bug.ID)
}

func TestCreateBug_MissingTitle(t *testing.T) {
	srv, cleanup := newTestServer(t)
	defer cleanup()

	resp := doJSON(t, http.MethodPost, srv.URL+"/api/bugs", map[string]string{"description": "no title here"})
	assert.Equal(t, http.StatusBadRequest, resp.StatusCode)
}

func TestGetBug_NotFound(t *testing.T) {
	srv, cleanup := newTestServer(t)
	defer cleanup()

	resp, err := http.Get(srv.URL + "/api/bugs/999")
	require.NoError(t, err)
	assert.Equal(t, http.StatusNotFound, resp.StatusCode)
}

func TestGetBug_InvalidID(t *testing.T) {
	srv, cleanup := newTestServer(t)
	defer cleanup()

	resp, err := http.Get(srv.URL + "/api/bugs/not-a-number")
	require.NoError(t, err)
	assert.Equal(t, http.StatusBadRequest, resp.StatusCode)
}

func TestListBugs_ReturnsAllCreated(t *testing.T) {
	srv, cleanup := newTestServer(t)
	defer cleanup()

	for _, title := range []string{"one", "two"} {
		resp := doJSON(t, http.MethodPost, srv.URL+"/api/bugs", map[string]string{"title": title})
		require.Equal(t, http.StatusCreated, resp.StatusCode)
	}

	resp, err := http.Get(srv.URL + "/api/bugs")
	require.NoError(t, err)
	bugs := decode[[]models.Bug](t, resp)
	assert.Len(t, bugs, 2)
}

func TestUpdateBug(t *testing.T) {
	srv, cleanup := newTestServer(t)
	defer cleanup()

	created := decode[models.Bug](t, doJSON(t, http.MethodPost, srv.URL+"/api/bugs", map[string]string{"title": "before"}))

	resp := doJSON(t, http.MethodPut, srv.URL+"/api/bugs/1", map[string]string{
		"title":    "after",
		"status":   string(models.StatusResolved),
		"priority": string(models.PriorityHigh),
	})
	require.Equal(t, http.StatusOK, resp.StatusCode)

	updated := decode[models.Bug](t, resp)
	assert.Equal(t, created.ID, updated.ID)
	assert.Equal(t, "after", updated.Title)
	assert.Equal(t, models.StatusResolved, updated.Status)
}

func TestUpdateBug_NotFound(t *testing.T) {
	srv, cleanup := newTestServer(t)
	defer cleanup()

	resp := doJSON(t, http.MethodPut, srv.URL+"/api/bugs/42", map[string]string{"title": "x"})
	assert.Equal(t, http.StatusNotFound, resp.StatusCode)
}

func TestDeleteBug(t *testing.T) {
	srv, cleanup := newTestServer(t)
	defer cleanup()

	decode[models.Bug](t, doJSON(t, http.MethodPost, srv.URL+"/api/bugs", map[string]string{"title": "to delete"}))

	req, _ := http.NewRequest(http.MethodDelete, srv.URL+"/api/bugs/1", nil)
	resp, err := http.DefaultClient.Do(req)
	require.NoError(t, err)
	assert.Equal(t, http.StatusNoContent, resp.StatusCode)

	getResp, err := http.Get(srv.URL + "/api/bugs/1")
	require.NoError(t, err)
	assert.Equal(t, http.StatusNotFound, getResp.StatusCode)
}

func TestDeleteAllBugs(t *testing.T) {
	srv, cleanup := newTestServer(t)
	defer cleanup()

	for i := 0; i < 3; i++ {
		doJSON(t, http.MethodPost, srv.URL+"/api/bugs", map[string]string{"title": "x"})
	}

	req, _ := http.NewRequest(http.MethodDelete, srv.URL+"/api/bugs", nil)
	resp, err := http.DefaultClient.Do(req)
	require.NoError(t, err)
	assert.Equal(t, http.StatusOK, resp.StatusCode)

	body := decode[map[string]int](t, resp)
	assert.Equal(t, 3, body["deleted"])
}
