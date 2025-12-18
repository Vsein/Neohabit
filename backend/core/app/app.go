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

	// Initialize transaction manager
	logger.Info("starting transaction manager initialization")
	txManager := db.NewTxManager(pool)
	logger.Info("transaction manager initialization completed")

	// Initialize repositories
	logger.Info("starting habit repository initialization")
	habitRepo := repo.NewHabit(pool, logger.Named("habit"))
	logger.Info("habit repository initialization completed")

	// Initialize use cases
	logger.Info("starting use cases initialization")
	habitCase := cases.NewHabitCase(habitRepo, txManager)
	logger.Info("use cases initialization completed")

	// Initialize authentication service
	secretProvider := secret.NewSecretProviderCache(secretTTL, secret.EnvSecretFetcher)
	authService := cases.NewAuthCase(secretProvider)

	// Start HTTP server
	logger.Info("starting HTTP server")
	handler.NewServer(
		cfg.Address,
		habitCase,
		authService,
		logger.Named("http-server"),
		cfg.LogConfig.Level == -1, // debug mode
	).Start()

	return nil
}
