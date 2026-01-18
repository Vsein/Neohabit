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
	queryCreateSkill = `
		INSERT INTO skills (id, skilltree_id, parent_skill_id, is_root_skill, name, description, status, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
	`
	queryUpdateSkill = `
		UPDATE skills
		SET
			parent_skill_id = coalesce($2,parent_skill_id),
			name = coalesce($3,name),
			description = coalesce($4,description),
			status = coalesce($5,status),
			updated_at = $6
		WHERE id = $1`
	queryDeleteSkill = `DELETE FROM skills WHERE id = $1`
)

type Skill struct {
	pool   db.PoolTX
	logger *zap.Logger
}

func NewSkillRepo(pool db.PoolTX, logger *zap.Logger) *Skill {
	return &Skill{
		pool:   pool,
		logger: logger,
	}
}

func (r *Skill) Create(ctx context.Context, skill *entity.Skill) error {
	_, err := r.pool.Exec(
		ctx,
		queryCreateSkill,
		skill.ID,
		skill.SkilltreeID,
		skill.ParentSkillID,
		skill.IsRootSkill,
		skill.Name,
		skill.Description,
		skill.Status,
		skill.CreatedAt,
		skill.UpdatedAt,
	)
	if err != nil {
		if db.IsUniqueViolation(err) {
			return repo.ErrAlreadyExists
		}
		return fmt.Errorf("exec create skill: %w", err)
	}
	return nil
}

func (r *Skill) Update(ctx context.Context, skill *entity.Skill) error {
	_, err := r.pool.Exec(
		ctx,
		queryUpdateSkill,
		skill.ID,
		skill.ParentSkillID,
		skill.Name,
		skill.Description,
		skill.Status,
		skill.UpdatedAt,
	)
	if err != nil {
		return fmt.Errorf("exec update skill: %w", err)
	}
	return nil
}

func (r *Skill) Delete(ctx context.Context, id uuid.UUID) error {
	_, err := r.pool.Exec(
		ctx,
		queryDeleteSkill,
		id,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return repo.ErrNotFound
		}
		return fmt.Errorf("exec delete skill: %w", err)
	}
	return nil
}
