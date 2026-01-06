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
	// queryReadSkilltree   = `SELECT * FROM skilltrees WHERE id = $1`
	queryListSkilltrees  = `SELECT * FROM skilltrees WHERE user_id = $1`
	queryCreateSkilltree = `
		INSERT INTO skilltrees (id, user_id, name, description, color, skill_ids, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
	`
	queryUpdateSkilltree = `UPDATE skilltrees SET name = $2, description = $3, color = $4, updated_at = $5 WHERE id = $1`
	queryDeleteSkilltree = `DELETE FROM skilltrees WHERE id = $1`
	// queryDeleteSkilltreeAndItsHabits = `DELETE FROM skilltrees WHERE id = $1`
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

// List retrieves Skilltrees of the logged in user from the database
func (r *Skilltree) List(ctx context.Context, userID string) ([]*entity.Skilltree, error) {
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
			&skilltree.SkillIDs,
			&skilltree.Name,
			&skilltree.Description,
			&skilltree.Color,
			&skilltree.CreatedAt,
			&skilltree.UpdatedAt,
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
		skilltree.SkillIDs,
		skilltree.Name,
		skilltree.Description,
		skilltree.Color,
		skilltree.CreatedAt,
		skilltree.UpdatedAt,
	)
	if err != nil {
		// Check for unique constraint violation (duplicate name, etc.)
		// Adjust this based on your actual database constraints
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

func (r *Skilltree) Delete(ctx context.Context, id string) error {
	_, err := r.pool.Exec(
		ctx,
		queryDeleteSkilltree,
		id,
	)
	if err != nil {
		// Check for unique constraint violation (duplicate name, etc.)
		// Adjust this based on your actual database constraints
		if db.IsUniqueViolation(err) {
			return repo.ErrAlreadyExists
		}
		return fmt.Errorf("exec create skilltree: %w", err)
	}
	return nil
}
