package handler

import (
	"neohabit/core/internal/entity"
	"neohabit/core/internal/input/http/gen"
)

func toAPIUser(e *entity.User) gen.User {
	return gen.User{
		ID:                   e.ID,
		Username:             e.Username,
		Verified:             &e.Verified,
		VerificationAttempts: &e.VerificationAttempts,
		VerificationTime:     &e.VerificationTime,
		CreatedAt:            &e.CreatedAt,
		UpdatedAt:            &e.UpdatedAt,
	}
}

func toAPIHabit(e *entity.Habit) gen.Habit {
	data := make([]gen.HabitData, 0, len(e.Data))
	for _, datum := range e.Data {
		data = append(data, gen.HabitData{
			Date:  datum.Date,
			Value: datum.Value,
		})
	}

	targets := make([]gen.HabitTarget, 0, len(e.Targets))
	for _, target := range e.Targets {
		targets = append(targets, gen.HabitTarget{
			DateStart: target.DateStart,
			Value:     target.Value,
			Period:    target.Period,
		})
	}

	return gen.Habit{
		ID:              e.ID,
		UserID:          e.UserID,
		Name:            e.Name,
		Description:     &e.Description,
		Color:           &e.Color,
		DueDate:         e.DueDate,
		IsNumeric:       e.IsNumeric,
		IsMonochromatic: e.IsMonochromatic,
		MoreIsBad:       e.MoreIsBad,
		CreatedAt:       &e.CreatedAt,
		UpdatedAt:       &e.UpdatedAt,
		Data:            &data,
		Targets:         &targets,
	}
}

func toAPIProject(e *entity.Project) gen.Project {
	habits := make([]gen.Habit, 0, len(e.Habits))
	for _, habit := range e.Habits {
		habits = append(habits, toAPIHabit(&habit))
	}

	return gen.Project{
		ID:          e.ID,
		UserID:      e.UserID,
		Name:        e.Name,
		Description: e.Description,
		Color:       e.Color,
		OrderIndex:  e.OrderIndex,
		HabitIds:    &e.HabitIDs,
		Habits:      &habits,
		CreatedAt:   &e.CreatedAt,
		UpdatedAt:   &e.UpdatedAt,
	}
}

func toAPITask(e *entity.Task) gen.Task {
	return gen.Task{
		ID:          e.ID,
		UserID:      e.UserID,
		HabitID:     e.HabitID,
		Name:        e.Name,
		Description: e.Description,
		DueDate:     e.DueDate,
		IsImportant: e.IsImportant,
		IsCompleted: e.IsCompleted,
		CreatedAt:   &e.CreatedAt,
		UpdatedAt:   &e.UpdatedAt,
	}
}

func toAPISkill(e *entity.Skill) gen.Skill {
	skills := make([]gen.Skill, 0, len(e.Skills))
	for _, skill := range e.Skills {
		skills = append(skills, toAPISkill(&skill))
	}

	status := gen.SkillStatus(e.Status.String())

	return gen.Skill{
		ID:            e.ID,
		SkilltreeID:   &e.SkilltreeID,
		ParentSkillID: e.ParentSkillID,
		IsRootSkill:   e.IsRootSkill,
		Name:          e.Name,
		Description:   e.Description,
		Status:        &status,
		Skills:        &skills,
		CreatedAt:     &e.CreatedAt,
		UpdatedAt:     &e.UpdatedAt,
	}
}

func toEntitySkillStatus(skillStatus *gen.SkillStatus) *entity.SkillStatus {
	entitySkillStatus := entity.SkillStatus(map[gen.SkillStatus]int{
		"idle":        0,
		"in-progress": 1,
		"completed":   2,
		"disregarded": 3,
	}[*skillStatus])
	return &entitySkillStatus
}

func toAPISkilltree(e *entity.Skilltree) gen.Skilltree {
	skills := make([]gen.Skill, 0, len(e.Skills))
	for _, skill := range e.Skills {
		skills = append(skills, toAPISkill(&skill))
	}

	return gen.Skilltree{
		ID:          e.ID,
		UserID:      e.UserID,
		ProjectID:   e.HabitID,
		HabitID:     e.HabitID,
		Name:        e.Name,
		Description: e.Description,
		Color:       &e.Color,
		Skills:      &skills,
		CreatedAt:   &e.CreatedAt,
		UpdatedAt:   &e.UpdatedAt,
	}
}

func toAPIStopwatch(e *entity.Stopwatch) gen.Stopwatch {
	return gen.Stopwatch{
		ID:            e.ID,
		UserID:        e.UserID,
		HabitID:       e.HabitID,
		IsInitiated:   e.IsInitiated,
		StartTime:     e.StartTime,
		Duration:      e.Duration,
		IsPaused:      e.IsPaused,
		PauseDuration: e.PauseDuration,
		CreatedAt:     &e.CreatedAt,
		UpdatedAt:     &e.UpdatedAt,
	}
}

func toAPISettings(e *entity.Settings) gen.Settings {
	theme := gen.SettingsTheme(e.Theme.String())
	overviewCurrentDay := gen.SettingsOverviewCurrentDay(e.OverviewCurrentDay.String())
	habitHeatmapsCurrentDay := gen.SettingsHabitHeatmapsCurrentDay(e.HabitHeatmapsCurrentDay.String())

	return gen.Settings{
		ID:                           e.ID,
		UserID:                       e.UserID,
		Theme:                        &theme,
		ReadSettingsFromConfigFile:   e.ReadSettingsFromConfigFile,
		CellHeightMultiplier:         e.CellHeightMultiplier,
		CellWidthMultiplier:          e.CellWidthMultiplier,
		OverviewVertical:             e.OverviewVertical,
		OverviewCurrentDay:           &overviewCurrentDay,
		OverviewOffset:               e.OverviewOffset,
		OverviewDuration:             e.OverviewDuration,
		OverviewApplyLimit:           e.OverviewApplyLimit,
		OverviewDurationLimit:        e.OverviewDurationLimit,
		AllowHorizontalScrolling:     e.AllowHorizontalScrolling,
		HabitHeatmapsOverride:        e.HabitHeatmapsOverride,
		HabitHeatmapsCurrentDay:      &habitHeatmapsCurrentDay,
		ShowStopwatchTimeInPageTitle: e.ShowStopwatchTimeInPageTitle,
		HideCellHint:                 e.HideCellHint,
		HideOnboarding:               e.HideOnboarding,
		ProjectsEnableCustomOrder:    e.ProjectsEnableCustomOrder,
		ProjectsEnableOverviewMode:   e.ProjectsEnableOverviewMode,
		ModalsShowColorChanges:       e.ModalsShowColorChanges,
		CreatedAt:                    &e.CreatedAt,
		UpdatedAt:                    &e.UpdatedAt,
	}
}
