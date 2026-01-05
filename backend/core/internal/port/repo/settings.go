package repo

import (
	"context"

	"neohabit/core/internal/entity"
)

type SettingsRepo interface {
	Read(ctx context.Context, user_id string) (*entity.Settings, error)
	Create(ctx context.Context, settings *entity.Settings) error
	Update(ctx context.Context, settings *entity.Settings) error
	Delete(ctx context.Context, user_id string) error
}
