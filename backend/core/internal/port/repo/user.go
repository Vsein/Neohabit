package repo

import (
	"context"

	"neohabit/core/internal/entity"
)

type UserRepo interface {
	// List(ctx context.Context) ([]*entity.User, error)
	Create(ctx context.Context, user *entity.User) error
	// Delete(ctx context.Context, user_id string) error
}
