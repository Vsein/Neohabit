package entity

import "time"
import "github.com/google/uuid"

type Settings struct {
	ID                         uuid.UUID
	UserID                     uuid.UUID
	Theme                      *SettingsTheme
	ReadSettingsFromConfigFile *bool
	CellHeightMultiplier       *uint8
	CellWidthMultiplier        *uint8
	OverviewVertical           *bool
	OverviewCurrentDay         *SettingsHeatmapCurrentDay
	OverviewOffset             *uint8

	// Those three feel like such unintuitive features that I'm considering ditching them
	// I feel like it would be better to have a screen or something like that in the
	// Project/Habit overview to choose between month/year, and the custom number of days
	//
	// And save it in that menu if there's a ticked checkbox or smth similar
	OverviewDuration      *uint8 // Should i just ditch this one?
	OverviewApplyLimit    *bool
	OverviewDurationLimit *uint8

	AllowHorizontalScrolling *bool // Previously overview_adaptive, in case the chosen period overflows, it doesn't get cut off and instead turns on scrolling

	// Honestly those two are also cryptic. Perhaps choose between three styles?
	// 1. Year
	// 2. Year-end, the default in github where the current day is the last one
	// 3. Middle of the year, like the choice in the Anki heatmap
	// Because whatever I tried to do here previously is just such a bad choice that will
	// never get used anyway that I don't even want to release something like that
	// It's already possible, and would look more elegant in the frontend part as well
	HabitHeatmapsOverride   *bool
	HabitHeatmapsCurrentDay *SettingsHeatmapCurrentDay

	ShowStopwatchTimeInPageTitle *bool
	HideCellHint                 *bool
	HideOnboarding               *bool
	ProjectsEnableCustomOrder    *bool
	ProjectsEnableOverviewMode   *bool
	ModalsShowColorChanges       *bool
	CreatedAt                    time.Time
	UpdatedAt                    time.Time
}

type SettingsTheme uint8

const (
	Dark SettingsTheme = iota
	Light
)

func (s SettingsTheme) String() string {
	switch s {
	case Dark:
		return "dark"
	case Light:
		return "light"
	default:
		return "dark"
	}
}

type SettingsHeatmapCurrentDay uint8

const (
	End SettingsHeatmapCurrentDay = iota
	Middle
	Start
)

func (s SettingsHeatmapCurrentDay) String() string {
	switch s {
	case End:
		return "end"
	case Middle:
		return "middle"
	case Start:
		return "start"
	default:
		return "middle"
	}
}
