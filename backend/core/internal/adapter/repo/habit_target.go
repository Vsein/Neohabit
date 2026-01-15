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
	queryCreateHabitTarget = `
		INSERT INTO habit_targets (id, habit_id, date_start, value, period, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
	`
	queryUpdateHabitTarget = `
		UPDATE habit_targets
		SET
			date = coalesce(date,$2),
			value = coalesce(value,$3),
			updated_at = $4
		WHERE id = $1
	`
	queryDeleteHabitTarget = `DELETE FROM habit_targets WHERE id = $1`
)

type HabitTarget struct {
	pool   db.PoolTX
	logger *zap.Logger
}

func NewHabitTargetRepo(pool db.PoolTX, logger *zap.Logger) *HabitTarget {
	return &HabitTarget{
		pool:   pool,
		logger: logger,
	}
}
func (r *HabitTarget) CreateTarget(ctx context.Context, habitTarget *entity.HabitTarget) error {
	_, err := r.pool.Exec(
		ctx,
		queryCreateHabitTarget,
		habitTarget.ID,
		habitTarget.HabitID,
		habitTarget.DateStart,
		habitTarget.Value,
		habitTarget.Period,
		habitTarget.CreatedAt,
		habitTarget.UpdatedAt,
	)
	if err != nil {
		if db.IsUniqueViolation(err) {
			return repo.ErrAlreadyExists
		}
		return fmt.Errorf("exec create habit data target: %w", err)
	}
	return nil
}

func (r *HabitTarget) UpdateTarget(ctx context.Context, habitTarget *entity.HabitTarget) error {
	_, err := r.pool.Exec(
		ctx,
		queryUpdateHabitTarget,
		habitTarget.ID,
		habitTarget.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return repo.ErrNotFound
		}
		return fmt.Errorf("exec update habit data target: %w", err)
	}
	return nil
}

func (r *HabitTarget) DeleteTarget(ctx context.Context, id uuid.UUID) error {
	_, err := r.pool.Exec(
		ctx,
		queryDeleteHabitTarget,
		id,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return repo.ErrNotFound
		}
		return fmt.Errorf("exec delete habit data target: %w", err)
	}
	return nil
}
