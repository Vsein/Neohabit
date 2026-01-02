package repo

import (
	"context"

	"neohabit/core/internal/entity"
)

type UserRepo interface {
	Create(ctx context.Context, user *entity.User) error
	GetByUsername(ctx context.Context, username string) (*entity.User, error)
	// Delete(ctx context.Context, user_id string) error
}
