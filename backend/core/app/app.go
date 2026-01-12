package app

import (
	"context"
	"fmt"
	"time"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"

	"neohabit/core/config"
	"neohabit/core/internal/adapter/repo"
	"neohabit/core/internal/adapter/repo/db"
	"neohabit/core/internal/adapter/secret"
	"neohabit/core/internal/cases"
	"neohabit/core/internal/input/http/handler"
)

const (
	secretTTL = 5 * time.Minute
)

func Run(cfg *config.Config) error {
	// Initialize logger
	loggerConfig := zap.NewProductionConfig()
	loggerConfig.Level.SetLevel(zapcore.Level(cfg.LogConfig.Level))
	loggerConfig.EncoderConfig.EncodeTime = zapcore.RFC3339NanoTimeEncoder
	logger, err := loggerConfig.Build(zap.AddStacktrace(zapcore.ErrorLevel), zap.AddCaller())
	if err != nil {
		return fmt.Errorf("failed to build logger: %w", err)
	}

	logger.Info("starting the application")

	// Initialize PostgreSQL connection pool
	logger.Info("starting postgres initialization")
	pool, err := db.NewPostgresPool(context.Background(), cfg.PGConfig, logger.Named("postgres"))
	if err != nil {
		return fmt.Errorf("failed to create postgres pool: %w", err)
	}
	logger.Info("postgres initialization completed")

	logger.Info("starting transaction manager initialization")
	txManager := db.NewTxManager(pool)
	logger.Info("transaction manager initialization completed")

	userRepo := repo.NewUserRepo(pool, logger.Named("user"))
	habitRepo := repo.NewHabitRepo(pool, logger.Named("habit"))
	projectRepo := repo.NewProjectRepo(pool, logger.Named("project"))
	taskRepo := repo.NewTaskRepo(pool, logger.Named("task"))
	skilltreeRepo := repo.NewSkilltreeRepo(pool, logger.Named("skilltree"))
	settingsRepo := repo.NewSettingsRepo(pool, logger.Named("settings"))
	stopwatchRepo := repo.NewStopwatchRepo(pool, logger.Named("stopwatch"))

	userCase := cases.NewUserCase(userRepo, habitRepo, settingsRepo, stopwatchRepo, txManager)
	habitCase := cases.NewHabitCase(habitRepo, projectRepo, txManager)
	projectCase := cases.NewProjectCase(projectRepo, txManager)
	taskCase := cases.NewTaskCase(taskRepo, txManager)
	skilltreeCase := cases.NewSkilltreeCase(skilltreeRepo, txManager)
	settingsCase := cases.NewSettingsCase(settingsRepo, txManager)
	stopwatchCase := cases.NewStopwatchCase(stopwatchRepo, txManager)

	// Initialize authentication service
	secretProvider := secret.NewSecretProviderCache(secretTTL, secret.EnvSecretFetcher)
	authService := cases.NewAuthCase(secretProvider)

	// Start HTTP server
	logger.Info("starting HTTP server")
	handler.NewServer(
		cfg.Address,
		userCase,
		habitCase,
		projectCase,
		taskCase,
		skilltreeCase,
		settingsCase,
		stopwatchCase,
		authService,
		logger.Named("http-server"),
		cfg.LogConfig.Level == -1, // debug mode
	).Start()

	return nil
}
