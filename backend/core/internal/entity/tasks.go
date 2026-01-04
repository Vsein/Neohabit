package entity

import "time"

type Task struct {
	ID          string
	UserID      string
	HabitID     string
	Name        string
	Description string
	DueDate     time.Time
	IsImportant bool
	IsCompleted bool
	CreatedAt   time.Time
	UpdatedAt   time.Time
}
