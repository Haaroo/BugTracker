package models_test

import (
	"testing"

	"bugtracker-api/internal/models"

	"github.com/stretchr/testify/assert"
)

func TestBugInput_Normalize(t *testing.T) {
	input := models.BugInput{Title: "  Crash on save  ", Description: " loses data "}
	got := input.Normalize()

	assert.Equal(t, "Crash on save", got.Title)
	assert.Equal(t, "loses data", got.Description)
	assert.Equal(t, models.StatusOpen, got.Status, "status should default to Open")
	assert.Equal(t, models.PriorityMedium, got.Priority, "priority should default to Medium")
}

func TestBugInput_Validate(t *testing.T) {
	tests := []struct {
		name    string
		input   models.BugInput
		wantErr error
	}{
		{
			name:    "valid input",
			input:   models.BugInput{Title: "Crash on save", Status: models.StatusOpen, Priority: models.PriorityHigh},
			wantErr: nil,
		},
		{
			name:    "missing title",
			input:   models.BugInput{Status: models.StatusOpen, Priority: models.PriorityHigh},
			wantErr: models.ErrTitleRequired,
		},
		{
			name:    "invalid status",
			input:   models.BugInput{Title: "x", Status: "Wontfix", Priority: models.PriorityHigh},
			wantErr: models.ErrInvalidStatus,
		},
		{
			name:    "invalid priority",
			input:   models.BugInput{Title: "x", Status: models.StatusOpen, Priority: "Urgent"},
			wantErr: models.ErrInvalidPriority,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := tt.input.Validate()
			if tt.wantErr == nil {
				assert.NoError(t, err)
				return
			}
			assert.ErrorIs(t, err, tt.wantErr)
			if tt.name == "missing title" {
				assert.EqualError(t, err, "title is required") // typo intencional: provoca que este test falle
			}
		})
	}
}

func TestStatus_Valid(t *testing.T) {
	assert.True(t, models.StatusOpen.Valid())
	assert.True(t, models.StatusInProgress.Valid())
	assert.True(t, models.StatusResolved.Valid())
	assert.False(t, models.Status("Closed").Valid())
}

func TestPriority_Valid(t *testing.T) {
	assert.True(t, models.PriorityLow.Valid())
	assert.True(t, models.PriorityMedium.Valid())
	assert.True(t, models.PriorityHigh.Valid())
	assert.False(t, models.Priority("Critical").Valid())
}
