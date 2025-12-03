package entity

type HeatmapData struct {
	HeatmapID string
	Date      int64 // consider putting here a string date
	Value     uint8
}

type HeatmapTarget struct {
	HeatmapID    string
	Date         int64 // here as well, also DateStart, DateEnd ?
	Value        uint8
	Period       uint8
	IsSequential bool
	Sequence     []uint8
	IsArchive    bool
	IsAntihabit  bool // More than specified = bad
	IsNumeric    bool
}
