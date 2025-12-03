-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT,
    password TEXT NOT NULL,
    verified BOOLEAN,
    verification_attempts INTEGER NOT NULL DEFAULT 0,
    verification_time bigint,
    -- created_at bigint NOT NULL,
    -- updated_at bigint NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(username)
);

CREATE TABLE IF NOT EXISTS habits (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) NOT NULL, -- do i need it here?
    name TEXT NOT NULL,
    description TEXT,
    color TEXT NOT NULL DEFAULT '#23BCDB',
    due_date bigint,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT NOT NULL DEFAULT '#1D60C1',
    habit_ids_order TEXT[],
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- CREATE TABLE IF NOT EXISTS heatmaps (
--     id TEXT PRIMARY KEY,
--     user_id TEXT REFERENCES users(id) NOT NULL,
--     habit_id TEXT REFERENCES habits(id) NOT NULL,
--     created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
-- );

CREATE TABLE IF NOT EXISTS habit_data (
    id TEXT PRIMARY KEY,
    habit_id TEXT REFERENCES habits(id) NOT NULL,
    date TEXT NOT NULL,
    value INTEGER NOT NULL, -- smallint maybe?
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, -- honestly not sure
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, -- if those two need it
    UNIQUE(date) -- should I?
);

CREATE TABLE IF NOT EXISTS habit_targets (
    id TEXT PRIMARY KEY,
    habit_id TEXT REFERENCES habits(id) NOT NULL,
    date_start TEXT NOT NULL,
    date_end TEXT,
    value INTEGER NOT NULL,
    period INTEGER NOT NULL,
    is_sequential BOOLEAN NOT NULL DEFAULT FALSE,
    sequence INTEGER[],
    is_archive BOOLEAN NOT NULL DEFAULT FALSE,
    is_antihabit BOOLEAN NOT NULL DEFAULT FALSE,
    is_numeric BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, -- here it's fine I suppose
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(date_start) -- should I?
);

CREATE TABLE IF NOT EXISTS settings (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    theme TEXT NOT NULL DEFAULT 'dark',
    read_settings_from_config_file BOOLEAN NOT NULL DEFAULT FALSE,
    cell_height_multiplier SMALLINT,
    cell_width_multiplier SMALLINT,
    overview_vertical BOOLEAN,
    overview_current_day TEXT,
    overview_offset SMALLINT,
    allow_horizontal_scrolling BOOLEAN DEFAULT TRUE,
    hide_cell_hint BOOLEAN,
    hide_onboarding BOOLEAN,

    project_ids_order TEXT[],

    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stopwatches (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) NOT NULL,
    habit_id TEXT REFERENCES habits(id) NOT NULL,
    is_initiated BOOLEAN,
    start_time TIMESTAMPTZ,
    duration bigint,
    is_paused BOOLEAN,
    pause_duration bigint,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skills (
    id TEXT PRIMARY KEY,
    parent_skill_id TEXT REFERENCES skills(id),
    is_root_skill BOOLEAN NOT NULL DEFAULT FALSE,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skilltrees (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) NOT NULL,
    skill_ids TEXT[],
    name TEXT NOT NULL,
    color TEXT NOT NULL DEFAULT '#1D60C1',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) NOT NULL, -- do i need it here?
    habit_id TEXT REFERENCES habits(id) NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    due_date bigint,
    is_important BOOLEAN NOT NULL DEFAULT FALSE,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
-- CREATE TRIGGER mdt_moddatetime
--     BEFORE UPDATE ON mdt
--     FOR EACH ROW
--     EXECUTE PROCEDURE moddatetime (moddate);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS skilltrees;
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS stopwatches;
DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS habit_targets;
DROP TABLE IF EXISTS habit_data;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS habits;
DROP TABLE IF EXISTS users;
-- +goose StatementEnd
