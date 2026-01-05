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
	queryReadStopwatch   = `SELECT * FROM stopwatch WHERE user_id = $1`
	queryCreateStopwatch = `
		INSERT INTO stopwatch (id, user_id, created_at, updated_at)
		VALUES ($1, $2, $3, $4)
	`
	queryUpdateStopwatch = `UPDATE stopwatch SET updated_at = $5 WHERE id = $1`
	queryDeleteStopwatch = `DELETE FROM stopwatch WHERE user_id = $1`
)

type Stopwatch struct {
	pool   db.PoolTX
	logger *zap.Logger
}

func NewStopwatchRepo(pool db.PoolTX, logger *zap.Logger) *Stopwatch {
	return &Stopwatch{
		pool:   pool,
		logger: logger,
	}
}

func (r *Stopwatch) Read(ctx context.Context, user_id string) (*entity.Stopwatch, error) {
	var stopwatch entity.Stopwatch
	err := r.pool.QueryRow(ctx, queryReadStopwatch, user_id).Scan(
		&stopwatch.ID,
		&stopwatch.UserID,
		&stopwatch.HabitID,
		&stopwatch.IsInitiated,
		&stopwatch.StartTime,
		&stopwatch.Duration,
		&stopwatch.IsPaused,
		&stopwatch.PauseDuration,
		&stopwatch.CreatedAt,
		&stopwatch.UpdatedAt,
	)
	if err != nil {
		return nil, repo.ErrNotFound
	}
	return &stopwatch, nil
}

func (r *Stopwatch) Create(ctx context.Context, stopwatch *entity.Stopwatch) error {
	_, err := r.pool.Exec(
		ctx,
		queryCreateStopwatch,
		stopwatch.ID,
		stopwatch.UserID,
		stopwatch.CreatedAt,
		stopwatch.UpdatedAt,
	)
	if err != nil {
		// Check for unique constraint violation (duplicate name, etc.)
		// Adjust this based on your actual database constraints
		if db.IsUniqueViolation(err) {
			return repo.ErrAlreadyExists
		}
		return fmt.Errorf("exec create stopwatch: %w", err)
	}
	return nil
}

func (r *Stopwatch) Update(ctx context.Context, stopwatch *entity.Stopwatch) error {
	_, err := r.pool.Exec(
		ctx,
		queryUpdateStopwatch,
		stopwatch.ID,
		stopwatch.UpdatedAt,
	)
	if err != nil {
		return fmt.Errorf("exec update stopwatch: %w", err)
	}
	return nil
}

func (r *Stopwatch) Delete(ctx context.Context, user_id string) error {
	_, err := r.pool.Exec(
		ctx,
		queryDeleteStopwatch,
		user_id,
	)
	if err != nil {
		return err
	}
	return nil
}
