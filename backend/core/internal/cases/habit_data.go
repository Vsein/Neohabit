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
)

type HabitDataCase struct {
	habitDataRepo repo.HabitDataRepo
	txManager     port.TransactionManager
}

func NewHabitDataCase(
	habitDataRepo repo.HabitDataRepo,
	txManager port.TransactionManager,
) *HabitDataCase {
	return &HabitDataCase{
		habitDataRepo: habitDataRepo,
		txManager:     txManager,
	}
}

func (c *HabitDataCase) CreatePoint(ctx context.Context, habitData *entity.HabitData) (string, error) {
	habitData.ID = uuid.NewString()
	habitData.CreatedAt = time.Now()
	habitData.UpdatedAt = habitData.CreatedAt

	err := c.habitDataRepo.CreatePoint(ctx, habitData)
	if err != nil {
		if errors.Is(err, repo.ErrAlreadyExists) {
			return "", ErrAlreadyExists
		}
		return "", fmt.Errorf("create: %w", err)
	}

	return habitData.ID, nil
}

func (c *HabitDataCase) UpdatePoint(ctx context.Context, habitData *entity.HabitData) error {
	habitData.UpdatedAt = time.Now()

	err := c.habitDataRepo.UpdatePoint(ctx, habitData)
	if err != nil {
		if errors.Is(err, repo.ErrNotFound) {
			return ErrNotFound
		}
		return fmt.Errorf("update: %w", err)
	}

	return nil
}

func (c *HabitDataCase) DeletePoint(ctx context.Context, id string) error {
	err := c.habitDataRepo.DeletePoint(ctx, id)
	if err != nil {
		return fmt.Errorf("delete: %w", err)
	}
	return nil
}
