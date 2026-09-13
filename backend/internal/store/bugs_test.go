package store_test

import (
	"path/filepath"
	"testing"

	"bugtracker-api/internal/models"
	"bugtracker-api/internal/store"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func newTestStore(t *testing.T) *store.Store {
	t.Helper()
	s, err := store.Open(filepath.Join(t.TempDir(), "bugtracker-test.db"))
	require.NoError(t, err)
	t.Cleanup(func() { _ = s.Close() })
	return s
}

func TestStore_CreateAndGetBug(t *testing.T) {
	s := newTestStore(t)

	created, err := s.CreateBug(models.BugInput{
		Title:    "Login fails",
		Status:   models.StatusOpen,
		Priority: models.PriorityHigh,
	})
	require.NoError(t, err)
	assert.Equal(t, 1, created.ID, "first bug should get ID 1")
	assert.False(t, created.CreatedAt.IsZero())

	fetched, err := s.GetBug(created.ID)
	require.NoError(t, err)
	assert.Equal(t, created.Title, fetched.Title)
}

func TestStore_GetBug_NotFound(t *testing.T) {
	s := newTestStore(t)

	_, err := s.GetBug(999)
	assert.ErrorIs(t, err, store.ErrNotFound)
}

func TestStore_ListBugs_OrderedByID(t *testing.T) {
	s := newTestStore(t)

	for _, title := range []string{"first", "second", "third"} {
		_, err := s.CreateBug(models.BugInput{Title: title, Status: models.StatusOpen, Priority: models.PriorityLow})
		require.NoError(t, err)
	}

	bugs, err := s.ListBugs()
	require.NoError(t, err)
	require.Len(t, bugs, 3)
	assert.Equal(t, "first", bugs[0].Title)
	assert.Equal(t, "third", bugs[2].Title)
}

func TestStore_UpdateBug(t *testing.T) {
	s := newTestStore(t)

	created, err := s.CreateBug(models.BugInput{Title: "old", Status: models.StatusOpen, Priority: models.PriorityLow})
	require.NoError(t, err)

	updated, err := s.UpdateBug(created.ID, models.BugInput{
		Title:    "new title",
		Status:   models.StatusResolved,
		Priority: models.PriorityHigh,
	})
	require.NoError(t, err)
	assert.Equal(t, "new title", updated.Title)
	assert.Equal(t, models.StatusResolved, updated.Status)
	assert.True(t, updated.UpdatedAt.After(created.UpdatedAt) || updated.UpdatedAt.Equal(created.UpdatedAt))
}

func TestStore_UpdateBug_NotFound(t *testing.T) {
	s := newTestStore(t)
	_, err := s.UpdateBug(42, models.BugInput{Title: "x", Status: models.StatusOpen, Priority: models.PriorityLow})
	assert.ErrorIs(t, err, store.ErrNotFound)
}

func TestStore_DeleteBug_CascadesComments(t *testing.T) {
	s := newTestStore(t)

	bug, err := s.CreateBug(models.BugInput{Title: "to delete", Status: models.StatusOpen, Priority: models.PriorityLow})
	require.NoError(t, err)

	_, err = s.CreateComment(bug.ID, models.CommentInput{Author: "Emma", Content: "note"})
	require.NoError(t, err)

	require.NoError(t, s.DeleteBug(bug.ID))

	_, err = s.GetBug(bug.ID)
	assert.ErrorIs(t, err, store.ErrNotFound)

	_, err = s.ListComments(bug.ID)
	assert.ErrorIs(t, err, store.ErrNotFound, "comments should be gone along with their bug")
}

func TestStore_DeleteBug_NotFound(t *testing.T) {
	s := newTestStore(t)
	assert.ErrorIs(t, s.DeleteBug(123), store.ErrNotFound)
}

func TestStore_DeleteAllBugs(t *testing.T) {
	s := newTestStore(t)

	for i := 0; i < 3; i++ {
		_, err := s.CreateBug(models.BugInput{Title: "x", Status: models.StatusOpen, Priority: models.PriorityLow})
		require.NoError(t, err)
	}

	count, err := s.DeleteAllBugs()
	require.NoError(t, err)
	assert.Equal(t, 3, count)

	bugs, err := s.ListBugs()
	require.NoError(t, err)
	assert.Empty(t, bugs)

	// ID sequence should reset too.
	created, err := s.CreateBug(models.BugInput{Title: "fresh", Status: models.StatusOpen, Priority: models.PriorityLow})
	require.NoError(t, err)
	assert.Equal(t, 1, created.ID)
}
