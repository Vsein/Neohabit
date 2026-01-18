package cases

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"

	"neohabit/core/internal/entity"
	"neohabit/core/internal/port"
	"neohabit/core/internal/port/repo"
	"neohabit/core/pkg/id"
)

type SettingsCase struct {
	settingsRepo repo.SettingsRepo
	txManager    port.TransactionManager
}

func NewSettingsCase(
	settingsRepo repo.SettingsRepo,
	txManager port.TransactionManager,
) *SettingsCase {
	return &SettingsCase{
		settingsRepo: settingsRepo,
		txManager:    txManager,
	}
}

func (c *SettingsCase) Create(ctx context.Context, settings *entity.Settings) (uuid.UUID, error) {
	settings.ID = id.New()
	settings.CreatedAt = time.Now()
	settings.UpdatedAt = settings.CreatedAt

	_, err := c.txManager.WithTx(ctx, func(ctx context.Context) (any, error) {
		err := c.settingsRepo.Create(ctx, settings)
		if err != nil {
			if errors.Is(err, repo.ErrAlreadyExists) {
				return nil, ErrAlreadyExists
			}
			return nil, fmt.Errorf("create: %w", err)
		}
		return nil, nil
	})
	if err != nil {
		return uuid.Nil, err
	}

	return settings.ID, nil
}

func (c *SettingsCase) Read(ctx context.Context, settings_id uuid.UUID) (*entity.Settings, error) {
	settings, err := c.settingsRepo.Read(ctx, settings_id)
	if err != nil {
		if errors.Is(err, repo.ErrNotFound) {
			return nil, ErrNotFound
		}
		return nil, err
	}

	return settings, nil
}

func (c *SettingsCase) Update(ctx context.Context, settings *entity.Settings) error {
	settings.UpdatedAt = time.Now()

	err := c.settingsRepo.Update(ctx, settings)
	if err != nil {
		return err
	}
	return nil
}
