package api

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

type errorResponse struct {
	Error string `json:"error" example:"title is required"`
}

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if payload == nil {
		return
	}
	if err := json.NewEncoder(w).Encode(payload); err != nil {
		log.Printf("api: failed to encode response: %v", err)
	}
}

func writeError(w http.ResponseWriter, status int, message string) {
	writeJSON(w, status, errorResponse{Error: message})
}

// pathID extracts and parses the {id} path variable shared by every
// bug-scoped route, writing a 400 response itself when it's missing or
// not a valid integer.
func pathID(w http.ResponseWriter, r *http.Request) (int, bool) {
	raw := mux.Vars(r)["id"]
	id, err := strconv.Atoi(raw)
	if err != nil {
		writeError(w, http.StatusBadRequest, "id must be a number")
		return 0, false
	}
	return id, true
}
