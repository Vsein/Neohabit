package repo

import (
	"context"
	"errors"
	"fmt"

	"github.com/jackc/pgx/v5"
	"go.uber.org/zap"

	"neohabit/core/internal/adapter/repo/db"
	"neohabit/core/internal/entity"
	"neohabit/core/internal/port/repo"
)

const (
	queryReadStopwatch   = `SELECT * FROM stopwatches WHERE user_id = $1`
	queryCreateStopwatch = `
		INSERT INTO stopwatches (id, user_id, habit_id, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5)
	`
	queryUpdateStopwatch = `
		UPDATE stopwatches
		SET
			habit_id = coalesce($2,habit_id),
			is_initiated = coalesce($3,is_initiated),
			start_time = coalesce($4,start_time),
			duration = coalesce($5,duration),
			is_paused = coalesce($6,is_paused),
			pause_duration = coalesce($7,pause_duration),
			updated_at = $8
		WHERE user_id = $1`
	queryDeleteStopwatch = `DELETE FROM stopwatches WHERE user_id = $1`
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

func (r *Stopwatch) Read(ctx context.Context, userID string) (*entity.Stopwatch, error) {
	var stopwatch entity.Stopwatch
	err := r.pool.QueryRow(ctx, queryReadStopwatch, userID).Scan(
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
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, repo.ErrNotFound
		}
		return nil, err
	}

	return &stopwatch, nil
}

func (r *Stopwatch) Create(ctx context.Context, stopwatch *entity.Stopwatch) error {
	_, err := r.pool.Exec(
		ctx,
		queryCreateStopwatch,
		stopwatch.ID,
		stopwatch.UserID,
		stopwatch.HabitID,
		stopwatch.CreatedAt,
		stopwatch.UpdatedAt,
	)
	if err != nil {
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
		stopwatch.UserID,
		stopwatch.HabitID,
		stopwatch.IsInitiated,
		stopwatch.StartTime,
		stopwatch.Duration,
		stopwatch.IsPaused,
		stopwatch.PauseDuration,
		stopwatch.UpdatedAt,
	)
	if err != nil {
		return fmt.Errorf("exec update stopwatch: %w", err)
	}
	return nil
}

func (r *Stopwatch) Delete(ctx context.Context, userID string) error {
	_, err := r.pool.Exec(
		ctx,
		queryDeleteStopwatch,
		userID,
	)
	if err != nil {
		return err
	}
	return nil
}
