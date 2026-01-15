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

func (c *ProjectCase) Create(ctx context.Context, project *entity.Project) (uuid.UUID, error) {
	project.ID = id.New()
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
		return uuid.Nil, err
	}

	return project.ID, nil
}

// List retrieves all Projects of a user
func (c *ProjectCase) List(ctx context.Context, userID uuid.UUID) ([]*entity.Project, error) {
	projects, err := c.projectRepo.List(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("list: %w", err)
	}
	return projects, nil
}

func (c *ProjectCase) Update(ctx context.Context, project *entity.Project) error {
	project.UpdatedAt = time.Now()

	err := c.projectRepo.Update(ctx, project)
	if err != nil {
		if errors.Is(err, repo.ErrNotFound) {
			return ErrNotFound
		}
		return fmt.Errorf("update: %w", err)
	}

	return nil
}

func (c *ProjectCase) UpdateProjectsOrder(ctx context.Context, newProjectsOrder []uuid.UUID) error {
	err := c.projectRepo.UpdateProjectsOrder(ctx, newProjectsOrder)
	if err != nil {
		return fmt.Errorf("update projects order: %w", err)
	}

	return nil
}

func (c *ProjectCase) Delete(ctx context.Context, id uuid.UUID) error {
	err := c.projectRepo.Delete(ctx, id)
	if err != nil {
		return fmt.Errorf("delete: %w", err)
	}
	return nil
}
