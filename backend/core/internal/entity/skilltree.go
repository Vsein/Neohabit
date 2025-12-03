package entity

type Skilltree struct {
	ID        string
	UserID    string
	SkillIDs  []string
	Name      string
	Color     string
	CreatedAt int64
	UpdatedAt int64
}

type Skills struct {
	ID            string
	ParentSkillID string
	Name          string
	Description   string
	Status        string
	IsRootSkill   bool
	CreatedAt     int64
	UpdatedAt     int64
}
