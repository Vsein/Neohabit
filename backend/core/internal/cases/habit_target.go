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

type HabitTargetCase struct {
	habitTargetRepo repo.HabitTargetRepo
	txManager       port.TransactionManager
}

func NewHabitTargetCase(
	habitTargetRepo repo.HabitTargetRepo,
	txManager port.TransactionManager,
) *HabitTargetCase {
	return &HabitTargetCase{
		habitTargetRepo: habitTargetRepo,
		txManager:       txManager,
	}
}

func (c *HabitTargetCase) CreateTarget(ctx context.Context, habitTarget *entity.HabitTarget) (uuid.UUID, error) {
	habitTarget.ID = id.New()
	habitTarget.CreatedAt = time.Now()
	habitTarget.UpdatedAt = habitTarget.CreatedAt

	err := c.habitTargetRepo.CreateTarget(ctx, habitTarget)
	if err != nil {
		if errors.Is(err, repo.ErrAlreadyExists) {
			return uuid.Nil, ErrAlreadyExists
		}
		return uuid.Nil, fmt.Errorf("create: %w", err)
	}

	return habitTarget.ID, nil
}

func (c *HabitTargetCase) UpdateTarget(ctx context.Context, habitTarget *entity.HabitTarget) error {
	habitTarget.UpdatedAt = time.Now()

	err := c.habitTargetRepo.UpdateTarget(ctx, habitTarget)
	if err != nil {
		if errors.Is(err, repo.ErrNotFound) {
			return ErrNotFound
		}
		return fmt.Errorf("update: %w", err)
	}

	return nil
}

func (c *HabitTargetCase) DeleteTarget(ctx context.Context, id uuid.UUID) error {
	err := c.habitTargetRepo.DeleteTarget(ctx, id)
	if err != nil {
		return fmt.Errorf("delete: %w", err)
	}
	return nil
}
