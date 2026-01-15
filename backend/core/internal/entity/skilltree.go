package entity

import "time"
import "github.com/google/uuid"

type Skilltree struct {
	ID          uuid.UUID
	UserID      uuid.UUID
	ProjectID   *uuid.UUID
	HabitID     *uuid.UUID
	SkillIDs    []string
	Name        string
	Description string
	Color       string
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

type Skills struct {
	ID            *uuid.UUID
	ParentSkillID *uuid.UUID
	Name          string
	Description   string
	Status        string
	IsRootSkill   bool
	CreatedAt     time.Time
	UpdatedAt     time.Time
}
