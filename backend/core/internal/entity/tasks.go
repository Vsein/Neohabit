package entity

type Task struct {
	ID          string
	UserID      string
	HabitID     string
	Name        string
	Description string
	DueDate     int64 // gonna leave int64 for now, as time.Time may be unreliable?
	IsImportant bool
	IsComlpeted bool
	CreatedAt   int64
	UpdatedAt   int64
}
