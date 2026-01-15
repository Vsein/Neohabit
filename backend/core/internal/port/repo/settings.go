package repo

import (
	"context"

	"github.com/google/uuid"

	"neohabit/core/internal/entity"
)

type SettingsRepo interface {
	Read(ctx context.Context, userID uuid.UUID) (*entity.Settings, error)
	Create(ctx context.Context, settings *entity.Settings) error
	Update(ctx context.Context, settings *entity.Settings) error
	Delete(ctx context.Context, userID uuid.UUID) error
}
