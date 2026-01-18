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

type StopwatchCase struct {
	stopwatchRepo repo.StopwatchRepo
	habitDataRepo repo.HabitDataRepo
	txManager     port.TransactionManager
}

func NewStopwatchCase(
	stopwatchRepo repo.StopwatchRepo,
	habitDataRepo repo.HabitDataRepo,
	txManager port.TransactionManager,
) *StopwatchCase {
	return &StopwatchCase{
		stopwatchRepo: stopwatchRepo,
		habitDataRepo: habitDataRepo,
		txManager:     txManager,
	}
}

func (c *StopwatchCase) Create(ctx context.Context, stopwatch *entity.Stopwatch) (uuid.UUID, error) {
	stopwatch.ID = id.New()
	stopwatch.CreatedAt = time.Now()
	stopwatch.UpdatedAt = stopwatch.CreatedAt
	stopwatch.StartTime = &stopwatch.CreatedAt

	_, err := c.txManager.WithTx(ctx, func(ctx context.Context) (any, error) {
		err := c.stopwatchRepo.Create(ctx, stopwatch)
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

	return stopwatch.ID, nil
}

func (c *StopwatchCase) Read(ctx context.Context, userID uuid.UUID) (*entity.Stopwatch, error) {
	stopwatch, err := c.stopwatchRepo.Read(ctx, userID)
	if err != nil {
		if errors.Is(err, repo.ErrNotFound) {
			return nil, ErrNotFound
		}
		return nil, err
	}

	return stopwatch, nil
}

func (c *StopwatchCase) Update(ctx context.Context, stopwatch *entity.Stopwatch) error {
	stopwatch.UpdatedAt = time.Now()

	err := c.stopwatchRepo.Update(ctx, stopwatch)
	if err != nil {
		return err
	}
	return nil
}

func (c *StopwatchCase) Finish(ctx context.Context, stopwatch *entity.Stopwatch) error {
	stopwatch.UpdatedAt = time.Now()

	_, err := c.txManager.WithTx(ctx, func(ctx context.Context) (any, error) {
		if stopwatch.HabitID != nil {
			habitData := &entity.HabitData{
				HabitID:       *stopwatch.HabitID,
				Date:          *stopwatch.StartTime,
				Value:         1,
				Duration:      stopwatch.Duration,
				PauseDuration: stopwatch.PauseDuration,
			}
			habitData.ID = id.New()
			habitData.CreatedAt = time.Now()
			habitData.UpdatedAt = habitData.CreatedAt

			err := c.habitDataRepo.CreatePoint(ctx, habitData)
			if err != nil {
				return nil, fmt.Errorf("add new timed habit data point: %w", err)
			}
		}

		err := c.stopwatchRepo.Finish(ctx, stopwatch.UserID)
		if err != nil {
			return nil, fmt.Errorf("finish: %w", err)
		}

		return nil, nil
	})
	if err != nil {
		return err
	}

	return nil
}
