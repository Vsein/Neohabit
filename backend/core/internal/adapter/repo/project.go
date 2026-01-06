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
	// queryReadProject   = `SELECT * FROM projects WHERE id = $1`
	queryListProjects  = `SELECT * FROM projects WHERE user_id = $1`
	queryCreateProject = `
		INSERT INTO projects (id, user_id, name, description, color, habit_ids, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
	`
	queryUpdateProject = `UPDATE projects SET name = $2, description = $3, color = $4, updated_at = $5 WHERE id = $1`
	queryDeleteProject = `DELETE FROM projects WHERE id = $1`
	// queryDeleteProjectAndItsHabits = `DELETE FROM projects WHERE id = $1`
)

type Project struct {
	pool   db.PoolTX
	logger *zap.Logger
}

func NewProjectRepo(pool db.PoolTX, logger *zap.Logger) *Project {
	return &Project{
		pool:   pool,
		logger: logger,
	}
}

// List retrieves Projects of the logged in user from the database
func (r *Project) List(ctx context.Context, userID string) ([]*entity.Project, error) {
	var rows pgx.Rows
	var err error

	rows, err = r.pool.Query(ctx, queryListProjects, userID)

	if err != nil {
		return nil, fmt.Errorf("query list projects: %w", err)
	}
	defer rows.Close()

	var projects []*entity.Project
	for rows.Next() {
		var project entity.Project
		err := rows.Scan(
			&project.ID,
			&project.UserID,
			&project.Name,
			&project.Description,
			&project.Color,
			&project.HabitIDs,
			&project.CreatedAt,
			&project.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("scan project: %w", err)
		}
		projects = append(projects, &project)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows error: %w", err)
	}

	return projects, nil
}

func (r *Project) Create(ctx context.Context, project *entity.Project) error {
	_, err := r.pool.Exec(
		ctx,
		queryCreateProject,
		project.ID,
		project.UserID,
		project.Name,
		project.Description,
		project.Color,
		project.HabitIDs,
		project.CreatedAt,
		project.UpdatedAt,
	)
	if err != nil {
		// Check for unique constraint violation (duplicate name, etc.)
		// Adjust this based on your actual database constraints
		if db.IsUniqueViolation(err) {
			return repo.ErrAlreadyExists
		}
		return fmt.Errorf("exec create project: %w", err)
	}
	return nil
}

func (r *Project) Update(ctx context.Context, project *entity.Project) error {
	_, err := r.pool.Exec(
		ctx,
		queryUpdateProject,
		project.ID,
		project.Name,
		project.Description,
		project.Color,
		project.UpdatedAt,
	)
	if err != nil {
		return fmt.Errorf("exec update project: %w", err)
	}
	return nil
}

func (r *Project) Delete(ctx context.Context, id string) error {
	_, err := r.pool.Exec(
		ctx,
		queryDeleteProject,
		id,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return repo.ErrNotFound
		}
		return fmt.Errorf("exec delete project: %w", err)
	}
	return nil
}
