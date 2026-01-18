package repo

type SecretProvider interface {
	GetJWTSecret() (string, error)
}
