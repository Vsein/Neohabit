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

func (c *HabitDataCase) CreatePoint(ctx context.Context, habitData *entity.HabitData) (uuid.UUID, error) {
	habitData.ID = id.New()
	habitData.CreatedAt = time.Now()
	habitData.UpdatedAt = habitData.CreatedAt

	err := c.habitDataRepo.CreatePoint(ctx, habitData)
	if err != nil {
		if errors.Is(err, repo.ErrAlreadyExists) {
			return uuid.Nil, ErrAlreadyExists
		}
		return uuid.Nil, fmt.Errorf("create: %w", err)
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

func (c *HabitDataCase) ReducePointsBetweenDatesByAmount(ctx context.Context, habitDataPeriod *entity.HabitDataPeriod) error {
	err := c.habitDataRepo.ReducePointsBetweenDatesByAmount(ctx, habitDataPeriod)
	if err != nil {
		return fmt.Errorf("reduce habit points between dates: %w", err)
	}

	return nil
}

func (c *HabitDataCase) DeletePoint(ctx context.Context, id uuid.UUID) error {
	err := c.habitDataRepo.DeletePoint(ctx, id)
	if err != nil {
		return fmt.Errorf("delete: %w", err)
	}
	return nil
}

func (c *HabitDataCase) DeleteAllPointsBetweenDates(ctx context.Context, habitDataPeriod *entity.HabitDataPeriod) error {
	err := c.habitDataRepo.DeleteAllPointsBetweenDates(ctx, habitDataPeriod)
	if err != nil {
		return fmt.Errorf("delete all habit points between dates: %w", err)
	}
	return nil
}
