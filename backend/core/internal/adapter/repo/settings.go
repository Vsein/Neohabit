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
	queryReadSettings = `
		SELECT
			s.id,
			s.user_id,
			s.theme,
			s.read_settings_from_config_file,
			s.cell_height_multiplier,
			s.cell_width_multiplier,
			s.overview_vertical,
			s.overview_current_day,
			s.overview_offset,
			s.overview_duration,
			s.overview_apply_limit,
			s.overview_duration_limit,
			s.allow_horizontal_scrolling,
			s.habit_heatmaps_override,
			s.habit_heatmaps_current_day,
			s.show_stopwatch_time_in_page_title,
			s.hide_cell_hint,
			s.hide_onboarding,
			s.projects_enable_custom_order,
			s.projects_enable_overview_mode,
			s.modals_show_color_changes,
			s.updated_at,
			s.created_at
		FROM settings s
		WHERE user_id = $1`
	queryCreateSettings = `
		INSERT INTO settings (id, user_id, created_at, updated_at)
		VALUES ($1, $2, $3, $4)
	`
	queryUpdateSettings = `
		UPDATE settings
		SET
			theme = coalesce($2,theme),
			read_settings_from_config_file = coalesce($3,read_settings_from_config_file),
			cell_height_multiplier = coalesce($4,cell_height_multiplier),
			cell_width_multiplier = coalesce($5,cell_width_multiplier),
			overview_vertical = coalesce($6,overview_vertical),
			overview_current_day = coalesce($7,overview_current_day),
			overview_offset = coalesce($8,overview_offset),
			overview_duration = coalesce($9,overview_duration),
			overview_apply_limit = coalesce($10,overview_apply_limit),
			overview_duration_limit = coalesce($11,overview_duration_limit),
			allow_horizontal_scrolling = coalesce($12,allow_horizontal_scrolling),
			habit_heatmaps_override = coalesce($13,habit_heatmaps_override),
			habit_heatmaps_current_day = coalesce($14,habit_heatmaps_current_day),
			show_stopwatch_time_in_page_title = coalesce($15,show_stopwatch_time_in_page_title),
			hide_cell_hint = coalesce($16,hide_cell_hint),
			hide_onboarding = coalesce($17,hide_onboarding),
			projects_enable_custom_order = coalesce($18,projects_enable_custom_order),
			projects_enable_overview_mode = coalesce($19,projects_enable_overview_mode),
			modals_show_color_changes = coalesce($20,modals_show_color_changes),
			updated_at = $21
		WHERE user_id = $1`
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

func (r *Settings) Read(ctx context.Context, userID uuid.UUID) (*entity.Settings, error) {
	var settings entity.Settings
	err := r.pool.QueryRow(ctx, queryReadSettings, userID).Scan(
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
		&settings.ProjectsEnableOverviewMode,
		&settings.ModalsShowColorChanges,
		&settings.CreatedAt,
		&settings.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, repo.ErrNotFound
		}
		return nil, err
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
		settings.UserID,
		settings.Theme,
		settings.ReadSettingsFromConfigFile,
		settings.CellHeightMultiplier,
		settings.CellWidthMultiplier,
		settings.OverviewVertical,
		settings.OverviewCurrentDay,
		settings.OverviewOffset,
		settings.OverviewDuration,
		settings.OverviewApplyLimit,
		settings.OverviewDurationLimit,
		settings.AllowHorizontalScrolling,
		settings.HabitHeatmapsOverride,
		settings.HabitHeatmapsCurrentDay,
		settings.ShowStopwatchTimeInPageTitle,
		settings.HideCellHint,
		settings.HideOnboarding,
		settings.ProjectsEnableCustomOrder,
		settings.ProjectsEnableOverviewMode,
		settings.ModalsShowColorChanges,
		settings.UpdatedAt,
	)
	if err != nil {
		return fmt.Errorf("exec update settings: %w", err)
	}
	return nil
}

func (r *Settings) Delete(ctx context.Context, userID uuid.UUID) error {
	_, err := r.pool.Exec(
		ctx,
		queryDeleteSettings,
		userID,
	)
	if err != nil {
		return err
	}
	return nil
}
