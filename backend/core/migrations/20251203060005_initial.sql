-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT DEFAULT '',
    password TEXT NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    verification_attempts INTEGER NOT NULL DEFAULT 0,
    verification_time TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX ux_users_lower_username ON users(LOWER(username));

CREATE TABLE IF NOT EXISTS habits (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT NOT NULL DEFAULT '#23BCDB',
    due_date TIMESTAMPTZ,
    is_numeric BOOLEAN DEFAULT FALSE,
    more_is_bad BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_habits_created_at ON habits(created_at);

CREATE TABLE IF NOT EXISTS habit_data (
    id UUID PRIMARY KEY,
    habit_id UUID REFERENCES habits(id) ON DELETE CASCADE NOT NULL,
    date TIMESTAMPTZ NOT NULL,
    value INTEGER NOT NULL,
    duration BIGINT,
    pause_duration BIGINT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_habit_data_habit_id_date ON habit_data(habit_id, date);

CREATE OR REPLACE FUNCTION get_habit_data_jsonb(h_id UUID)
RETURNS jsonb
LANGUAGE sql
STABLE
AS $$
SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
        'id', hd.id,
        'date', hd.date,
        'value', hd.value,
        'duration', hd.duration,
        'pause_duration', hd.pause_duration,
        'created_at', hd.created_at,
        'updated_at', hd.updated_at
    ) ORDER BY hd.date), '[]'::jsonb)
FROM habit_data hd
WHERE hd.habit_id = h_id;
$$;

CREATE TABLE IF NOT EXISTS habit_targets (
    id UUID PRIMARY KEY,
    habit_id UUID REFERENCES habits(id) ON DELETE CASCADE NOT NULL,
    date_start TIMESTAMPTZ NOT NULL,
    date_end TIMESTAMPTZ,
    value INTEGER NOT NULL,
    period INTEGER NOT NULL,
    -- period_unit ? m y d - if you want it to happen EXACTLY on 17th of the month
    -- fractions are prohibited by the period
    is_a_sequence BOOLEAN NOT NULL DEFAULT FALSE,
    sequence INTEGER[],
    is_archiving BOOLEAN NOT NULL DEFAULT FALSE,
    is_numeric BOOLEAN NOT NULL DEFAULT FALSE,
    more_is_bad BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- TODO: UNIQUE, maybe ? Or just allow it and show those targets as inactive? The latter is probably easier
CREATE INDEX idx_habit_targets_habit_id_date_start ON habit_targets(habit_id, date_start);

CREATE OR REPLACE FUNCTION get_habit_targets_jsonb(h_id UUID)
RETURNS jsonb
LANGUAGE sql
STABLE
AS $$
SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
        'id', ht.id,
        'date_start', ht.date_start,
        'value', ht.value,
        'period', ht.period,
        'created_at', ht.created_at,
        'updated_at', ht.updated_at
    ) ORDER BY ht.date_start), '[]'::jsonb)
FROM habit_targets ht
WHERE ht.habit_id = h_id;
$$;

CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT NOT NULL DEFAULT '#1D60C1',
    order_index INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS project_habits (
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    habit_id UUID REFERENCES habits(id) ON DELETE CASCADE NOT NULL,
    order_index INT NOT NULL,
    PRIMARY KEY (project_id, habit_id)
);

CREATE INDEX idx_project_habits_project_id_order_index ON project_habits(project_id, order_index);

CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    theme SMALLINT NOT NULL DEFAULT 0,
    read_settings_from_config_file BOOLEAN NOT NULL DEFAULT FALSE,
    cell_height_multiplier SMALLINT DEFAULT 1,
    cell_width_multiplier SMALLINT DEFAULT 1,
    overview_vertical BOOLEAN DEFAULT FALSE,
    overview_current_day SMALLINT NOT NULL DEFAULT 1,
    overview_offset SMALLINT DEFAULT 0,
    overview_duration SMALLINT DEFAULT 45,
    overview_apply_limit BOOLEAN DEFAULT FALSE,
    overview_duration_limit SMALLINT DEFAULT 45,
    allow_horizontal_scrolling BOOLEAN DEFAULT TRUE,
    habit_heatmaps_override BOOLEAN DEFAULT FALSE,
    habit_heatmaps_current_day SMALLINT NOT NULL DEFAULT 1,
    show_stopwatch_time_in_page_title BOOLEAN DEFAULT TRUE,
    hide_cell_hint BOOLEAN DEFAULT FALSE,
    hide_onboarding BOOLEAN DEFAULT FALSE,

    projects_enable_custom_order BOOLEAN DEFAULT TRUE,
    projects_enable_overview_mode BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stopwatches (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    habit_id UUID REFERENCES habits(id) ON DELETE SET NULL,
    is_initiated BOOLEAN DEFAULT FALSE,
    start_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    duration BIGINT DEFAULT 0,
    is_paused BOOLEAN DEFAULT TRUE,
    pause_duration BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skilltrees (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    habit_id UUID REFERENCES habits(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT NOT NULL DEFAULT '#1D60C1',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY,
    skilltree_id UUID REFERENCES skilltrees(id) ON DELETE CASCADE NOT NULL,
    parent_skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    is_root_skill BOOLEAN NOT NULL DEFAULT FALSE,
    name TEXT,
    description TEXT,
    status SMALLINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_skills_skilltree_id_parent_skill_id ON skills(skilltree_id, parent_skill_id);

CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    habit_id UUID REFERENCES habits(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMPTZ,
    is_important BOOLEAN DEFAULT FALSE,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS skilltrees;
DROP TABLE IF EXISTS stopwatches;
DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS project_habits;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS habit_targets;
DROP FUNCTION IF EXISTS get_habit_targets_jsonb(TEXT);
DROP TABLE IF EXISTS habit_data;
DROP FUNCTION IF EXISTS get_habit_data_jsonb(TEXT);
DROP TABLE IF EXISTS habits;
DROP TABLE IF EXISTS users;
-- +goose StatementEnd
