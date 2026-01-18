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

type SkilltreeCase struct {
	skilltreeRepo repo.SkilltreeRepo
	skillRepo     repo.SkillRepo
	txManager     port.TransactionManager
}

func NewSkilltreeCase(
	skilltreeRepo repo.SkilltreeRepo,
	skillRepo repo.SkillRepo,
	txManager port.TransactionManager,
) *SkilltreeCase {
	return &SkilltreeCase{
		skilltreeRepo: skilltreeRepo,
		skillRepo:     skillRepo,
		txManager:     txManager,
	}
}

func (c *SkilltreeCase) Create(ctx context.Context, skilltree *entity.Skilltree) (uuid.UUID, uuid.UUID, error) {
	skilltree.ID = id.New()
	skilltree.CreatedAt = time.Now()
	skilltree.UpdatedAt = skilltree.CreatedAt
	skillID := id.New()

	_, err := c.txManager.WithTx(ctx, func(ctx context.Context) (any, error) {
		err := c.skilltreeRepo.Create(ctx, skilltree)
		if err != nil {
			if errors.Is(err, repo.ErrAlreadyExists) {
				return nil, ErrAlreadyExists
			}
			return nil, fmt.Errorf("create: %w", err)
		}

		err = c.skillRepo.Create(ctx, &entity.Skill{
			ID:          skillID,
			SkilltreeID: skilltree.ID,
			IsRootSkill: true,
			Name:        &skilltree.Name,
			Status:      2,
			CreatedAt:   skilltree.CreatedAt,
			UpdatedAt:   skilltree.UpdatedAt,
		})
		if err != nil {
			return nil, fmt.Errorf("create root skill: %w", err)
		}
		return nil, nil
	})
	if err != nil {
		return uuid.Nil, uuid.Nil, err
	}

	return skilltree.ID, skillID, nil
}

// List retrieves all Skilltrees of a user
func (c *SkilltreeCase) List(ctx context.Context, userID uuid.UUID) ([]*entity.Skilltree, error) {
	skilltrees, err := c.skilltreeRepo.List(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("list: %w", err)
	}
	return skilltrees, nil
}

func (c *SkilltreeCase) Update(ctx context.Context, skilltree *entity.Skilltree) error {
	skilltree.UpdatedAt = time.Now()

	err := c.skilltreeRepo.Update(ctx, skilltree)
	if err != nil {
		if errors.Is(err, repo.ErrNotFound) {
			return ErrNotFound
		}
		return fmt.Errorf("update: %w", err)
	}

	return nil
}

func (c *SkilltreeCase) Delete(ctx context.Context, id uuid.UUID) error {
	err := c.skilltreeRepo.Delete(ctx, id)
	if err != nil {
		return fmt.Errorf("delete: %w", err)
	}
	return nil
}
