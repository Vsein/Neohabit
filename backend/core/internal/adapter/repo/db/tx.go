package db

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"neohabit/core/internal/port"
)

// txKey is the context key for storing transaction
type txKey struct{}

// TxManager implements port.TransactionManager interface
type TxManager struct {
	pool *pgxpool.Pool
}

// NewTxManager creates a new transaction manager
func NewTxManager(pool *pgxpool.Pool) *TxManager {
	return &TxManager{pool: pool}
}

// WithTx executes a function within a transaction
// If a transaction already exists in context, it reuses it
// Otherwise, it creates a new transaction
func (tm *TxManager) WithTx(ctx context.Context, fn func(context.Context) (any, error)) (any, error) {
	// Check if transaction already exists in context
	if tx := getTransactionFromContext(ctx); tx != nil {
		// Reuse existing transaction
		return fn(ctx)
	}

	// Begin new transaction
	tx, err := tm.pool.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("begin transaction: %w", err)
	}

	// Store transaction in context
	ctx = context.WithValue(ctx, txKey{}, tx)

	// Execute function
	result, err := fn(ctx)
	if err != nil {
		// Rollback on error
		if rbErr := tx.Rollback(ctx); rbErr != nil {
			return nil, fmt.Errorf("rollback transaction (original error: %w): %w", err, rbErr)
		}
		return nil, err
	}

	// Commit transaction
	if err := tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("commit transaction: %w", err)
	}

	return result, nil
}

// getTransactionFromContext retrieves the transaction from context
func getTransactionFromContext(ctx context.Context) pgx.Tx {
	tx, ok := ctx.Value(txKey{}).(pgx.Tx)
	if !ok {
		return nil
	}
	return tx
}

// Ensure TxManager implements the interface
var _ port.TransactionManager = (*TxManager)(nil)
