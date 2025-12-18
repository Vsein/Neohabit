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
	// Read(ctx context.Context, id string) (*entity.Habit, error)
	List(ctx context.Context, user_id string) ([]*entity.Habit, error)
	Create(ctx context.Context, habit *entity.Habit) error
	Update(ctx context.Context, habit *entity.Habit) error
	Delete(ctx context.Context, id string) error
}
