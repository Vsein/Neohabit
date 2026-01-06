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

type SkilltreeCase struct {
	skilltreeRepo repo.SkilltreeRepo
	txManager     port.TransactionManager
}

func NewSkilltreeCase(
	skilltreeRepo repo.SkilltreeRepo,
	txManager port.TransactionManager,
) *SkilltreeCase {
	return &SkilltreeCase{
		skilltreeRepo: skilltreeRepo,
		txManager:     txManager,
	}
}

func (c *SkilltreeCase) Create(ctx context.Context, skilltree *entity.Skilltree) (string, error) {
	skilltree.ID = uuid.NewString()
	skilltree.CreatedAt = time.Now()
	skilltree.UpdatedAt = skilltree.CreatedAt

	_, err := c.txManager.WithTx(ctx, func(ctx context.Context) (any, error) {
		err := c.skilltreeRepo.Create(ctx, skilltree)
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

	return skilltree.ID, nil
}

// List retrieves all Skilltrees of a user
func (c *SkilltreeCase) List(ctx context.Context, userID string) ([]*entity.Skilltree, error) {
	skilltrees, err := c.skilltreeRepo.List(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("list: %w", err)
	}
	return skilltrees, nil
}

func (c *SkilltreeCase) Delete(ctx context.Context, id string) error {
	err := c.skilltreeRepo.Delete(ctx, id)
	if err != nil {
		return fmt.Errorf("delete: %w", err)
	}
	return nil
}
