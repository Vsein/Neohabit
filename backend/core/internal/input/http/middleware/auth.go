package middleware

import (
	"net/http"
	"strings"

	"neohabit/core/internal/cases"

	"go.uber.org/zap"
)

var logger *zap.Logger

const (
	headerAuthorization = "Authorization"
)

func NewAuthMiddleware(authService *cases.AuthCase, logger *zap.Logger) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get(headerAuthorization)
			logger.Info("url path:" + r.URL.Path)
			if r.URL.Path == "/signup" || r.URL.Path == "/login" {
				if authHeader != "" {
					http.Error(w, "already authorized", http.StatusConflict)
				}
				next.ServeHTTP(w, r)
				return
			}

			if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer") {
				http.Error(w, "missing or invalid authorization header", http.StatusUnauthorized)
				return
			}

			tokenString := strings.TrimPrefix(authHeader, "Bearer ")

			tokenUserID, valid, err := authService.AuthenticateWithAccessToken(r.Context(), tokenString)
			if err != nil || !valid {
				logger.Error("invalid token", zap.Error(err))
				http.Error(w, "invalid or expired token", http.StatusUnauthorized)
				return
			}

			ctx := authService.StoreUserID(r.Context(), tokenUserID)

			next.ServeHTTP(w, r.WithContext(ctx))
		})

	}
}
