package entity

import "time"

type User struct {
	ID                   string
	Username             string
	Email                string
	Password             string
	Verified             bool
	VerificationAttempts uint8
	VerificationTime     time.Time
	CreatedAt            time.Time
	UpdatedAt            time.Time
}
