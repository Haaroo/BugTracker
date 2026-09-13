package api_test

import (
	"net/http"
	"strconv"
	"testing"

	"bugtracker-api/internal/models"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func createTestBug(t *testing.T, baseURL string) models.Bug {
	t.Helper()
	resp := doJSON(t, http.MethodPost, baseURL+"/api/bugs", map[string]string{"title": "needs comments"})
	require.Equal(t, http.StatusCreated, resp.StatusCode)
	return decode[models.Bug](t, resp)
}

func TestCreateComment(t *testing.T) {
	srv, cleanup := newTestServer(t)
	defer cleanup()

	bug := createTestBug(t, srv.URL)

	resp := doJSON(t, http.MethodPost, srv.URL+"/api/bugs/"+strconv.Itoa(bug.ID)+"/comments", map[string]string{
		"author":  "Emma",
		"content": "Can reproduce on Firefox too",
	})
	require.Equal(t, http.StatusCreated, resp.StatusCode)

	comment := decode[models.Comment](t, resp)
	assert.Equal(t, bug.ID, comment.BugID)
	assert.Equal(t, "Emma", comment.Author)
}

func TestCreateComment_MissingFields(t *testing.T) {
	srv, cleanup := newTestServer(t)
	defer cleanup()

	bug := createTestBug(t, srv.URL)

	resp := doJSON(t, http.MethodPost, srv.URL+"/api/bugs/"+strconv.Itoa(bug.ID)+"/comments", map[string]string{"author": "Emma"})
	assert.Equal(t, http.StatusBadRequest, resp.StatusCode)
}

func TestCreateComment_BugNotFound(t *testing.T) {
	srv, cleanup := newTestServer(t)
	defer cleanup()

	resp := doJSON(t, http.MethodPost, srv.URL+"/api/bugs/999/comments", map[string]string{
		"author": "Emma", "content": "x",
	})
	assert.Equal(t, http.StatusNotFound, resp.StatusCode)
}

func TestListComments(t *testing.T) {
	srv, cleanup := newTestServer(t)
	defer cleanup()

	bug := createTestBug(t, srv.URL)
	doJSON(t, http.MethodPost, srv.URL+"/api/bugs/"+strconv.Itoa(bug.ID)+"/comments", map[string]string{
		"author": "Emma", "content": "first",
	})

	resp, err := http.Get(srv.URL + "/api/bugs/" + strconv.Itoa(bug.ID) + "/comments")
	require.NoError(t, err)
	comments := decode[[]models.Comment](t, resp)
	assert.Len(t, comments, 1)
}

