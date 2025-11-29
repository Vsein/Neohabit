package main

import (
	"flag"
	"fmt"
	"os"

	"neohabit/core/app"
	"neohabit/core/config"
	configLoader "neohabit/toolkit/config"
)

func main() {
	// Define command-line flag for config file
	configFile := flag.String("config", "", "Path to configuration file (YAML)")
	flag.Parse()

	if configFile == nil || *configFile == "" {
		fmt.Fprintf(os.Stderr, "Error: config file is required\n")
		fmt.Fprintf(os.Stderr, "Usage: %s -config <config-file.yaml>\n", os.Args[0])
		os.Exit(1)
	}

	// Load configuration from file
	cfg, err := loadConfigFromFile(*configFile)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error: loading config from file: %v\n", err)
		os.Exit(1)
	}

	// Run the application
	if err := app.Run(cfg); err != nil {
		fmt.Fprintf(os.Stderr, "Error: run application: %v\n", err)
		os.Exit(1)
	}
}

// loadConfigFromFile loads configuration from a YAML file
func loadConfigFromFile(filename string) (*config.Config, error) {
	var cfg config.Config
	if err := configLoader.Load(filename, &cfg); err != nil {
		return nil, fmt.Errorf("failed to load config from file: %w", err)
	}
	return &cfg, nil
}
