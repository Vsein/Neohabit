package entity

import "time"

type Skilltree struct {
	ID          string
	UserID      string
	ProjectID   string
	HabitID     string
	SkillIDs    []string
	Name        string
	Description string
	Color       string
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

type Skills struct {
	ID            string
	ParentSkillID string
	Name          string
	Description   string
	Status        string
	IsRootSkill   bool
	CreatedAt     time.Time
	UpdatedAt     time.Time
}
