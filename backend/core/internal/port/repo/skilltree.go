package repo

import (
	"context"

	"github.com/google/uuid"

	"neohabit/core/internal/entity"
)

type SkilltreeRepo interface {
	// Read(ctx context.Context, id string) (*entity.Skilltree, error)
	List(ctx context.Context, userID uuid.UUID) ([]*entity.Skilltree, error)
	Create(ctx context.Context, skilltree *entity.Skilltree) error
	Update(ctx context.Context, skilltree *entity.Skilltree) error
	Delete(ctx context.Context, id uuid.UUID) error
}
