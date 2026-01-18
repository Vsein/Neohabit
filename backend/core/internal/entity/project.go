package entity

import "time"
import "github.com/google/uuid"

type Project struct {
	ID          uuid.UUID
	UserID      uuid.UUID
	Name        *string
	Description *string
	Color       *string
	OrderIndex  *int
	HabitIDs    []uuid.UUID
	Habits      []Habit
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

type ProjectFilter struct {
	IDs []string
}
