package entity

import "time"
import "github.com/google/uuid"

type Skilltree struct {
	ID          uuid.UUID
	UserID      uuid.UUID
	ProjectID   *uuid.UUID
	HabitID     *uuid.UUID
	Name        string
	Description string
	Color       string
	SkillIDs    []uuid.UUID
	Skills      []Skill
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

type Skill struct {
	ID            uuid.UUID
	SkilltreeID   uuid.UUID
	ParentSkillID *uuid.UUID
	IsRootSkill   bool
	Name          string
	Description   string
	Status        SkillStatus
	Skills        []Skill
	CreatedAt     time.Time
	UpdatedAt     time.Time
}

type SkillStatus uint8

const (
	Idle SkillStatus = iota
	InProgress
	Completed
	Disregarded
)

func (s SkillStatus) String() string {
	switch s {
	case Idle:
		return "idle"
	case InProgress:
		return "in-progress"
	case Completed:
		return "completed"
	case Disregarded:
		return "disregarded"
	default:
		return "idle"
	}
}
