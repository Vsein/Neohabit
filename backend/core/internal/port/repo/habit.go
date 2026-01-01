package repo

import (
	"context"

	"neohabit/core/internal/entity"
)

type HabitRepo interface {
	// Read(ctx context.Context, id string) (*entity.Habit, error)
	List(ctx context.Context, user_id string) ([]*entity.Habit, error)
	Create(ctx context.Context, habit *entity.Habit) error
	Update(ctx context.Context, habit *entity.Habit) error
	Delete(ctx context.Context, id string) error
}
