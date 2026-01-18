package config

import (
	"fmt"
	"strings"
)

// LogLevel represents the logging level
type LogLevel int8

const (
	DebugLevel LogLevel = iota - 1
	InfoLevel
	WarnLevel
	ErrorLevel
	DPanicLevel
	PanicLevel
	FatalLevel
)

// UnmarshalYAML implements yaml.Unmarshaler for LogLevel
func (l *LogLevel) UnmarshalYAML(unmarshal func(any) error) error {
	var s string
	if err := unmarshal(&s); err != nil {
		return err
	}

	switch strings.ToLower(s) {
	case "debug":
		*l = DebugLevel
	case "info":
		*l = InfoLevel
	case "warn":
		*l = WarnLevel
	case "error":
		*l = ErrorLevel
	case "dpanic":
		*l = DPanicLevel
	case "panic":
		*l = PanicLevel
	case "fatal":
		*l = FatalLevel
	default:
		return fmt.Errorf("unknown log level: %s", s)
	}
	return nil
}

// LogConfig represents logging configuration
type LogConfig struct {
	Level            LogLevel `yaml:"level"`
	Format           string   `yaml:"format"`
	Output           string   `yaml:"output"`
	Encoding         string   `yaml:"encoding"`
	EncodingTime     string   `yaml:"encoding_time"`
	EncodingLevel    string   `yaml:"encoding_level"`
	EncodingCaller   string   `yaml:"encoding_caller"`
	EncodingDuration string   `yaml:"encoding_duration"`
}
