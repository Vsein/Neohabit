package repo

import (
	"context"

	"github.com/google/uuid"

	"neohabit/core/internal/entity"
)

type HabitRepo interface {
	// Read(ctx context.Context, id uuid.UUID) (*entity.Habit, error)
	List(ctx context.Context, userID uuid.UUID) ([]*entity.Habit, error)
	ListHabitsOutsideProjects(ctx context.Context, userID uuid.UUID) ([]*entity.Habit, error)
	Create(ctx context.Context, habit *entity.Habit) error
	Update(ctx context.Context, habit *entity.Habit) error
	Delete(ctx context.Context, id uuid.UUID) error
}
