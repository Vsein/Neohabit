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

type SkillCase struct {
	skillRepo repo.SkillRepo
	txManager port.TransactionManager
}

func NewSkillCase(
	skillRepo repo.SkillRepo,
	txManager port.TransactionManager,
) *SkillCase {
	return &SkillCase{
		skillRepo: skillRepo,
		txManager: txManager,
	}
}

func (c *SkillCase) Create(ctx context.Context, skill *entity.Skill) (uuid.UUID, error) {
	skill.ID = id.New()
	skill.CreatedAt = time.Now()
	skill.UpdatedAt = skill.CreatedAt

	err := c.skillRepo.Create(ctx, skill)
	if err != nil {
		if errors.Is(err, repo.ErrAlreadyExists) {
			return uuid.Nil, ErrAlreadyExists
		}
		return uuid.Nil, fmt.Errorf("create subskill: %w", err)
	}

	return skill.ID, nil
}

func (c *SkillCase) Update(ctx context.Context, skill *entity.Skill) error {
	skill.UpdatedAt = time.Now()

	err := c.skillRepo.Update(ctx, skill)
	if err != nil {
		if errors.Is(err, repo.ErrNotFound) {
			return ErrNotFound
		}
		return fmt.Errorf("update: %w", err)
	}

	return nil
}

func (c *SkillCase) Delete(ctx context.Context, id uuid.UUID) error {
	err := c.skillRepo.Delete(ctx, id)
	if err != nil {
		return fmt.Errorf("delete: %w", err)
	}
	return nil
}
