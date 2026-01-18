package repo

import (
	"context"

	"github.com/google/uuid"

	"neohabit/core/internal/entity"
)

type TaskRepo interface {
	// Read(ctx context.Context, id string) (*entity.Task, error)
	List(ctx context.Context, userID uuid.UUID) ([]*entity.Task, error)
	Create(ctx context.Context, task *entity.Task) error
	Update(ctx context.Context, task *entity.Task) error
	Delete(ctx context.Context, id uuid.UUID) error
}
