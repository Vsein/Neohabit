package entity

type Heatmap struct {
	ID          string
	UserID      string
	HabitID     string
	Data        []HeatmapData
	Targets     []HeatmapTarget
	CreatedAt   int64
	UpdatedAt   int64
}

type HeatmapData struct {
	Date        int64 // consider putting here a string date
	Value       uint8
}

type HeatmapTarget struct {
	Date        int64 // here as well
	// DateStart, DateEnd ?
	Value       uint8
	Period      uint8
	// Periodic targets?
	IsArchive   bool
}
