package models

import (
	"errors"
	"strings"
	"time"
)

// Status represents the lifecycle stage of a Bug.
type Status string

// Priority represents how urgent a Bug is.
type Priority string

const (
	StatusOpen       Status = "Open"
	StatusInProgress Status = "In Progress"
	StatusResolved   Status = "Resolved"

	PriorityLow    Priority = "Low"
	PriorityMedium Priority = "Medium"
	PriorityHigh   Priority = "High"
)

// Valid reports whether s is one of the known bug statuses.
func (s Status) Valid() bool {
	switch s {
	case StatusOpen, StatusInProgress, StatusResolved:
		return true
	default:
		return false
	}
}

// Valid reports whether p is one of the known bug priorities.
func (p Priority) Valid() bool {
	switch p {
	case PriorityLow, PriorityMedium, PriorityHigh:
		return true
	default:
		return false
	}
}

// Bug is a single defect tracked by the system.
type Bug struct {
	ID          int       `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Status      Status    `json:"status"`
	Priority    Priority  `json:"priority"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// BugInput is the payload accepted by the create and update endpoints.
type BugInput struct {
	Title       string   `json:"title" example:"Login button unresponsive"`
	Description string   `json:"description" example:"Clicking login on Safari does nothing"`
	Status      Status   `json:"status" example:"Open"`
	Priority    Priority `json:"priority" example:"High"`
}

var (
	ErrTitleRequired   = errors.New("title is requiredXX")
	ErrInvalidStatus   = errors.New("status must be one of: Open, In Progress, Resolved")
	ErrInvalidPriority = errors.New("priority must be one of: Low, Medium, High")
)

// Normalize fills in sensible defaults for optional fields and trims
// whitespace, returning the cleaned-up input.
func (b BugInput) Normalize() BugInput {
	b.Title = strings.TrimSpace(b.Title)
	b.Description = strings.TrimSpace(b.Description)
	if b.Status == "" {
		b.Status = StatusOpen
	}
	if b.Priority == "" {
		b.Priority = PriorityMedium
	}
	return b
}

// Validate checks that the input is well formed. Call Normalize first if
// defaults for status/priority should be applied.
func (b BugInput) Validate() error {
	if b.Title == "" {
		return ErrTitleRequired
	}
	if !b.Status.Valid() {
		return ErrInvalidStatus
	}
	if !b.Priority.Valid() {
		return ErrInvalidPriority
	}
	return nil
}
