package config

import (
	"time"
)

// Config represents the application configuration
type Config struct {
	PGConfig  PGConfig  `yaml:"pg"`
	LogConfig LogConfig `yaml:"log"`
	Address   string    `yaml:"address"`
}

// PGConfig represents PostgreSQL configuration
type PGConfig struct {
	DSN          string        `yaml:"dsn"`
	MaxOpenConns int32         `yaml:"max_open_conns"`
	MaxLifetime  time.Duration `yaml:"max_lifetime"`
	MaxIdleTime  time.Duration `yaml:"max_idle_time"`
}

// LogConfig represents logging configuration
type LogConfig struct {
	Level int8 `yaml:"level"` // -1: Debug, 0: Info, 1: Warn, 2: Error
}

