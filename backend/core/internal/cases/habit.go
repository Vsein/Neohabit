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

type HabitCase struct {
	habitRepo repo.HabitRepo
	txManager port.TransactionManager
}

func NewHabitCase(
	habitRepo repo.HabitRepo,
	txManager port.TransactionManager,
) *HabitCase {
	return &HabitCase{
		habitRepo: habitRepo,
		txManager: txManager,
	}
}

func (c *HabitCase) Create(ctx context.Context, habit *entity.Habit) (string, error) {
	habit.ID = uuid.NewString()
	habit.CreatedAt = time.Now()
	habit.UpdatedAt = habit.CreatedAt

	_, err := c.txManager.WithTx(ctx, func(ctx context.Context) (any, error) {
		err := c.habitRepo.Create(ctx, habit)
		if err != nil {
			if errors.Is(err, repo.ErrAlreadyExists) {
				return nil, ErrAlreadyExists
			}
			return nil, fmt.Errorf("create: %w", err)
		}
		return nil, nil
	})
	if err != nil {
		return "", err
	}

	return habit.ID, nil
}

// func (c *HabitCase) Read(ctx context.Context, id string) (*entity.Habit, error) {
// 	habit, err := c.habitRepo.Read(ctx, id)
// 	if err != nil {
// 		if errors.Is(err, repo.ErrNotFound) {
// 			return nil, ErrNotFound
// 		}
// 		return nil, fmt.Errorf("read: %w", err)
// 	}
// 	return habit, nil
// }

// List retrieves all Habits of a user
func (c *HabitCase) List(ctx context.Context, userID string) ([]*entity.Habit, error) {
	habits, err := c.habitRepo.List(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("list: %w", err)
	}
	return habits, nil
}

func (c *HabitCase) Update(ctx context.Context, habit *entity.Habit) error {
	habit.UpdatedAt = time.Now()

	err := c.habitRepo.Update(ctx, habit)
	if err != nil {
		if errors.Is(err, repo.ErrNotFound) {
			return ErrNotFound
		}
		return fmt.Errorf("update: %w", err)
	}

	return nil
}

func (c *HabitCase) Delete(ctx context.Context, id string) error {
	err := c.habitRepo.Delete(ctx, id)
	if err != nil {
		return fmt.Errorf("delete: %w", err)
	}
	return nil
}
