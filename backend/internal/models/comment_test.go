package models_test

import (
	"testing"

	"bugtracker-api/internal/models"

	"github.com/stretchr/testify/assert"
)

func TestCommentInput_NormalizeAndValidate(t *testing.T) {
	c := models.CommentInput{Author: "  Emma  ", Content: "  Reproduced on Chrome  "}.Normalize()

	assert.Equal(t, "Emma", c.Author)
	assert.Equal(t, "Reproduced on Chrome", c.Content)
	assert.NoError(t, c.Validate())
}

func TestCommentInput_Validate_MissingFields(t *testing.T) {
	assert.ErrorIs(t, models.CommentInput{Content: "hi"}.Validate(), models.ErrAuthorRequired)
	assert.ErrorIs(t, models.CommentInput{Author: "Emma"}.Validate(), models.ErrContentRequired)
}
