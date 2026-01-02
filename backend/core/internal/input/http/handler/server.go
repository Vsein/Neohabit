package handler

import (
	"context"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"go.uber.org/zap"

	"neohabit/core/internal/cases"
	"neohabit/core/internal/entity"
	"neohabit/core/internal/input/http/gen"
	"neohabit/core/internal/input/http/middleware"
)

const (
	defaultReadTimeout     = time.Second * 10
	defaultHeadReadTimeout = time.Second * 5
	defaultWriteTimeout    = time.Second * 15
	defaultIdleTimeout     = time.Minute * 2
)

// Ensure server implements the generated interface
var _ gen.StrictServerInterface = (*server)(nil)

// server implements the HTTP handlers for the API
type server struct {
	address string
	habits  *cases.HabitCase
	users   *cases.UserCase
	auth    *cases.AuthCase
	logger  *zap.Logger
	debug   bool
}

// NewServer creates a new HTTP server instance
func NewServer(
	address string,
	habits *cases.HabitCase,
	users *cases.UserCase,
	auth *cases.AuthCase,
	logger *zap.Logger,
	debug bool,
) *server {
	return &server{
		address: address,
		habits:  habits,
		users:   users,
		auth:    auth,
		logger:  logger,
		debug:   debug,
	}
}

// Start the HTTP server
func (s *server) Start() {
	// Create strict handler with options
	srv := gen.NewStrictHandlerWithOptions(
		s,
		[]gen.StrictMiddlewareFunc{},
		gen.StrictHTTPServerOptions{
			RequestErrorHandlerFunc:  requestErrorHandler,
			ResponseErrorHandlerFunc: responseErrorHandler,
		},
	)
	handler := gen.Handler(srv)

	// Create router with middleware
	router := chi.NewRouter()

	router.Use(CORS())
	router.Use(middleware.NewAuthMiddleware(s.auth, s.logger))

	// Add logging middleware if in debug mode
	if s.debug {
		router.Use(loggingMiddleware(s.logger))
	}

	router.Mount("/", handler)

	// Configure HTTP server
	httpServer := http.Server{
		Addr:              s.address,
		Handler:           router,
		ReadTimeout:       defaultReadTimeout,
		ReadHeaderTimeout: defaultHeadReadTimeout,
		WriteTimeout:      defaultWriteTimeout,
		IdleTimeout:       defaultIdleTimeout,
	}

	s.logger.Info("HTTP server started", zap.String("address", s.address))
	log.Fatal(httpServer.ListenAndServe())
}

// POST /signup
func (s *server) Signup(
	ctx context.Context,
	request gen.SignupRequestObject,
) (gen.SignupResponseObject, error) {
	// Convert to domain entity
	user := &entity.User{
		Username: request.Body.Username,
		Password: request.Body.Password,
	}

	// Call use-case
	id, err := s.users.Create(ctx, user)
	if err != nil {
		if errors.Is(err, cases.ErrAlreadyExists) {
			return gen.Signup409JSONResponse{}, nil
		}
		s.logger.Error("failed to create user", zap.Error(err))
		return gen.Signup500JSONResponse{}, nil
	}

	return gen.Signup201JSONResponse{
		Token: &id,
	}, nil
}

// POST /habit
func (s *server) CreateHabit(
	ctx context.Context,
	request gen.CreateHabitRequestObject,
) (gen.CreateHabitResponseObject, error) {
	// Validate request
	if request.Body.Name == "" {
		return gen.CreateHabit400JSONResponse{}, nil
	}

	userID, ok := s.auth.GetUserID(ctx)
	if !ok {
		return gen.CreateHabit401Response{}, nil
	}

	// Convert to domain entity
	habit := &entity.Habit{
		Name:        request.Body.Name,
		Description: request.Body.Description,
		Color:       *request.Body.Color,
		UserID:      userID,
	}

	// Call use-case
	id, err := s.habits.Create(ctx, habit)
	if err != nil {
		if errors.Is(err, cases.ErrAlreadyExists) {
			return gen.CreateHabit409JSONResponse{}, nil
		}
		s.logger.Error("failed to create habit", zap.Error(err))
		return gen.CreateHabit500JSONResponse{}, nil
	}

	return gen.CreateHabit201JSONResponse(id), nil
}

// GetHabit handles GET /habit/{habitId}
// func (s *server) GetHabit(
// 	ctx context.Context,
// 	request gen.GetHabitRequestObject,
// ) (gen.GetHabitResponseObject, error) {
// 	// Call use-case
// 	habit, err := s.habits.Read(ctx, request.HabitID)
// 	if err != nil {
// 		if errors.Is(err, cases.ErrNotFound) {
// 			return gen.GetHabit404JSONResponse{}, nil
// 		}
// 		s.logger.Error("failed to get habit", zap.Error(err))
// 		return gen.GetHabit500JSONResponse{}, nil
// 	}
//
// 	// Convert to API response
// 	response := toAPIHabit(habit)
// 	return gen.GetHabit200JSONResponse(response), nil
// }

// Returns all the habits of the authorized user
// GET /habit
func (s *server) ListHabits(
	ctx context.Context,
	request gen.ListHabitsRequestObject,
) (gen.ListHabitsResponseObject, error) {
	userID, ok := s.auth.GetUserID(ctx)
	if !ok {
		return gen.ListHabits401Response{}, nil
	}

	// Call use-case
	habits, err := s.habits.List(ctx, userID)
	if err != nil {
		s.logger.Error("failed to list habits", zap.Error(err))
		return gen.ListHabits500JSONResponse{}, nil
	}

	// Convert to API response
	response := make([]gen.Habit, 0, len(habits))
	for _, habit := range habits {
		response = append(response, toAPIHabit(habit))
	}

	return gen.ListHabits200JSONResponse(response), nil
}

// toAPIHabit converts domain entity to API response
func toAPIHabit(e *entity.Habit) gen.Habit {
	return gen.Habit{
		ID:          &e.ID,
		Name:        e.Name,
		Description: &e.Description,
		CreatedAt:   &e.CreatedAt,
		UpdatedAt:   &e.UpdatedAt,
	}
}

// requestErrorHandler handles request errors
func requestErrorHandler(w http.ResponseWriter, r *http.Request, err error) {
	w.WriteHeader(http.StatusBadRequest)
	response := gen.ErrorResponse{
		Error: err.Error(),
	}
	_ = json.NewEncoder(w).Encode(response)
}

// responseErrorHandler handles response errors
func responseErrorHandler(w http.ResponseWriter, r *http.Request, err error) {
	w.WriteHeader(http.StatusInternalServerError)
	response := gen.ErrorResponse{
		Error: "internal server error",
	}
	_ = json.NewEncoder(w).Encode(response)
}

func CORS() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// TODO allow-origin ENV == 'dev' ? 'http://127.0.0.1:8080' : ''
			// may need to put the entire path as a variable as well,
			// since not everyone has 8080 port available, even for dev environments
			w.Header().Add("Access-Control-Allow-Origin", "http://127.0.0.1:8080")
			w.Header().Add("Access-Control-Allow-Credentials", "true")
			w.Header().Add("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
			w.Header().Add("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS")

			if r.Method == "OPTIONS" {
				http.Error(w, "No Content", http.StatusNoContent)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}

// loggingMiddleware logs HTTP requests
func loggingMiddleware(logger *zap.Logger) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			start := time.Now()
			logger.Debug("HTTP request",
				zap.String("method", r.Method),
				zap.String("path", r.URL.Path),
				zap.String("remote_addr", r.RemoteAddr),
			)
			next.ServeHTTP(w, r)
			logger.Debug("HTTP response",
				zap.String("method", r.Method),
				zap.String("path", r.URL.Path),
				zap.Duration("duration", time.Since(start)),
			)
		})
	}
}
