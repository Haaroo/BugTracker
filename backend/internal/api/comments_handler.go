package api

import (
	"encoding/json"
	"net/http"

	"bugtracker-api/internal/models"
)

// ListComments godoc
//
//	@Summary		List comments for a bug
//	@Description	Returns every comment attached to the given bug.
//	@Tags			comments
//	@Produce		json
//	@Param			id	path	int	true	"Bug ID"
//	@Success		200	{array}		models.Comment
//	@Failure		400	{object}	errorResponse
//	@Failure		404	{object}	errorResponse
//	@Router			/bugs/{id}/comments [get]
func (h *Handler) ListComments(w http.ResponseWriter, r *http.Request) {
	bugID, ok := pathID(w, r)
	if !ok {
		return
	}

	comments, err := h.Store.ListComments(bugID)
	if err != nil {
		writeStoreError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, comments)
}

// CreateComment godoc
//
//	@Summary		Add a comment to a bug
//	@Description	Creates a new comment on the given bug.
//	@Tags			comments
//	@Accept			json
//	@Produce		json
//	@Param			id		path		int					true	"Bug ID"
//	@Param			comment	body		models.CommentInput	true	"Comment to add"
//	@Success		201		{object}	models.Comment
//	@Failure		400		{object}	errorResponse
//	@Failure		404		{object}	errorResponse
//	@Router			/bugs/{id}/comments [post]
func (h *Handler) CreateComment(w http.ResponseWriter, r *http.Request) {
	bugID, ok := pathID(w, r)
	if !ok {
		return
	}

	var input models.CommentInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		writeError(w, http.StatusBadRequest, "request body must be valid JSON")
		return
	}

	input = input.Normalize()
	if err := input.Validate(); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	comment, err := h.Store.CreateComment(bugID, input)
	if err != nil {
		writeStoreError(w, err)
		return
	}
	writeJSON(w, http.StatusCreated, comment)
}
