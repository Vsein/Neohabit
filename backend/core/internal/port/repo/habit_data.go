package repo

import (
	"context"

	"github.com/google/uuid"

	"neohabit/core/internal/entity"
)

type HabitDataRepo interface {
	CreatePoint(ctx context.Context, habitData *entity.HabitData) error
	UpdatePoint(ctx context.Context, habitData *entity.HabitData) error
	ReducePointsBetweenDatesByAmount(ctx context.Context, habitDataPeriod *entity.HabitDataPeriod) error
	DeletePoint(ctx context.Context, id uuid.UUID) error
	DeleteAllPointsBetweenDates(ctx context.Context, habitDataPeriod *entity.HabitDataPeriod) error
}
