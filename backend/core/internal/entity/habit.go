package entity

import "time"
import "github.com/google/uuid"

type Habit struct {
	ID          uuid.UUID
	UserID      uuid.UUID
	Name        string
	Description string
	Color       string
	Data        []HabitData
	Targets     []HabitTarget
	DueDate     *time.Time `json:"due_date"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
}

type HabitFilter struct {
	IDs []string
}

type HabitData struct {
	ID            uuid.UUID
	HabitID       uuid.UUID
	Date          time.Time
	Value         int
	Duration      *int64
	PauseDuration *int64
	CreatedAt     time.Time
	UpdatedAt     time.Time
}

type HabitTarget struct {
	ID          uuid.UUID
	HabitID     uuid.UUID
	DateStart   time.Time `json:"date_start"`
	DateEnd     time.Time `json:"date_end"`
	Value       int
	Period      int
	ValueUnit   string
	PeriodUnit  PeriodUnit
	IsASequence bool
	Sequence    []int
	IsArchiving bool
	IsNumeric   bool
	MoreIsBad   bool
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

type PeriodUnit uint8

const (
	Day PeriodUnit = iota
	Week
	Month
	Year
)

func (s PeriodUnit) String() string {
	switch s {
	case Day:
		return "day"
	case Week:
		return "week"
	case Month:
		return "month"
	case Year:
		return "year"
	default:
		return "day"
	}
}
