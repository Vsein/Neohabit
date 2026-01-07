package secret

import (
	"fmt"
	"os"
	"sync"
	"time"

	"neohabit/core/internal/port/repo"
)

const key = "JWT_SECRET"

var _ repo.SecretProvider = (*SecretProviderCache)(nil)

type SecretProviderCache struct {
	mu       *sync.RWMutex
	cache    map[string]cachedSecret
	fetcher  func(name string) (string, error)
	cacheTTL time.Duration
}

type cachedSecret struct {
	value     string
	fetchedAt time.Time
}

func NewSecretProviderCache(ttl time.Duration, fetcher func(name string) (string, error)) *SecretProviderCache {
	return &SecretProviderCache{
		cache:    make(map[string]cachedSecret),
		fetcher:  fetcher,
		cacheTTL: ttl,
	}
}

func (r *SecretProviderCache) GetJWTSecret() (string, error) {
	secret, err := r.fetcher(key)
	if err != nil {
		return "", fmt.Errorf("failed to fetch secret %q: %w", key, err)
	}

	return secret, nil
}

func EnvSecretFetcher(name string) (string, error) {
	value := os.Getenv(name)
	if value == "" {
		return "", fmt.Errorf("%s not set", name)
	}
	return value, nil
}
