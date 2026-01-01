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

// HabitCase orchestrates Habit-related business logic
type HabitCase struct {
	habitRepo repo.HabitRepo
	txManager port.TransactionManager
}

// NewHabitCase creates a new HabitCase instance
func NewHabitCase(
	habitRepo repo.HabitRepo,
	txManager port.TransactionManager,
) *HabitCase {
	return &HabitCase{
		habitRepo: habitRepo,
		txManager: txManager,
	}
}

// Create creates a new Habit
func (c *HabitCase) Create(ctx context.Context, habit *entity.Habit) (string, error) {
	// Generate ID and timestamps
	habit.ID = uuid.NewString()
	habit.CreatedAt = time.Now()
	habit.UpdatedAt = habit.CreatedAt

	// Execute in transaction
	_, err := c.txManager.WithTx(ctx, func(ctx context.Context) (any, error) {
		err := c.habitRepo.Create(ctx, habit)
		if err != nil {
			if errors.Is(err, repo.ErrConflict) {
				return nil, ErrConflict
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
func (c *HabitCase) List(ctx context.Context, user_id string) ([]*entity.Habit, error) {
	habits, err := c.habitRepo.List(ctx, user_id)
	if err != nil {
		return nil, fmt.Errorf("list: %w", err)
	}
	return habits, nil
}
