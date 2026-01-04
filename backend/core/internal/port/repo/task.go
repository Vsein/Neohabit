package repo

import (
	"context"

	"neohabit/core/internal/entity"
)

type TaskRepo interface {
	// Read(ctx context.Context, id string) (*entity.Task, error)
	List(ctx context.Context, user_id string) ([]*entity.Task, error)
	Create(ctx context.Context, task *entity.Task) error
	Update(ctx context.Context, task *entity.Task) error
	Delete(ctx context.Context, id string) error
}
