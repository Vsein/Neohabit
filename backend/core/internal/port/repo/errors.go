package repo

import "errors"

var (
	ErrAlreadyExists = errors.New("already exists")
	ErrNotFound      = errors.New("not found")
)

var (
	ErrInvalidSigningAlgo = errors.New("invalid signing algo")
	ErrTokenExpired       = errors.New("token expired")
	ErrActionNotPermitted = errors.New("action not permitted")
)
