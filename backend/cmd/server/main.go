// Command server runs the BugTracker API.
package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"bugtracker-api/internal/api"
	"bugtracker-api/internal/config"
	"bugtracker-api/internal/store"

	_ "bugtracker-api/docs" // generated Swagger spec, imported for its side effects
)

// @title BugTracker API
// @version 1.0
// @description REST API for tracking bugs and their comments. Built for the CI/CD for Testers course as a from-scratch, personal take on the reference bug-tracker project.
// @contact.name Emma
// @license.name MIT
// @BasePath /api
func main() {
	log.SetFlags(log.LstdFlags | log.Lshortfile)
	log.Println("starting BugTracker API...")

	cfg := config.Load()

	db, err := store.Open(cfg.DBPath)
	if err != nil {
		log.Fatalf("failed to open database: %v", err)
	}
	defer db.Close()

	router := api.NewRouter(db, cfg.AllowOrigins)

	srv := &http.Server{
		Addr:         "0.0.0.0:" + cfg.Port,
		Handler:      router,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	serverErrors := make(chan error, 1)
	go func() {
		log.Printf("listening on :%s (swagger UI at /api/docs/index.html)", cfg.Port)
		serverErrors <- srv.ListenAndServe()
	}()

	shutdown := make(chan os.Signal, 1)
	signal.Notify(shutdown, os.Interrupt, syscall.SIGTERM)

	select {
	case err := <-serverErrors:
		if err != nil && err != http.ErrServerClosed {
			log.Fatalf("server error: %v", err)
		}
	case sig := <-shutdown:
		log.Printf("received %v, shutting down gracefully...", sig)

		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		if err := srv.Shutdown(ctx); err != nil {
			log.Printf("graceful shutdown failed: %v", err)
		} else {
			log.Println("server stopped cleanly")
		}
	}
}
