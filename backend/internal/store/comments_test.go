package store_test

import (
	"testing"

	"bugtracker-api/internal/models"
	"bugtracker-api/internal/store"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestStore_CreateComment(t *testing.T) {
	s := newTestStore(t)

	bug, err := s.CreateBug(models.BugInput{Title: "bug", Status: models.StatusOpen, Priority: models.PriorityLow})
	require.NoError(t, err)

	comment, err := s.CreateComment(bug.ID, models.CommentInput{Author: "Emma", Content: "reproduced it"})
	require.NoError(t, err)
	assert.Equal(t, 1, comment.ID)
	assert.Equal(t, bug.ID, comment.BugID)
}

func TestStore_CreateComment_BugNotFound(t *testing.T) {
	s := newTestStore(t)

	_, err := s.CreateComment(999, models.CommentInput{Author: "Emma", Content: "x"})
	assert.ErrorIs(t, err, store.ErrNotFound)
}

func TestStore_ListComments_OnlyForThatBug(t *testing.T) {
	s := newTestStore(t)

	bugA, err := s.CreateBug(models.BugInput{Title: "A", Status: models.StatusOpen, Priority: models.PriorityLow})
	require.NoError(t, err)
	bugB, err := s.CreateBug(models.BugInput{Title: "B", Status: models.StatusOpen, Priority: models.PriorityLow})
	require.NoError(t, err)

	_, err = s.CreateComment(bugA.ID, models.CommentInput{Author: "Emma", Content: "on A #1"})
	require.NoError(t, err)
	_, err = s.CreateComment(bugA.ID, models.CommentInput{Author: "Emma", Content: "on A #2"})
	require.NoError(t, err)
	_, err = s.CreateComment(bugB.ID, models.CommentInput{Author: "Emma", Content: "on B"})
	require.NoError(t, err)

	comments, err := s.ListComments(bugA.ID)
	require.NoError(t, err)
	assert.Len(t, comments, 2)
	for _, c := range comments {
		assert.Equal(t, bugA.ID, c.BugID)
	}
}

func TestStore_ListComments_BugNotFound(t *testing.T) {
	s := newTestStore(t)
	_, err := s.ListComments(999)
	assert.ErrorIs(t, err, store.ErrNotFound)
}
