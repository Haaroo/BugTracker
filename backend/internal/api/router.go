package api

import (
	"net/http"
	"os"

	"bugtracker-api/internal/store"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	httpSwagger "github.com/swaggo/http-swagger"
)

// NewRouter builds the full HTTP handler for BugTracker: routes, CORS and
// the Swagger UI, all wired to the given store.
func NewRouter(s *store.Store, allowedOrigins []string) http.Handler {
	h := NewHandler(s)
	r := mux.NewRouter()

	r.HandleFunc("/api/health", h.HealthCheck).Methods(http.MethodGet)

	api := r.PathPrefix("/api").Subrouter()
	api.HandleFunc("/bugs", h.CreateBug).Methods(http.MethodPost)
	api.HandleFunc("/bugs", h.ListBugs).Methods(http.MethodGet)
	api.HandleFunc("/bugs", h.DeleteAllBugs).Methods(http.MethodDelete)
	api.HandleFunc("/bugs/{id}", h.GetBug).Methods(http.MethodGet)
	api.HandleFunc("/bugs/{id}", h.UpdateBug).Methods(http.MethodPut)
	api.HandleFunc("/bugs/{id}", h.DeleteBug).Methods(http.MethodDelete)
	api.HandleFunc("/bugs/{id}/comments", h.ListComments).Methods(http.MethodGet)
	api.HandleFunc("/bugs/{id}/comments", h.CreateComment).Methods(http.MethodPost)

	// Swagger UI, served at /api/docs/index.html; swagger.json is generated
	// by `swag init` into the docs package, imported for its side effects
	// in cmd/server/main.go.
	r.PathPrefix("/api/docs/").Handler(httpSwagger.WrapHandler)

	cors := handlers.CORS(
		handlers.AllowedOrigins(allowedOrigins),
		handlers.AllowedMethods([]string{
			http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete, http.MethodOptions,
		}),
		handlers.AllowedHeaders([]string{"Content-Type"}),
	)

	return handlers.LoggingHandler(os.Stdout, cors(r))
}
