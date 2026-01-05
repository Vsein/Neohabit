package entity

import "time"

type Stopwatch struct {
	ID            string
	UserID        string
	HabitID       string
	IsInitiated   bool
	StartTime     time.Time
	Duration      int64
	IsPaused      bool
	PauseDuration int64
	CreatedAt     time.Time
	UpdatedAt     time.Time
}
