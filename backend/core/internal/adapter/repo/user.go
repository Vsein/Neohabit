package repo

import (
	"context"
	"fmt"

	"go.uber.org/zap"

	"neohabit/core/internal/adapter/repo/db"
	"neohabit/core/internal/entity"
	"neohabit/core/internal/port/repo"
)

const (
	// queryListUsers  = `SELECT * FROM users`
	queryCreateUser = `
		INSERT INTO users (id, username, email, password, verified, verification_attempts, verification_time, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
	`
)

type User struct {
	pool   db.PoolTX
	logger *zap.Logger
}

func NewUser(pool db.PoolTX, logger *zap.Logger) *User {
	return &User{
		pool:   pool,
		logger: logger,
	}
}

func (r *User) Create(ctx context.Context, user *entity.User) error {
	_, err := r.pool.Exec(
		ctx,
		queryCreateUser,
		user.ID,
		user.Username,
		user.Email,
		user.Password,
		user.Verified,
		user.VerificationAttempts,
		user.VerificationTime,
		user.CreatedAt,
		user.UpdatedAt,
	)
	if err != nil {
		if db.IsUniqueViolation(err) {
			return repo.ErrAlreadyExists
		}
		return fmt.Errorf("exec create user: %w", err)
	}
	return nil
}
