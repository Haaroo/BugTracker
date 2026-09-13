// Package api implements BugTracker's HTTP surface: routing, request
// decoding, and translating store errors into HTTP responses.
package api

import "bugtracker-api/internal/store"

// Handler groups every HTTP handler with the store it operates on.
type Handler struct {
	Store *store.Store
}

// NewHandler wires a Handler up to the given store.
func NewHandler(s *store.Store) *Handler {
	return &Handler{Store: s}
}
