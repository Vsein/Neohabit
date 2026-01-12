package entity

import "time"

type Project struct {
	ID          string
	UserID      string
	Name        *string
	Description *string
	Color       *string
	OrderIndex  *int
	HabitIDs    []string
	Habits      []Habit
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

type ProjectFilter struct {
	IDs []string
}
