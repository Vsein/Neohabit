package repo

import (
	"context"

	"github.com/google/uuid"

	"neohabit/core/internal/entity"
)

type ProjectRepo interface {
	// Read(ctx context.Context, id string) (*entity.Project, error)
	List(ctx context.Context, userID uuid.UUID) ([]*entity.Project, error)
	Create(ctx context.Context, project *entity.Project) error
	Update(ctx context.Context, project *entity.Project) error
	UpdateProjectsOrder(ctx context.Context, newProjectsOrder []uuid.UUID) error
	AddHabitsToProject(ctx context.Context, projectID uuid.UUID, habitIDs []uuid.UUID) error
	Delete(ctx context.Context, id uuid.UUID) error
}
