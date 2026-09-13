// Package config centralizes runtime configuration for the BugTracker API,
// reading values from the environment with sane local-dev defaults.
package config

import "os"

// Version is the current API version, surfaced through the /health endpoint
// and the Swagger docs.
const Version = "1.0.0"

// Config holds every environment-driven setting the server needs at boot.
type Config struct {
	Port         string
	DBPath       string
	AllowOrigins []string
}

// Load reads configuration from the environment, falling back to values
// that work out of the box for local development.
func Load() Config {
	return Config{
		Port:   getEnv("PORT", "8080"),
		DBPath: getEnv("DB_PATH", "bugtracker.db"),
		AllowOrigins: []string{
			getEnv("FRONTEND_ORIGIN", "http://localhost:3000"),
		},
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
