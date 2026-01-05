package repo

import (
	"context"
	// "errors"
	"fmt"

	"github.com/jackc/pgx/v5"
	"go.uber.org/zap"

	"neohabit/core/internal/adapter/repo/db"
	"neohabit/core/internal/entity"
	"neohabit/core/internal/port/repo"
)

const (
	queryReadSettings   = `SELECT * FROM settings WHERE user_id = $1`
	queryCreateSettings = `
		INSERT INTO settings (id, user_id, created_at, updated_at)
		VALUES ($1, $2, $3, $4)
	`
	queryUpdateSettings = `UPDATE settings SET updated_at = $5 WHERE id = $1`
	queryDeleteSettings = `DELETE FROM settings WHERE user_id = $1`
)

type Settings struct {
	pool   db.PoolTX
	logger *zap.Logger
}

func NewSettingsRepo(pool db.PoolTX, logger *zap.Logger) *Settings {
	return &Settings{
		pool:   pool,
		logger: logger,
	}
}

func (r *Settings) Read(ctx context.Context, user_id string) (*entity.Settings, error) {
	var settings entity.Settings
	err := r.pool.QueryRow(ctx, queryReadSettings, user_id).Scan(
		&settings.ID,
		&settings.UserID,
		&settings.Theme,
		&settings.ReadSettingsFromConfigFile,
		&settings.CellHeightMultiplier,
		&settings.CellWidthMultiplier,
		&settings.OverviewVertical,
		&settings.OverviewCurrentDay,
		&settings.OverviewOffset,
		&settings.OverviewDuration,
		&settings.OverviewApplyLimit,
		&settings.OverviewDurationLimit,
		&settings.AllowHorizontalScrolling,
		&settings.HabitHeatmapsOverride,
		&settings.HabitHeatmapsCurrentDay,
		&settings.ShowStopwatchTimeInPageTitle,
		&settings.HideCellHint,
		&settings.HideOnboarding,
		&settings.ProjectsEnableCustomOrder,
		&settings.ProjectsIDOrder,
		&settings.CreatedAt,
		&settings.UpdatedAt,
	)
	if err != nil {
		return nil, repo.ErrNotFound
	}
	return &settings, nil
}

func (r *Settings) Create(ctx context.Context, settings *entity.Settings) error {
	_, err := r.pool.Exec(
		ctx,
		queryCreateSettings,
		settings.ID,
		settings.UserID,
		settings.CreatedAt,
		settings.UpdatedAt,
	)
	if err != nil {
		// Check for unique constraint violation (duplicate name, etc.)
		// Adjust this based on your actual database constraints
		if db.IsUniqueViolation(err) {
			return repo.ErrAlreadyExists
		}
		return fmt.Errorf("exec create settings: %w", err)
	}
	return nil
}

func (r *Settings) Update(ctx context.Context, settings *entity.Settings) error {
	_, err := r.pool.Exec(
		ctx,
		queryUpdateSettings,
		settings.ID,
		settings.UpdatedAt,
	)
	if err != nil {
		return fmt.Errorf("exec update settings: %w", err)
	}
	return nil
}

func (r *Settings) Delete(ctx context.Context, user_id string) error {
	_, err := r.pool.Exec(
		ctx,
		queryDeleteSettings,
		user_id,
	)
	if err != nil {
		return err
	}
	return nil
}
