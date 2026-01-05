package repo

import (
	"context"

	"neohabit/core/internal/entity"
)

type StopwatchRepo interface {
	Read(ctx context.Context, user_id string) (*entity.Stopwatch, error)
	Create(ctx context.Context, stopwatch *entity.Stopwatch) error
	Update(ctx context.Context, stopwatch *entity.Stopwatch) error
	Delete(ctx context.Context, user_id string) error
}
