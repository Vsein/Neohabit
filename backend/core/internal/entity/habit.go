package entity

import "time"

type Habit struct {
	ID          string
	UserID      string
	Name        string
	Description string
	Color       string
	Data        []HabitData
	Targets     []HabitTarget
	DueDate     time.Time
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

type HabitFilter struct {
	IDs []string
}

type HabitData struct {
	ID        string
	Date      time.Time
	Value     int
	CreatedAt time.Time
	UpdatedAt time.Time
}

type HabitTarget struct {
	ID          string
	DateStart   time.Time
	DateEnd     time.Time
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
