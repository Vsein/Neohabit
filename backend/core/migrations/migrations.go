package migrations

import (
	"database/sql"
	"embed"
	"fmt"

	"neohabit/core/pkg/logger"

	"github.com/pressly/goose/v3"
)

//go:embed *.sql
var embedMigrations embed.FS

func Migrate(db *sql.DB, logger *logger.Wrapper) error {
	goose.SetBaseFS(embedMigrations)

	if err := goose.SetDialect("postgres"); err != nil {
		return fmt.Errorf("failed to set goose dialect: %w", err)
	}

	goose.SetLogger(logger)

	if err := goose.Up(db, "."); err != nil {
		return fmt.Errorf("failed to migrate database: %w", err)
	}

	return nil
}
