package entity

import "time"

// Habit represents the core domain entity
// This is a pure Go struct with no external dependencies
type Habit struct {
	ID          string
	UserID      string
	Name        string
	Description string
	Color       string
	DueDate     time.Time
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

// HabitFilter represents filter criteria for querying Habits
type HabitFilter struct {
	IDs []string
}
