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

type StopwatchCase struct {
	stopwatchRepo repo.StopwatchRepo
	txManager     port.TransactionManager
}

func NewStopwatchCase(
	stopwatchRepo repo.StopwatchRepo,
	txManager port.TransactionManager,
) *StopwatchCase {
	return &StopwatchCase{
		stopwatchRepo: stopwatchRepo,
		txManager:     txManager,
	}
}

func (c *StopwatchCase) Create(ctx context.Context, stopwatch *entity.Stopwatch) (string, error) {
	stopwatch.ID = uuid.NewString()
	stopwatch.CreatedAt = time.Now()
	stopwatch.UpdatedAt = stopwatch.CreatedAt
	stopwatch.StartTime = stopwatch.CreatedAt

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
		return "", err
	}

	return stopwatch.ID, nil
}

func (c *StopwatchCase) Read(ctx context.Context, userID string) (*entity.Stopwatch, error) {
	stopwatch, err := c.stopwatchRepo.Read(ctx, userID)
	if err != nil {
		if errors.Is(err, repo.ErrNotFound) {
			return nil, ErrNotFound
		}
		return nil, err
	}

	return stopwatch, nil
}
