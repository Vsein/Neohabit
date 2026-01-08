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
	userRepo      repo.UserRepo
	habitRepo     repo.HabitRepo
	settingsRepo  repo.SettingsRepo
	stopwatchRepo repo.StopwatchRepo
	txManager     port.TransactionManager
}

func NewUserCase(
	userRepo repo.UserRepo,
	habitRepo repo.HabitRepo,
	settingsRepo repo.SettingsRepo,
	stopwatchRepo repo.StopwatchRepo,
	txManager port.TransactionManager,
) *UserCase {
	return &UserCase{
		userRepo:      userRepo,
		habitRepo:     habitRepo,
		settingsRepo:  settingsRepo,
		stopwatchRepo: stopwatchRepo,
		txManager:     txManager,
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
			return nil, fmt.Errorf("create user: %w", err)
		}

		habitID := uuid.NewString()
		err = c.habitRepo.Create(ctx, &entity.Habit{
			ID:        habitID,
			UserID:    user.ID,
			Name:      "Sample habit",
			Color:     "#23BCDB",
			CreatedAt: user.CreatedAt,
			UpdatedAt: user.UpdatedAt,
		})
		if err != nil {
			return nil, fmt.Errorf("create habit: %w", err)
		}

		err = c.settingsRepo.Create(ctx, &entity.Settings{
			ID:        uuid.NewString(),
			UserID:    user.ID,
			CreatedAt: user.CreatedAt,
			UpdatedAt: user.UpdatedAt,
		})
		if err != nil {
			return nil, fmt.Errorf("create settings: %w", err)
		}

		err = c.stopwatchRepo.Create(ctx, &entity.Stopwatch{
			ID:        uuid.NewString(),
			UserID:    user.ID,
			HabitID:   habitID,
			CreatedAt: user.CreatedAt,
			UpdatedAt: user.UpdatedAt,
		})
		if err != nil {
			return nil, fmt.Errorf("create stopwatch: %w", err)
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

func (c *UserCase) GetByID(ctx context.Context, userID string) (*entity.User, error) {
	user, err := c.userRepo.GetByID(ctx, userID)
	if err != nil {
		if errors.Is(err, repo.ErrNotFound) {
			return nil, ErrNotFound
		}
		return nil, err
	}

	return user, nil
}

func (c *UserCase) Delete(ctx context.Context, userID string) error {
	err := c.userRepo.Delete(ctx, userID)
	if err != nil {
		return fmt.Errorf("delete: %w", err)
	}
	return nil
}
