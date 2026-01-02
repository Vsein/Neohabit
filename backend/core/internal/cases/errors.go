package cases

import "errors"

// Domain-level errors
// These are mapped from repository errors and returned to handlers
var (
	ErrAlreadyExists = errors.New("already exists")
	ErrNotFound      = errors.New("not found")
	ErrUnauthorized  = errors.New("unauthorized")
)

var (
	ErrInvalidSigningAlgo = errors.New("invalid signing algo")
	ErrTokenExpired       = errors.New("token expired")
	ErrActionNotPermitted = errors.New("action not permitted")
)
