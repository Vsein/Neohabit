package entity

import "time"

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

type HabitFilter struct {
	IDs []string
}
