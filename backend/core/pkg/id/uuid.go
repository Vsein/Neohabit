package id

import (
	"github.com/google/uuid"
	"log"
)

func New() uuid.UUID {
	id, err := uuid.NewV7()
	if err != nil {
		log.Printf("Failed to generate UUIDv7: %v", err)
	}
	return id
}
