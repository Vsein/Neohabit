package repo

import (
	"context"

	"neohabit/core/internal/entity"
)

type ProjectRepo interface {
	// Read(ctx context.Context, id string) (*entity.Project, error)
	List(ctx context.Context, userID string) ([]*entity.Project, error)
	Create(ctx context.Context, project *entity.Project) error
	Update(ctx context.Context, project *entity.Project) error
	UpdateProjectsOrder(ctx context.Context, newProjectsOrder []string) error
	Delete(ctx context.Context, id string) error
}
