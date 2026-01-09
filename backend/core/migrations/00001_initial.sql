-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT DEFAULT '',
    password TEXT NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    verification_attempts INTEGER NOT NULL DEFAULT 0,
    verification_time TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(username)
);

CREATE INDEX users_lower_username_idx ON users (LOWER(username));

CREATE TABLE IF NOT EXISTS habits (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT NOT NULL DEFAULT '#23BCDB',
    due_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS habit_data (
    id TEXT PRIMARY KEY,
    habit_id TEXT REFERENCES habits(id) ON DELETE CASCADE NOT NULL,
    date TIMESTAMPTZ NOT NULL,
    value INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(date)
);

CREATE TABLE IF NOT EXISTS habit_targets (
    id TEXT PRIMARY KEY,
    habit_id TEXT REFERENCES habits(id) ON DELETE CASCADE NOT NULL,
    date_start TEXT NOT NULL,
    date_end TEXT,
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
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(date_start)
);

CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT NOT NULL DEFAULT '#1D60C1',
    habit_ids_order TEXT[],
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
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

    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stopwatches (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    habit_id TEXT REFERENCES habits(id) ON DELETE SET NULL,
    is_initiated BOOLEAN DEFAULT FALSE,
    start_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    duration BIGINT DEFAULT 0,
    is_paused BOOLEAN DEFAULT TRUE,
    pause_duration BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skills (
    id TEXT PRIMARY KEY,
    parent_skill_id TEXT REFERENCES skills(id) ON DELETE CASCADE,
    is_root_skill BOOLEAN NOT NULL DEFAULT FALSE,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skilltrees (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
    habit_id TEXT REFERENCES habits(id) ON DELETE SET NULL,
    skill_ids TEXT[],
    name TEXT NOT NULL,
    description TEXT,
    color TEXT NOT NULL DEFAULT '#1D60C1',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    habit_id TEXT REFERENCES habits(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMPTZ,
    is_important BOOLEAN NOT NULL DEFAULT FALSE,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS skilltrees;
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS stopwatches;
DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS habit_targets;
DROP TABLE IF EXISTS habit_data;
DROP TABLE IF EXISTS habits;
DROP TABLE IF EXISTS users;
-- +goose StatementEnd
