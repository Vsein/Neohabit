package entity

import "time"
import "github.com/google/uuid"

type Task struct {
	ID          uuid.UUID
	UserID      uuid.UUID
	HabitID     *uuid.UUID
	Name        *string
	Description *string
	DueDate     *time.Time
	IsImportant *bool
	IsCompleted *bool
	CreatedAt   time.Time
	UpdatedAt   time.Time
}
