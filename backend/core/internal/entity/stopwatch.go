package entity

type Stopwatch struct {
	ID          string
	UserID      string
	HabitID     string
	IsInitiated bool
	// StartTime	time.Time
	StartTime     int64
	Duration      int64
	IsPaused      bool
	PauseDuration int64
	CreatedAt     int64
	UpdatedAt     int64
}
