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
	// queryReadHabit   = `SELECT * FROM habits WHERE id = $1`
	queryListHabits = `
		SELECT *
		FROM
			habits h
			LEFT JOIN (
				SELECT hd.habit_id as id, array_agg(array[date, created_at, updated_at]) as data
				FROM habit_data hd
				GROUP BY hd.habit_id
			) hd USING (id)
		WHERE h.user_id = $1
		ORDER BY h.created_at
	`
	queryCreateHabit = `
		INSERT INTO habits (id, user_id, name, description, color, due_date, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
	`
	queryUpdateHabit  = `UPDATE habits SET name = $2, description = $3, color = $4, updated_at = $5 WHERE id = $1`
	queryDeleteHabit  = `DELETE FROM habits WHERE id = $1`
	queryDeleteHabit2 = `DELETE FROM habits WHERE id = $1; UPDATE projects SET habit_ids_order = array_remove(habit_ids_order, $1)`
)

type Habit struct {
	pool   db.PoolTX
	logger *zap.Logger
}

func NewHabitRepo(pool db.PoolTX, logger *zap.Logger) *Habit {
	return &Habit{
		pool:   pool,
		logger: logger,
	}
}

// XXX: Unneccessary, thus untested and unused
// func (r *Habit) Read(ctx context.Context, id string) (*entity.Habit, error) {
// 	var habit entity.Habit
// 	err := r.pool.QueryRow(ctx, queryReadHabit, id).Scan(
// 		&habit.ID,
// 		&habit.UserID,
// 		&habit.Name,
// 		&habit.Description,
// 		&habit.Color,
// 		&habit.DueDate,
// 		&habit.CreatedAt,
// 		&habit.UpdatedAt,
// 	)
// 	if err != nil {
// 		if errors.Is(err, pgx.ErrNoRows) {
// 			return nil, repo.ErrNotFound
// 		}
// 		return nil, fmt.Errorf("query row read habit: %w", err)
// 	}
// 	return &habit, nil
// }

// List retrieves Habits of the logged in user from the database
func (r *Habit) List(ctx context.Context, userID string) ([]*entity.Habit, error) {
	var rows pgx.Rows
	var err error

	rows, err = r.pool.Query(ctx, queryListHabits, userID)

	if err != nil {
		return nil, fmt.Errorf("query list habits: %w", err)
	}
	defer rows.Close()

	var habits []*entity.Habit
	for rows.Next() {
		var habit entity.Habit
		err := rows.Scan(
			&habit.ID,
			&habit.UserID,
			&habit.Name,
			&habit.Description,
			&habit.Color,
			&habit.DueDate,
			&habit.CreatedAt,
			&habit.UpdatedAt,
			&habit.Data,
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

func (r *Habit) Create(ctx context.Context, habit *entity.Habit) error {
	_, err := r.pool.Exec(
		ctx,
		queryCreateHabit,
		habit.ID,
		habit.UserID,
		habit.Name,
		habit.Description,
		habit.Color,
		habit.DueDate,
		habit.CreatedAt,
		habit.UpdatedAt,
	)
	if err != nil {
		// Check for unique constraint violation (duplicate name, etc.)
		// Adjust this based on your actual database constraints
		if db.IsUniqueViolation(err) {
			return repo.ErrAlreadyExists
		}
		return fmt.Errorf("exec create habit: %w", err)
	}
	return nil
}

func (r *Habit) Update(ctx context.Context, habit *entity.Habit) error {
	_, err := r.pool.Exec(
		ctx,
		queryUpdateHabit,
		habit.ID,
		habit.Name,
		habit.Description,
		habit.Color,
		habit.UpdatedAt,
	)
	if err != nil {
		return fmt.Errorf("exec update habit: %w", err)
	}
	return nil
}

func (r *Habit) Delete(ctx context.Context, id string) error {
	_, err := r.pool.Exec(
		ctx,
		queryDeleteHabit2,
		id,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return repo.ErrNotFound
		}
		return fmt.Errorf("exec delete habit: %w", err)
	}
	return nil
}
