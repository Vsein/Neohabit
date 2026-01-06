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

type ProjectCase struct {
	projectRepo repo.ProjectRepo
	txManager   port.TransactionManager
}

func NewProjectCase(
	projectRepo repo.ProjectRepo,
	txManager port.TransactionManager,
) *ProjectCase {
	return &ProjectCase{
		projectRepo: projectRepo,
		txManager:   txManager,
	}
}

func (c *ProjectCase) Create(ctx context.Context, project *entity.Project) (string, error) {
	project.ID = uuid.NewString()
	project.CreatedAt = time.Now()
	project.UpdatedAt = project.CreatedAt

	_, err := c.txManager.WithTx(ctx, func(ctx context.Context) (any, error) {
		err := c.projectRepo.Create(ctx, project)
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

	return project.ID, nil
}

// List retrieves all Projects of a user
func (c *ProjectCase) List(ctx context.Context, userID string) ([]*entity.Project, error) {
	projects, err := c.projectRepo.List(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("list: %w", err)
	}
	return projects, nil
}

func (c *ProjectCase) Delete(ctx context.Context, id string) error {
	err := c.projectRepo.Delete(ctx, id)
	if err != nil {
		return fmt.Errorf("delete: %w", err)
	}
	return nil
}
