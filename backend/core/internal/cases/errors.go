package cases

import "errors"

// Domain-level errors
// These are mapped from repository errors and returned to handlers
var (
	ErrNotFound = errors.New("not found")
	ErrConflict = errors.New("conflict")
)

