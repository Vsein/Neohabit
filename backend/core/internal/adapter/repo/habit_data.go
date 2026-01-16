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
	queryCreateHabitDataPoint = `
		INSERT INTO habit_data (id, habit_id, date, value, duration, pause_duration, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
	`
	queryUpdateHabitDataPoint = `
		UPDATE habit_data
		SET
			date = coalesce(date,$2),
			value = coalesce(value,$3),
			updated_at = $4
		WHERE id = $1
	`
	queryReduceHabitDataPointsBetweenDatesByAmount = `
		WITH data_period AS (
			SELECT
				id,
				value,
				SUM(value) OVER (ORDER BY date DESC, id DESC) AS running_sum
			FROM habit_data
		    	WHERE habit_id = $1 AND date BETWEEN $2 AND $3
		),
		updated AS (
			UPDATE habit_data hd
			SET value =
				CASE
					WHEN data_period.running_sum <= $4 THEN 0
					WHEN data_period.running_sum - data_period.value < $4
					     THEN data_period.running_sum - $4
					ELSE hd.value
				END
			FROM data_period
			WHERE hd.id = data_period.id
			RETURNING hd.id, hd.value
		)
		DELETE FROM habit_data
		WHERE value = 0 AND habit_id = $1;
	`
	queryDeleteHabitDataPoint                 = `DELETE FROM habit_data WHERE id = $1`
	queryDeleteAllHabitDataPointsBetweenDates = `
		DELETE FROM habit_data
		WHERE
			habit_id = $1
			AND date BETWEEN $2 AND $3
	`
)

type HabitData struct {
	pool   db.PoolTX
	logger *zap.Logger
}

func NewHabitDataRepo(pool db.PoolTX, logger *zap.Logger) *HabitData {
	return &HabitData{
		pool:   pool,
		logger: logger,
	}
}
func (r *HabitData) CreatePoint(ctx context.Context, habitData *entity.HabitData) error {
	_, err := r.pool.Exec(
		ctx,
		queryCreateHabitDataPoint,
		habitData.ID,
		habitData.HabitID,
		habitData.Date,
		habitData.Value,
		habitData.Duration,
		habitData.PauseDuration,
		habitData.CreatedAt,
		habitData.UpdatedAt,
	)
	if err != nil {
		if db.IsUniqueViolation(err) {
			return repo.ErrAlreadyExists
		}
		return fmt.Errorf("exec create habit data point: %w", err)
	}
	return nil
}

func (r *HabitData) UpdatePoint(ctx context.Context, habitData *entity.HabitData) error {
	_, err := r.pool.Exec(
		ctx,
		queryUpdateHabitDataPoint,
		habitData.ID,
		habitData.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return repo.ErrNotFound
		}
		return fmt.Errorf("exec update habit data point: %w", err)
	}
	return nil
}

func (r *HabitData) ReducePointsBetweenDatesByAmount(ctx context.Context, habitDataPeriod *entity.HabitDataPeriod) error {
	_, err := r.pool.Exec(
		ctx,
		queryReduceHabitDataPointsBetweenDatesByAmount,
		habitDataPeriod.HabitID,
		habitDataPeriod.PeriodStart,
		habitDataPeriod.PeriodEnd,
		habitDataPeriod.Amount,
	)
	if err != nil {
		return fmt.Errorf("exec reduce habit data points period: %w", err)
	}
	return nil
}

func (r *HabitData) DeletePoint(ctx context.Context, id uuid.UUID) error {
	_, err := r.pool.Exec(
		ctx,
		queryDeleteHabitDataPoint,
		id,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return repo.ErrNotFound
		}
		return fmt.Errorf("exec delete habit data point: %w", err)
	}
	return nil
}

func (r *HabitData) DeleteAllPointsBetweenDates(ctx context.Context, habitDataPeriod *entity.HabitDataPeriod) error {
	_, err := r.pool.Exec(
		ctx,
		queryDeleteAllHabitDataPointsBetweenDates,
		habitDataPeriod.HabitID,
		habitDataPeriod.PeriodStart,
		habitDataPeriod.PeriodEnd,
	)
	if err != nil {
		return fmt.Errorf("exec delete habit data points period: %w", err)
	}
	return nil
}
