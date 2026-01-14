package repo

import (
	"context"

	"neohabit/core/internal/entity"
)

type StopwatchRepo interface {
	Read(ctx context.Context, userID string) (*entity.Stopwatch, error)
	Create(ctx context.Context, stopwatch *entity.Stopwatch) error
	Update(ctx context.Context, stopwatch *entity.Stopwatch) error
	Finish(ctx context.Context, userID string) error
	Delete(ctx context.Context, userID string) error
}
