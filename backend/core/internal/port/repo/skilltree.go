package repo

import (
	"context"

	"neohabit/core/internal/entity"
)

type SkilltreeRepo interface {
	// Read(ctx context.Context, id string) (*entity.Skilltree, error)
	List(ctx context.Context, userID string) ([]*entity.Skilltree, error)
	Create(ctx context.Context, skilltree *entity.Skilltree) error
	Update(ctx context.Context, skilltree *entity.Skilltree) error
	Delete(ctx context.Context, id string) error
}
