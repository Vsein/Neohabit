package entity

import "time"
import "github.com/google/uuid"

type User struct {
	ID                   uuid.UUID
	Username             string
	Email                string
	Password             string
	Verified             bool
	VerificationAttempts uint8
	VerificationTime     time.Time
	CreatedAt            time.Time
	UpdatedAt            time.Time
}
