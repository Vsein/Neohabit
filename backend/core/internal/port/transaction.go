package port

import "context"

// TransactionManager defines the interface for managing database transactions
type TransactionManager interface {
	// WithTx executes a function within a transaction
	// If the function returns an error, the transaction is rolled back
	// Otherwise, the transaction is committed
	WithTx(ctx context.Context, fn func(context.Context) (any, error)) (any, error)
}

