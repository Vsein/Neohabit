package entity

type Project struct {
	ID          string
	UserID      string
	Name        string
	Description string
	Color       string
	HabitIDs    []string
	CreatedAt   int64
	UpdatedAt   int64
}

type ProjectFilter struct {
	IDs []string
}
