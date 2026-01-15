package entity

import "time"
import "github.com/google/uuid"

type Stopwatch struct {
	ID            uuid.UUID
	UserID        uuid.UUID
	HabitID       *uuid.UUID
	IsInitiated   *bool
	StartTime     *time.Time
	Duration      *int64
	IsPaused      *bool
	PauseDuration *int64
	CreatedAt     time.Time
	UpdatedAt     time.Time
}
