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
	queryListSkilltrees = `
		SELECT
			st.id,
			st.user_id,
			st.project_id,
			st.habit_id,
			st.name,
			st.description,
			st.color,
			st.created_at,
			st.updated_at,
			jsonb_agg(
				jsonb_build_object(
					'id', s.id,
					'parent_skill_id', s.parent_skill_id,
					'is_root_skill', s.is_root_skill,
					'name', s.name,
					'description', s.description,
					'status', s.status
				) ORDER BY s.created_at
			) AS skills
		FROM skilltrees st
		JOIN skills s ON s.skilltree_id = st.id
		WHERE user_id = $1
		GROUP BY st.id;
	`
	queryCreateSkilltree = `
		INSERT INTO skilltrees (id, user_id, project_id, habit_id, name, description, color, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
	`
	queryUpdateSkilltree = `
		UPDATE skilltrees
		SET
			name = $2,
			description = $3,
			color = $4,
			updated_at = $5
		WHERE id = $1`
	queryDeleteSkilltree = `DELETE FROM skilltrees WHERE id = $1`
)

type Skilltree struct {
	pool   db.PoolTX
	logger *zap.Logger
}

func NewSkilltreeRepo(pool db.PoolTX, logger *zap.Logger) *Skilltree {
	return &Skilltree{
		pool:   pool,
		logger: logger,
	}
}

func (r *Skilltree) List(ctx context.Context, userID uuid.UUID) ([]*entity.Skilltree, error) {
	var rows pgx.Rows
	var err error

	rows, err = r.pool.Query(ctx, queryListSkilltrees, userID)

	if err != nil {
		return nil, fmt.Errorf("query list skilltrees: %w", err)
	}
	defer rows.Close()

	var skilltrees []*entity.Skilltree
	for rows.Next() {
		var skilltree entity.Skilltree
		err := rows.Scan(
			&skilltree.ID,
			&skilltree.UserID,
			&skilltree.ProjectID,
			&skilltree.HabitID,
			&skilltree.Name,
			&skilltree.Description,
			&skilltree.Color,
			&skilltree.CreatedAt,
			&skilltree.UpdatedAt,
			&skilltree.Skills,
		)
		if err != nil {
			return nil, fmt.Errorf("scan skilltree: %w", err)
		}
		skilltrees = append(skilltrees, &skilltree)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows error: %w", err)
	}

	return skilltrees, nil
}

func (r *Skilltree) Create(ctx context.Context, skilltree *entity.Skilltree) error {
	_, err := r.pool.Exec(
		ctx,
		queryCreateSkilltree,
		skilltree.ID,
		skilltree.UserID,
		skilltree.ProjectID,
		skilltree.HabitID,
		skilltree.Name,
		skilltree.Description,
		skilltree.Color,
		skilltree.CreatedAt,
		skilltree.UpdatedAt,
	)
	if err != nil {
		if db.IsUniqueViolation(err) {
			return repo.ErrAlreadyExists
		}
		return fmt.Errorf("exec create skilltree: %w", err)
	}
	return nil
}

func (r *Skilltree) Update(ctx context.Context, skilltree *entity.Skilltree) error {
	_, err := r.pool.Exec(
		ctx,
		queryUpdateSkilltree,
		skilltree.ID,
		skilltree.Name,
		skilltree.Description,
		skilltree.Color,
		skilltree.UpdatedAt,
	)
	if err != nil {
		return fmt.Errorf("exec update skilltree: %w", err)
	}
	return nil
}

func (r *Skilltree) Delete(ctx context.Context, id uuid.UUID) error {
	_, err := r.pool.Exec(
		ctx,
		queryDeleteSkilltree,
		id,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return repo.ErrNotFound
		}
		return fmt.Errorf("exec delete skilltree: %w", err)
	}
	return nil
}
