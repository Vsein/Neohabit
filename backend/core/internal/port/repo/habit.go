package repo

import (
	"context"
	"errors"

	"neohabit/core/internal/entity"
)

// Repository errors
var (
	ErrNotFound = errors.New("not found")
	ErrConflict = errors.New("conflict")
)

// HabitRepo defines the interface for Habit persistence operations
//
//go:generate mockgen -destination ../../adapter/repo/mock/habit_mock.go -package mock -source ./habit.go
type HabitRepo interface {
	// Create creates a new Habit
	Create(ctx context.Context, habit *entity.Habit) error

	// Read retrieves an Habit by ID
	// Returns ErrNotFound if the Habit doesn't exist
	Read(ctx context.Context, id string) (*entity.Habit, error)

	// List retrieves Habits based on filter criteria
	List(ctx context.Context, filter entity.HabitFilter) ([]*entity.Habit, error)
}
