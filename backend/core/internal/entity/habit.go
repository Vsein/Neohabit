package entity

// Habit represents the core domain entity
// This is a pure Go struct with no external dependencies
type Habit struct {
	ID          string
	UserID      string
	Name        string
	Description string
	Color       string
	DueDate     int64 // gonna leave int64 for now, as time.Time may be unreliable?
	CreatedAt   int64
	UpdatedAt   int64
}

// HabitFilter represents filter criteria for querying Habits
type HabitFilter struct {
	IDs []string
}
