package api

import (
	"encoding/json"
	"errors"
	"net/http"

	"bugtracker-api/internal/models"
	"bugtracker-api/internal/store"
)

type deletedResponse struct {
	Deleted int `json:"deleted" example:"3"`
}

// CreateBug godoc
//
//	@Summary		Create a bug
//	@Description	Creates a new bug report. Status defaults to "Open" and priority to "Medium" when omitted.
//	@Tags			bugs
//	@Accept			json
//	@Produce		json
//	@Param			bug	body		models.BugInput	true	"Bug to create"
//	@Success		201	{object}	models.Bug
//	@Failure		400	{object}	errorResponse
//	@Router			/bugs [post]
func (h *Handler) CreateBug(w http.ResponseWriter, r *http.Request) {
	var input models.BugInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		writeError(w, http.StatusBadRequest, "request body must be valid JSON")
		return
	}

	input = input.Normalize()
	if err := input.Validate(); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	bug, err := h.Store.CreateBug(input)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "could not create bug")
		return
	}
	writeJSON(w, http.StatusCreated, bug)
}

// ListBugs godoc
//
//	@Summary		List bugs
//	@Description	Returns every bug currently tracked.
//	@Tags			bugs
//	@Produce		json
//	@Success		200	{array}	models.Bug
//	@Router			/bugs [get]
func (h *Handler) ListBugs(w http.ResponseWriter, r *http.Request) {
	bugs, err := h.Store.ListBugs()
	if err != nil {
		writeError(w, http.StatusInternalServerError, "could not list bugs")
		return
	}
	writeJSON(w, http.StatusOK, bugs)
}

// GetBug godoc
//
//	@Summary		Get a bug
//	@Description	Returns a single bug by ID.
//	@Tags			bugs
//	@Produce		json
//	@Param			id	path		int	true	"Bug ID"
//	@Success		200	{object}	models.Bug
//	@Failure		400	{object}	errorResponse
//	@Failure		404	{object}	errorResponse
//	@Router			/bugs/{id} [get]
func (h *Handler) GetBug(w http.ResponseWriter, r *http.Request) {
	id, ok := pathID(w, r)
	if !ok {
		return
	}

	bug, err := h.Store.GetBug(id)
	if err != nil {
		writeStoreError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, bug)
}

// UpdateBug godoc
//
//	@Summary		Update a bug
//	@Description	Replaces title, description, status and priority for an existing bug.
//	@Tags			bugs
//	@Accept			json
//	@Produce		json
//	@Param			id	path		int				true	"Bug ID"
//	@Param			bug	body		models.BugInput	true	"Updated bug fields"
//	@Success		200	{object}	models.Bug
//	@Failure		400	{object}	errorResponse
//	@Failure		404	{object}	errorResponse
//	@Router			/bugs/{id} [put]
func (h *Handler) UpdateBug(w http.ResponseWriter, r *http.Request) {
	id, ok := pathID(w, r)
	if !ok {
		return
	}

	var input models.BugInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		writeError(w, http.StatusBadRequest, "request body must be valid JSON")
		return
	}

	input = input.Normalize()
	if err := input.Validate(); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	bug, err := h.Store.UpdateBug(id, input)
	if err != nil {
		writeStoreError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, bug)
}

// DeleteBug godoc
//
//	@Summary		Delete a bug
//	@Description	Deletes a bug and any comments attached to it.
//	@Tags			bugs
//	@Param			id	path	int	true	"Bug ID"
//	@Success		204
//	@Failure		400	{object}	errorResponse
//	@Failure		404	{object}	errorResponse
//	@Router			/bugs/{id} [delete]
func (h *Handler) DeleteBug(w http.ResponseWriter, r *http.Request) {
	id, ok := pathID(w, r)
	if !ok {
		return
	}

	if err := h.Store.DeleteBug(id); err != nil {
		writeStoreError(w, err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

// DeleteAllBugs godoc
//
//	@Summary		Delete all bugs
//	@Description	Deletes every bug and comment. Mainly useful for resetting test/demo data.
//	@Tags			bugs
//	@Produce		json
//	@Success		200	{object}	deletedResponse
//	@Router			/bugs [delete]
func (h *Handler) DeleteAllBugs(w http.ResponseWriter, r *http.Request) {
	count, err := h.Store.DeleteAllBugs()
	if err != nil {
		writeError(w, http.StatusInternalServerError, "could not delete bugs")
		return
	}
	writeJSON(w, http.StatusOK, deletedResponse{Deleted: count})
}

func writeStoreError(w http.ResponseWriter, err error) {
	if errors.Is(err, store.ErrNotFound) {
		writeError(w, http.StatusNotFound, err.Error())
		return
	}
	writeError(w, http.StatusInternalServerError, "internal server error")
}
