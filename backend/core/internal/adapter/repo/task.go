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
	// queryReadTask   = `SELECT * FROM tasks WHERE id = $1`
	queryListTasks  = `SELECT * FROM tasks WHERE user_id = $1`
	queryCreateTask = `
		INSERT INTO tasks (id, user_id, name, description, color, habit_ids, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
	`
	queryUpdateTask = `UPDATE tasks SET name = $2, description = $3, color = $4, updated_at = $5 WHERE id = $1`
	queryDeleteTask = `DELETE FROM tasks WHERE id = $1`
	// queryDeleteTaskAndItsHabits = `DELETE FROM tasks WHERE id = $1`
)

type Task struct {
	pool   db.PoolTX
	logger *zap.Logger
}

func NewTaskRepo(pool db.PoolTX, logger *zap.Logger) *Task {
	return &Task{
		pool:   pool,
		logger: logger,
	}
}

// List retrieves Tasks of the logged in user from the database
func (r *Task) List(ctx context.Context, user_id string) ([]*entity.Task, error) {
	var rows pgx.Rows
	var err error

	rows, err = r.pool.Query(ctx, queryListTasks, user_id)

	if err != nil {
		return nil, fmt.Errorf("query list tasks: %w", err)
	}
	defer rows.Close()

	var tasks []*entity.Task
	for rows.Next() {
		var task entity.Task
		err := rows.Scan(
			&task.ID,
			&task.UserID,
			&task.HabitID,
			&task.Name,
			&task.Description,
			&task.DueDate,
			&task.IsImportant,
			&task.IsCompleted,
			&task.CreatedAt,
			&task.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("scan task: %w", err)
		}
		tasks = append(tasks, &task)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows error: %w", err)
	}

	return tasks, nil
}

func (r *Task) Create(ctx context.Context, task *entity.Task) error {
	_, err := r.pool.Exec(
		ctx,
		queryCreateTask,
		task.ID,
		task.UserID,
		task.HabitID,
		task.Name,
		task.Description,
		task.DueDate,
		task.IsImportant,
		task.IsCompleted,
		task.CreatedAt,
		task.UpdatedAt,
	)
	if err != nil {
		// Check for unique constraint violation (duplicate name, etc.)
		// Adjust this based on your actual database constraints
		if db.IsUniqueViolation(err) {
			return repo.ErrAlreadyExists
		}
		return fmt.Errorf("exec create task: %w", err)
	}
	return nil
}

func (r *Task) Update(ctx context.Context, task *entity.Task) error {
	_, err := r.pool.Exec(
		ctx,
		queryUpdateTask,
		task.ID,
		task.HabitID,
		task.Name,
		task.Description,
		task.DueDate,
		task.IsImportant,
		task.IsCompleted,
		task.UpdatedAt,
	)
	if err != nil {
		return fmt.Errorf("exec update task: %w", err)
	}
	return nil
}

func (r *Task) Delete(ctx context.Context, id string) error {
	_, err := r.pool.Exec(
		ctx,
		queryDeleteTask,
		id,
	)
	if err != nil {
		// Check for unique constraint violation (duplicate name, etc.)
		// Adjust this based on your actual database constraints
		if db.IsUniqueViolation(err) {
			return repo.ErrAlreadyExists
		}
		return fmt.Errorf("exec create task: %w", err)
	}
	return nil
}
