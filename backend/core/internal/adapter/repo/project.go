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
	queryListProjects           = `SELECT * FROM projects WHERE user_id = $1`
	queryListProjectsWithHabits = `
		SELECT
			p.id,
			p.user_id,
			p.name,
			p.description,
			p.color,
			p.order_index,
			p.created_at,
			p.updated_at,
			COALESCE(
				(SELECT jsonb_agg(
					jsonb_build_object(
						'id', h.id,
						'name', h.name,
						'description', h.description,
						'color', h.color,
						'due_date', to_char(h.due_date, 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
						'created_at', h.created_at,
						'updated_at', h.updated_at,
						'order_index', ph.order_index
					) ORDER BY ph.order_index)
					FROM
						project_habits ph
					JOIN
						habits h ON h.id = ph.habit_id
					WHERE
						h.user_id = $1 AND ph.project_id = p.id
				),
				'[]'::jsonb
			) AS habits
		FROM
			projects p
		WHERE
			p.user_id = $1
		ORDER BY
			p.order_index
	`
	queryCreateProject = `
		INSERT INTO projects (id, user_id, name, description, color, created_at, updated_at, order_index)
		SELECT $1, $2, $3, $4, $5, $6, $7, COALESCE(MAX(order_index), 0) + 1
		FROM projects
	`
	queryCreateProjectHabitsOrder = `
		INSERT INTO project_habits (project_id, habit_id, order_index)
		SELECT $1, hi.habit_id, hi.order_index
		FROM (
			SELECT
				unnest($2::text[]) AS habit_id,
				generate_series(1, cardinality($2)) AS order_index
		) hi
	`
	queryAddHabitsToProject = `
		WITH max_order AS (
			SELECT COALESCE(MAX(order_index), 0) AS max_order_index
			FROM project_habits
			WHERE project_id = $1
		)
		INSERT INTO project_habits (project_id, habit_id, order_index)
		SELECT $1, habit_id, max_order_index + row_number() OVER (ORDER BY habit_id)
		FROM unnest($2::text[]) AS habit_id, max_order
	`
	queryUpdateProject = `
		UPDATE projects
		SET
			name = coalesce($2,name),
			description = coalesce($3,description),
			color = coalesce($4,color),
			order_index = coalesce($5,order_index),
			updated_at = $6
		WHERE id = $1
	`
	queryUpdateProjectsOrder = `
		UPDATE projects p
		SET order_index = pi.ordinality - 1
		FROM unnest($1::text[]) WITH ORDINALITY AS pi(project_id, ordinality)
		WHERE p.id = pi.project_id;
	`
	queryRemoveProjectHabitsRelations = `
		DELETE FROM project_habits
		WHERE project_id = $1
			AND habit_id NOT IN (SELECT unnest($2::text[]))
	`
	queryUpdateProjectHabitsOrder = `
		INSERT INTO project_habits (project_id, habit_id, order_index)
		SELECT $1, hi.habit_id, hi.order_index
		FROM (
			SELECT
				unnest($2::text[]) AS habit_id,
				generate_series(1, cardinality($2)) AS order_index
		) hi
		ON CONFLICT (project_id, habit_id) DO UPDATE
		SET order_index = EXCLUDED.order_index
	`
	queryDeleteProject = `DELETE FROM projects WHERE id = $1`
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

	rows, err = r.pool.Query(ctx, queryListProjectsWithHabits, userID)

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
			&project.OrderIndex,
			&project.CreatedAt,
			&project.UpdatedAt,
			&project.Habits,
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
		project.CreatedAt,
		project.UpdatedAt,
	)
	if err != nil {
		if db.IsUniqueViolation(err) {
			return repo.ErrAlreadyExists
		}
		return fmt.Errorf("exec create project: %w", err)
	}

	_, err = r.pool.Exec(
		ctx,
		queryCreateProjectHabitsOrder,
		project.ID,
		project.HabitIDs,
	)
	if err != nil {
		return fmt.Errorf("exec create project habits order: %w", err)
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
		project.OrderIndex,
		project.UpdatedAt,
	)
	if err != nil {
		return fmt.Errorf("exec update project: %w", err)
	}

	_, err = r.pool.Exec(
		ctx,
		queryRemoveProjectHabitsRelations,
		project.ID,
		project.HabitIDs,
	)
	if err != nil {
		return fmt.Errorf("exec remove project habits order: %w", err)
	}

	_, err = r.pool.Exec(
		ctx,
		queryUpdateProjectHabitsOrder,
		project.ID,
		project.HabitIDs,
	)
	if err != nil {
		return fmt.Errorf("exec update project habits order: %w", err)
	}
	return nil
}

func (r *Project) UpdateProjectsOrder(ctx context.Context, newProjectsOrder []string) error {
	_, err := r.pool.Exec(
		ctx,
		queryUpdateProjectsOrder,
		newProjectsOrder,
	)
	if err != nil {
		return fmt.Errorf("exec update projects order: %w", err)
	}

	return nil
}

func (r *Project) AddHabitsToProject(ctx context.Context, projectID string, habitIDs []string) error {
	_, err := r.pool.Exec(
		ctx,
		queryAddHabitsToProject,
		projectID,
		habitIDs,
	)
	if err != nil {
		return fmt.Errorf("exec insert new habits to projects: %w", err)
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
