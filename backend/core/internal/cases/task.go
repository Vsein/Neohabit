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

type TaskCase struct {
	taskRepo  repo.TaskRepo
	txManager port.TransactionManager
}

func NewTaskCase(
	taskRepo repo.TaskRepo,
	txManager port.TransactionManager,
) *TaskCase {
	return &TaskCase{
		taskRepo:  taskRepo,
		txManager: txManager,
	}
}

func (c *TaskCase) Create(ctx context.Context, task *entity.Task) (uuid.UUID, error) {
	task.ID = id.New()
	task.CreatedAt = time.Now()
	task.UpdatedAt = task.CreatedAt

	_, err := c.txManager.WithTx(ctx, func(ctx context.Context) (any, error) {
		err := c.taskRepo.Create(ctx, task)
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

	return task.ID, nil
}

// List retrieves all Tasks of a user
func (c *TaskCase) List(ctx context.Context, userID uuid.UUID) ([]*entity.Task, error) {
	tasks, err := c.taskRepo.List(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("list: %w", err)
	}
	return tasks, nil
}

func (c *TaskCase) Update(ctx context.Context, task *entity.Task) error {
	task.UpdatedAt = time.Now()

	err := c.taskRepo.Update(ctx, task)
	if err != nil {
		return err
	}
	return nil
}

func (c *TaskCase) Delete(ctx context.Context, id uuid.UUID) error {
	err := c.taskRepo.Delete(ctx, id)
	if err != nil {
		return fmt.Errorf("delete: %w", err)
	}
	return nil
}
