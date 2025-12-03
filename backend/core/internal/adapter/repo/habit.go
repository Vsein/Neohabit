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

// SQL queries for Habit operations
const (
	queryCreateHabit = `
		INSERT INTO habits (id, user_id, name, description, color, due_date, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
	`

	queryReadHabit = `
		SELECT id, name, description, created_at, updated_at
		FROM habits
		WHERE id = $1
	`

	queryListHabits = `
		SELECT id, name, description, created_at, updated_at
		FROM habits
	`

	queryListHabitsByIDs = `
		SELECT id, name, description, created_at, updated_at
		FROM habits
		WHERE id = ANY($1)
	`
)

// Habit implements the HabitRepo interface
type Habit struct {
	pool   db.PoolTX
	logger *zap.Logger
}

// NewHabit creates a new Habit repository instance
func NewHabit(pool db.PoolTX, logger *zap.Logger) *Habit {
	return &Habit{
		pool:   pool,
		logger: logger,
	}
}

// Create creates a new Habit in the database
func (r *Habit) Create(ctx context.Context, habit *entity.Habit) error {
	_, err := r.pool.Exec(
		ctx,
		queryCreateHabit,
		habit.ID,
		habit.Name,
		habit.Description,
		habit.CreatedAt,
		habit.UpdatedAt,
	)
	if err != nil {
		// Check for unique constraint violation (duplicate name, etc.)
		// Adjust this based on your actual database constraints
		if db.IsUniqueViolation(err) {
			return repo.ErrConflict
		}
		return fmt.Errorf("exec create habit: %w", err)
	}
	return nil
}

// Read retrieves an Habit by ID from the database
func (r *Habit) Read(ctx context.Context, id string) (*entity.Habit, error) {
	var habit entity.Habit
	err := r.pool.QueryRow(ctx, queryReadHabit, id).Scan(
		&habit.ID,
		&habit.Name,
		&habit.Description,
		&habit.CreatedAt,
		&habit.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, repo.ErrNotFound
		}
		return nil, fmt.Errorf("query row read habit: %w", err)
	}
	return &habit, nil
}

// List retrieves Habits based on filter criteria from the database
func (r *Habit) List(ctx context.Context, filter entity.HabitFilter) ([]*entity.Habit, error) {
	var rows pgx.Rows
	var err error

	// Apply filters
	if len(filter.IDs) > 0 {
		rows, err = r.pool.Query(ctx, queryListHabitsByIDs, filter.IDs)
	} else {
		rows, err = r.pool.Query(ctx, queryListHabits)
	}

	if err != nil {
		return nil, fmt.Errorf("query list habits: %w", err)
	}
	defer rows.Close()

	var habits []*entity.Habit
	for rows.Next() {
		var habit entity.Habit
		err := rows.Scan(
			&habit.ID,
			&habit.Name,
			&habit.Description,
			&habit.CreatedAt,
			&habit.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("scan habit: %w", err)
		}
		habits = append(habits, &habit)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows error: %w", err)
	}

	return habits, nil
}
