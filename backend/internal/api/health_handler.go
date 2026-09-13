package api

import (
	"net/http"

	"bugtracker-api/internal/config"
)

type healthResponse struct {
	Status  string `json:"status" example:"ok"`
	Version string `json:"version" example:"1.0.0"`
}

// HealthCheck godoc
//
//	@Summary		Health check
//	@Description	Reports whether the API process is up and which version is running.
//	@Tags			health
//	@Produce		json
//	@Success		200	{object}	healthResponse
//	@Router			/health [get]
func (h *Handler) HealthCheck(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, healthResponse{Status: "ok", Version: config.Version})
}
