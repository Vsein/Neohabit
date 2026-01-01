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

type UserCase struct {
	userRepo  repo.UserRepo
	txManager port.TransactionManager
}

func NewUserCase(
	userRepo repo.UserRepo,
	txManager port.TransactionManager,
) *UserCase {
	return &UserCase{
		userRepo:  userRepo,
		txManager: txManager,
	}
}

func (c *UserCase) Create(ctx context.Context, user *entity.User) (string, error) {
	user.ID = uuid.NewString()
	user.CreatedAt = time.Now()
	user.UpdatedAt = user.CreatedAt
	user.Verified = true
	user.VerificationTime = user.CreatedAt

	_, err := c.txManager.WithTx(ctx, func(ctx context.Context) (any, error) {
		err := c.userRepo.Create(ctx, user)
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

	return user.ID, nil
}
