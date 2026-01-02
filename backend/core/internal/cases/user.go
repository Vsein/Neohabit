package cases

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"

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
	password, err := bcrypt.GenerateFromPassword([]byte(user.Password), 12)
	if err != nil {
		return "", fmt.Errorf("bcrypt password generation: %w", err)
	}

	user.ID = uuid.NewString()
	user.CreatedAt = time.Now()
	user.UpdatedAt = user.CreatedAt
	user.Verified = true
	user.VerificationTime = user.CreatedAt
	user.Password = string(password)

	_, err = c.txManager.WithTx(ctx, func(ctx context.Context) (any, error) {
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

func (c *UserCase) GetByUsername(ctx context.Context, username string) (*entity.User, error) {
	user, err := c.userRepo.GetByUsername(ctx, username)
	if err != nil {
		if errors.Is(err, repo.ErrNotFound) {
			return nil, ErrNotFound
		}
		return nil, err
	}

	return user, nil
}
