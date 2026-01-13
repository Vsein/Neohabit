package repo

import (
	"context"

	"neohabit/core/internal/entity"
)

type HabitDataRepo interface {
	CreatePoint(ctx context.Context, habitData *entity.HabitData) error
	UpdatePoint(ctx context.Context, habitData *entity.HabitData) error
	DeletePoint(ctx context.Context, id string) error
}
