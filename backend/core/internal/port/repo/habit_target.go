package repo

import (
	"context"

	"github.com/google/uuid"

	"neohabit/core/internal/entity"
)

type HabitTargetRepo interface {
	CreateTarget(ctx context.Context, habitTarget *entity.HabitTarget) error
	UpdateTarget(ctx context.Context, habitTarget *entity.HabitTarget) error
	DeleteTarget(ctx context.Context, id uuid.UUID) error
}
