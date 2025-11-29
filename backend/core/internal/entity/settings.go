package entity

type Settings struct {
	ID          string
	UserID      string
	Theme       string
	ReadSettingsFromConfigFile bool
	CellHeightMultiplier uint8
	CellWidthMultiplier  uint8
	OverviewVertical  bool
	OverviewVertical  bool
	Overview  bool
	Color       string
	ShowStopwatchTimeInPageTitle    bool
	HideCellHint    bool
	HideOnboarding    bool
	CreatedAt   int64
	UpdatedAt   int64
}

type ProjectFilter struct {
	IDs []string
}
