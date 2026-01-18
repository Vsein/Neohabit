package repo

import (
	"context"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"go.uber.org/zap"

	"neohabit/core/internal/adapter/repo/db"
	"neohabit/core/internal/entity"
	"neohabit/core/internal/port/repo"
)

const (
	// queryListUsers  = `SELECT * FROM users`
	queryGetUserByUsername = `SELECT * FROM users WHERE LOWER(username) = LOWER($1)`
	queryGetUserByID       = `SELECT * FROM users WHERE id = $1`
	queryCreateUser        = `
		INSERT INTO users (id, username, email, password, verified, verification_attempts, verification_time, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
	`
	queryDeleteUser = `DELETE FROM users WHERE id = $1`
)

type User struct {
	pool   db.PoolTX
	logger *zap.Logger
}

func NewUserRepo(pool db.PoolTX, logger *zap.Logger) *User {
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

func (r *User) GetByUsername(ctx context.Context, username string) (*entity.User, error) {
	var user entity.User
	err := r.pool.QueryRow(ctx, queryGetUserByUsername, username).Scan(
		&user.ID,
		&user.Username,
		&user.Email,
		&user.Password,
		&user.Verified,
		&user.VerificationAttempts,
		&user.VerificationTime,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, repo.ErrNotFound
		}
		return nil, err
	}
	return &user, nil
}

func (r *User) GetByID(ctx context.Context, userID uuid.UUID) (*entity.User, error) {
	var user entity.User
	err := r.pool.QueryRow(ctx, queryGetUserByID, userID).Scan(
		&user.ID,
		&user.Username,
		&user.Email,
		&user.Password,
		&user.Verified,
		&user.VerificationAttempts,
		&user.VerificationTime,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, repo.ErrNotFound
		}
		return nil, err
	}
	return &user, nil
}

func (r *User) Delete(ctx context.Context, userID uuid.UUID) error {
	_, err := r.pool.Exec(
		ctx,
		queryDeleteUser,
		userID,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return repo.ErrNotFound
		}
		return fmt.Errorf("exec delete user: %w", err)
	}
	return nil
}
