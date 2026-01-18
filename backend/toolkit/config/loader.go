package config

import (
	"fmt"
	"os"
	"regexp"

	"gopkg.in/yaml.v3"
)

var (
	// envVarRegex matches ${VAR:-default} or ${VAR} patterns
	envVarRegex = regexp.MustCompile(`\$\{([^}:]+)(?::-([^}]*))?\}`)
)

func Load(filename string, config interface{}) error {
	data, err := os.ReadFile(filename)
	if err != nil {
		return fmt.Errorf("failed to read config file %s: %w", filename, err)
	}

	// Expand environment variables
	expanded := expandEnvVars(string(data))

	// Unmarshal YAML into config struct
	if err := yaml.Unmarshal([]byte(expanded), config); err != nil {
		return fmt.Errorf("failed to unmarshal config: %w", err)
	}

	return nil
}

// expandEnvVars replaces all ${VAR:-default} or ${VAR} patterns in the YAML content
// with actual environment variable values or defaults.
func expandEnvVars(content string) string {
	return envVarRegex.ReplaceAllStringFunc(content, func(match string) string {
		// Extract the variable name and default value
		matches := envVarRegex.FindStringSubmatch(match)
		if len(matches) < 2 {
			return match
		}

		varName := matches[1]
		defaultValue := ""
		if len(matches) > 2 {
			defaultValue = matches[2]
		}

		// Get environment variable value
		envValue := os.Getenv(varName)
		if envValue != "" {
			return envValue
		}

		// Return default value if provided, otherwise return empty string
		return defaultValue
	})
}

func ExpandEnv(s string) string {
	return expandEnvVars(s)
}
