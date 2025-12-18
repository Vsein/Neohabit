package cases

import (
	"context"
	"fmt"

	"github.com/golang-jwt/jwt/v5"

	"neohabit/core/internal/port/repo"
)

type contextKey string

const (
	UserIDKey contextKey = "userId"
	EmailKey  contextKey = "email"
)

type AuthClaims struct {
	UserID string
	Email  string
	jwt.RegisteredClaims
}

type AuthCase struct {
	secretProvider  repo.SecretProvider
	signingAlgoName string
}

func NewAuthCase(secretProvider repo.SecretProvider) *AuthCase {
	return &AuthCase{
		secretProvider:  secretProvider,
		signingAlgoName: jwt.SigningMethodHS256.Name,
	}
}

func (r *AuthCase) GetUserID(ctx context.Context) (string, bool) {
	userID, ok := ctx.Value(UserIDKey).(string)
	return userID, ok
}

func (r *AuthCase) StoreUserID(ctx context.Context, userID string) context.Context {
	return context.WithValue(ctx, UserIDKey, userID)
}

func (r *AuthCase) GetJWTSecret() (string, error) {
	res, err := r.secretProvider.GetJWTSecret()
	if err != nil {
		return "", err
	}

	return res, nil
}

func (r *AuthCase) AuthenticateWithAccessToken(ctx context.Context, token string) (string, bool, error) {
	claims := &AuthClaims{}

	secret, err := r.secretProvider.GetJWTSecret()
	if err != nil {
		return "", false, fmt.Errorf("cannot get JWT secret: %w", err)
	}

	parseToken, err := jwt.ParseWithClaims(token, claims, func(token *jwt.Token) (any, error) {
		if token.Method.Alg() != r.signingAlgoName {
			return nil, ErrInvalidSigningAlgo
		}
		return []byte(secret), nil
	})

	if !parseToken.Valid {
		return "", false, ErrTokenExpired
	}

	return claims.UserID, true, nil
}
