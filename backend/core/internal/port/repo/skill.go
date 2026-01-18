package repo

import (
	"context"

	"github.com/google/uuid"

	"neohabit/core/internal/entity"
)

type SkillRepo interface {
	Create(ctx context.Context, skill *entity.Skill) error
	Update(ctx context.Context, skill *entity.Skill) error
	Delete(ctx context.Context, id uuid.UUID) error
}
