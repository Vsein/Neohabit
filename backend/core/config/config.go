package config

import (
	"time"

	"neohabit/toolkit/config"
)

type Config struct {
	PGConfig    PGConfig         `yaml:"pg"`
	LogConfig   config.LogConfig `yaml:"log"`
	Address     string           `yaml:"address"`
	FrontendURL string           `yaml:"frontend_url"`
}

// PostgreSQL configuration
type PGConfig struct {
	DSN          string        `yaml:"dsn"`
	MaxOpenConns int32         `yaml:"max_open_conns"`
	MaxLifetime  time.Duration `yaml:"max_lifetime"`
	MaxIdleTime  time.Duration `yaml:"max_idle_time"`
}
