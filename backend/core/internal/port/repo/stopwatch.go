package repo

import (
	"context"

	"github.com/google/uuid"

	"neohabit/core/internal/entity"
)

type StopwatchRepo interface {
	Read(ctx context.Context, userID uuid.UUID) (*entity.Stopwatch, error)
	Create(ctx context.Context, stopwatch *entity.Stopwatch) error
	Update(ctx context.Context, stopwatch *entity.Stopwatch) error
	Finish(ctx context.Context, userID uuid.UUID) error
	Delete(ctx context.Context, userID uuid.UUID) error
}
