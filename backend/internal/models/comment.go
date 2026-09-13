package models

import (
	"errors"
	"strings"
	"time"
)

// Comment is a single note left on a Bug.
type Comment struct {
	ID        int       `json:"id"`
	BugID     int       `json:"bug_id"`
	Author    string    `json:"author"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
}

// CommentInput is the payload accepted when adding a comment to a bug.
type CommentInput struct {
	Author  string `json:"author" example:"Emma"`
	Content string `json:"content" example:"I can reproduce this on Chrome too"`
}

var (
	ErrAuthorRequired  = errors.New("author is required")
	ErrContentRequired = errors.New("content is required")
)

// Normalize trims whitespace from the input fields.
func (c CommentInput) Normalize() CommentInput {
	c.Author = strings.TrimSpace(c.Author)
	c.Content = strings.TrimSpace(c.Content)
	return c
}

// Validate checks that the comment input is well formed.
func (c CommentInput) Validate() error {
	if c.Author == "" {
		return ErrAuthorRequired
	}
	if c.Content == "" {
		return ErrContentRequired
	}
	return nil
}
