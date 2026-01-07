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
	"golang.org/x/crypto/bcrypt"

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
	address     string
	users       *cases.UserCase
	habits      *cases.HabitCase
	projects    *cases.ProjectCase
	tasks       *cases.TaskCase
	skilltrees  *cases.SkilltreeCase
	settings    *cases.SettingsCase
	stopwatches *cases.StopwatchCase
	auth        *cases.AuthCase
	logger      *zap.Logger
	debug       bool
}

// NewServer creates a new HTTP server instance
func NewServer(
	address string,
	users *cases.UserCase,
	habits *cases.HabitCase,
	projects *cases.ProjectCase,
	tasks *cases.TaskCase,
	skilltrees *cases.SkilltreeCase,
	settings *cases.SettingsCase,
	stopwatches *cases.StopwatchCase,
	auth *cases.AuthCase,
	logger *zap.Logger,
	debug bool,
) *server {
	return &server{
		address:     address,
		users:       users,
		habits:      habits,
		projects:    projects,
		tasks:       tasks,
		skilltrees:  skilltrees,
		settings:    settings,
		stopwatches: stopwatches,
		auth:        auth,
		logger:      logger,
		debug:       debug,
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
	user := &entity.User{
		Username: request.Body.Username,
		Password: request.Body.Password,
	}

	id, err := s.users.Create(ctx, user)
	if err != nil {
		if errors.Is(err, cases.ErrAlreadyExists) {
			return gen.Signup409JSONResponse{Error: "Username already exists"}, nil
		}
		s.logger.Error("failed to create user", zap.Error(err))
		return gen.Signup500JSONResponse{}, nil
	}

	token, err := s.auth.IssueAccessToken(ctx, id)
	if err != nil {
		s.logger.Error("failed to issue token", zap.Error(err))
		return gen.Signup500JSONResponse{}, nil
	}

	return gen.Signup201JSONResponse{
		Token: &token,
	}, nil
}

// POST /login
func (s *server) Login(
	ctx context.Context,
	request gen.LoginRequestObject,
) (gen.LoginResponseObject, error) {
	username := request.Body.Username
	password := request.Body.Password

	user, err := s.users.GetByUsername(ctx, username)
	if err != nil {
		if errors.Is(err, cases.ErrNotFound) {
			return gen.Login404JSONResponse{}, nil
		}
		s.logger.Error("user not found", zap.Error(err))
		return gen.Login500JSONResponse{}, nil
	}

	if bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)) != nil {
		return gen.Login401Response{}, nil
	}

	token, err := s.auth.IssueAccessToken(ctx, user.ID)
	if err != nil {
		s.logger.Error("failed to issue token", zap.Error(err))
		return gen.Login500JSONResponse{}, nil
	}

	return gen.Login200JSONResponse{
		Token: &token,
	}, nil
}

// GET /user
func (s *server) GetUser(
	ctx context.Context,
	request gen.GetUserRequestObject,
) (gen.GetUserResponseObject, error) {
	userID, ok := s.auth.GetUserID(ctx)
	if !ok {
		return gen.GetUser401Response{}, nil
	}

	// Call use-case
	user, err := s.users.GetByID(ctx, userID)
	if err != nil {
		s.logger.Error("failed to read user", zap.Error(err))
		return gen.GetUser500JSONResponse{}, nil
	}

	return gen.GetUser200JSONResponse(toAPIUser(user)), nil
}

// DELETE /user/{user_id}
func (s *server) DeleteUser(
	ctx context.Context,
	request gen.DeleteUserRequestObject,
) (gen.DeleteUserResponseObject, error) {
	userID, ok := s.auth.GetUserID(ctx)
	if !ok {
		return gen.DeleteUser401Response{}, nil
	}

	err := s.users.Delete(ctx, userID)
	if err != nil {
		if errors.Is(err, cases.ErrNotFound) {
			return gen.DeleteUser404Response{}, nil
		}
		s.logger.Error("failed to delete user", zap.Error(err))
		return gen.DeleteUser500JSONResponse{}, nil
	}

	return gen.DeleteUser200Response{}, nil
}

// Returns all habits of the authorized user
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

// DELETE /habit/{habit_id}
func (s *server) DeleteHabit(
	ctx context.Context,
	request gen.DeleteHabitRequestObject,
) (gen.DeleteHabitResponseObject, error) {
	if request.HabitID == "" {
		return gen.DeleteHabit400Response{}, nil
	}

	_, ok := s.auth.GetUserID(ctx)
	if !ok {
		return gen.DeleteHabit401Response{}, nil
	}

	err := s.habits.Delete(ctx, request.HabitID)
	if err != nil {
		if errors.Is(err, cases.ErrNotFound) {
			return gen.DeleteHabit404Response{}, nil
		}
		s.logger.Error("failed to delete habit", zap.Error(err))
		return gen.DeleteHabit500JSONResponse{}, nil
	}

	return gen.DeleteHabit200Response{}, nil
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

// Returns all projects of the authorized user
// GET /project
func (s *server) ListProjects(
	ctx context.Context,
	request gen.ListProjectsRequestObject,
) (gen.ListProjectsResponseObject, error) {
	userID, ok := s.auth.GetUserID(ctx)
	if !ok {
		return gen.ListProjects401Response{}, nil
	}

	// Call use-case
	projects, err := s.projects.List(ctx, userID)
	if err != nil {
		s.logger.Error("failed to list projects", zap.Error(err))
		return gen.ListProjects500JSONResponse{}, nil
	}

	// Convert to API response
	response := make([]gen.Project, 0, len(projects))
	for _, project := range projects {
		response = append(response, toAPIProject(project))
	}

	return gen.ListProjects200JSONResponse(response), nil
}

// DELETE /project/{project_id}
func (s *server) DeleteProject(
	ctx context.Context,
	request gen.DeleteProjectRequestObject,
) (gen.DeleteProjectResponseObject, error) {
	if request.ProjectID == "" {
		return gen.DeleteProject400Response{}, nil
	}

	_, ok := s.auth.GetUserID(ctx)
	if !ok {
		return gen.DeleteProject401Response{}, nil
	}

	err := s.projects.Delete(ctx, request.ProjectID)
	if err != nil {
		if errors.Is(err, cases.ErrNotFound) {
			return gen.DeleteProject404Response{}, nil
		}
		s.logger.Error("failed to delete project", zap.Error(err))
		return gen.DeleteProject500JSONResponse{}, nil
	}

	return gen.DeleteProject200Response{}, nil
}

// Returns all tasks of the authorized user
// GET /task
func (s *server) ListTasks(
	ctx context.Context,
	request gen.ListTasksRequestObject,
) (gen.ListTasksResponseObject, error) {
	userID, ok := s.auth.GetUserID(ctx)
	if !ok {
		return gen.ListTasks401Response{}, nil
	}

	// Call use-case
	tasks, err := s.tasks.List(ctx, userID)
	if err != nil {
		s.logger.Error("failed to list tasks", zap.Error(err))
		return gen.ListTasks500JSONResponse{}, nil
	}

	// Convert to API response
	response := make([]gen.Task, 0, len(tasks))
	for _, task := range tasks {
		response = append(response, toAPITask(task))
	}

	return gen.ListTasks200JSONResponse(response), nil
}

// DELETE /task/{task_id}
func (s *server) DeleteTask(
	ctx context.Context,
	request gen.DeleteTaskRequestObject,
) (gen.DeleteTaskResponseObject, error) {
	if request.TaskID == "" {
		return gen.DeleteTask400Response{}, nil
	}

	_, ok := s.auth.GetUserID(ctx)
	if !ok {
		return gen.DeleteTask401Response{}, nil
	}

	err := s.tasks.Delete(ctx, request.TaskID)
	if err != nil {
		if errors.Is(err, cases.ErrNotFound) {
			return gen.DeleteTask404Response{}, nil
		}
		s.logger.Error("failed to delete task", zap.Error(err))
		return gen.DeleteTask500JSONResponse{}, nil
	}

	return gen.DeleteTask200Response{}, nil
}

// Returns all tasks of the authorized user
// GET /skilltrees
func (s *server) ListSkilltrees(
	ctx context.Context,
	request gen.ListSkilltreesRequestObject,
) (gen.ListSkilltreesResponseObject, error) {
	userID, ok := s.auth.GetUserID(ctx)
	if !ok {
		return gen.ListSkilltrees401Response{}, nil
	}

	// Call use-case
	skilltrees, err := s.skilltrees.List(ctx, userID)
	if err != nil {
		s.logger.Error("failed to list skilltrees", zap.Error(err))
		return gen.ListSkilltrees500JSONResponse{}, nil
	}

	// Convert to API response
	response := make([]gen.Skilltree, 0, len(skilltrees))
	for _, skilltree := range skilltrees {
		response = append(response, toAPISkilltree(skilltree))
	}

	return gen.ListSkilltrees200JSONResponse(response), nil
}

// DELETE /skilltree/{skilltree_id}
func (s *server) DeleteSkilltree(
	ctx context.Context,
	request gen.DeleteSkilltreeRequestObject,
) (gen.DeleteSkilltreeResponseObject, error) {
	if request.SkilltreeID == "" {
		return gen.DeleteSkilltree400Response{}, nil
	}

	_, ok := s.auth.GetUserID(ctx)
	if !ok {
		return gen.DeleteSkilltree401Response{}, nil
	}

	err := s.skilltrees.Delete(ctx, request.SkilltreeID)
	if err != nil {
		if errors.Is(err, cases.ErrNotFound) {
			return gen.DeleteSkilltree404Response{}, nil
		}
		s.logger.Error("failed to delete skilltree", zap.Error(err))
		return gen.DeleteSkilltree500JSONResponse{}, nil
	}

	return gen.DeleteSkilltree200Response{}, nil
}

// GET /stopwatch
func (s *server) GetStopwatch(
	ctx context.Context,
	request gen.GetStopwatchRequestObject,
) (gen.GetStopwatchResponseObject, error) {
	userID, ok := s.auth.GetUserID(ctx)
	if !ok {
		return gen.GetStopwatch401Response{}, nil
	}

	// Call use-case
	stopwatch, err := s.stopwatches.Read(ctx, userID)
	if err != nil {
		s.logger.Error("failed to read stopwatch", zap.Error(err))
		return gen.GetStopwatch500JSONResponse{}, nil
	}

	return gen.GetStopwatch200JSONResponse(toAPIStopwatch(stopwatch)), nil
}

// GET /settings
func (s *server) GetSettings(
	ctx context.Context,
	request gen.GetSettingsRequestObject,
) (gen.GetSettingsResponseObject, error) {
	userID, ok := s.auth.GetUserID(ctx)
	if !ok {
		return gen.GetSettings401Response{}, nil
	}

	// Call use-case
	settings, err := s.settings.Read(ctx, userID)
	if err != nil {
		s.logger.Error("failed to read settings", zap.Error(err))
		return gen.GetSettings500JSONResponse{}, nil
	}

	return gen.GetSettings200JSONResponse(toAPISettings(settings)), nil
}

func toAPIUser(e *entity.User) gen.User {
	return gen.User{
		ID:                   e.ID,
		Username:             e.Username,
		Verified:             &e.Verified,
		VerificationAttempts: &e.VerificationAttempts,
		VerificationTime:     &e.VerificationTime,
		CreatedAt:            &e.CreatedAt,
		UpdatedAt:            &e.UpdatedAt,
	}
}

func toAPIHabit(e *entity.Habit) gen.Habit {
	data := make([]gen.HabitData, 0, len(e.Data))
	for _, datum := range e.Data {
		data = append(data, gen.HabitData{
			Date:  datum.Date,
			Value: datum.Value,
		})
	}

	return gen.Habit{
		ID:          e.ID,
		UserID:      e.UserID,
		Name:        e.Name,
		Description: &e.Description,
		Color:       &e.Color,
		DueDate:     &e.DueDate,
		CreatedAt:   &e.CreatedAt,
		UpdatedAt:   &e.UpdatedAt,
		Data:        &data,
	}
}

func toAPIProject(e *entity.Project) gen.Project {
	return gen.Project{
		ID:          e.ID,
		UserID:      e.UserID,
		Name:        e.Name,
		Description: &e.Description,
		Color:       &e.Color,
		HabitIds:    &e.HabitIDs,
		CreatedAt:   &e.CreatedAt,
		UpdatedAt:   &e.UpdatedAt,
	}
}

func toAPITask(e *entity.Task) gen.Task {
	return gen.Task{
		ID:          e.ID,
		UserID:      e.UserID,
		HabitID:     &e.HabitID,
		Name:        e.Name,
		Description: &e.Description,
		DueDate:     &e.DueDate,
		IsImportant: &e.IsImportant,
		IsCompleted: &e.IsCompleted,
		CreatedAt:   &e.CreatedAt,
		UpdatedAt:   &e.UpdatedAt,
	}
}

func toAPISkilltree(e *entity.Skilltree) gen.Skilltree {
	return gen.Skilltree{
		ID:          e.ID,
		UserID:      e.UserID,
		ProjectID:   &e.HabitID,
		HabitID:     &e.HabitID,
		Name:        e.Name,
		Description: &e.Description,
		SkillIds:    &e.SkillIDs,
		CreatedAt:   &e.CreatedAt,
		UpdatedAt:   &e.UpdatedAt,
	}
}

func toAPIStopwatch(e *entity.Stopwatch) gen.Stopwatch {
	return gen.Stopwatch{
		ID:            e.ID,
		UserID:        e.UserID,
		HabitID:       &e.HabitID,
		IsInitiated:   &e.IsInitiated,
		StartTime:     &e.StartTime,
		Duration:      &e.Duration,
		IsPaused:      &e.IsPaused,
		PauseDuration: &e.PauseDuration,
		CreatedAt:     &e.CreatedAt,
		UpdatedAt:     &e.UpdatedAt,
	}
}

func toAPISettings(e *entity.Settings) gen.Settings {
	theme := gen.SettingsTheme(e.Theme.String())
	overviewCurrentDay := gen.SettingsOverviewCurrentDay(e.OverviewCurrentDay.String())
	habitHeatmapsCurrentDay := gen.SettingsHabitHeatmapsCurrentDay(e.HabitHeatmapsCurrentDay.String())

	return gen.Settings{
		ID:                           e.ID,
		UserID:                       e.UserID,
		Theme:                        &theme,
		ReadSettingsFromConfigFile:   &e.ReadSettingsFromConfigFile,
		CellHeightMultiplier:         &e.CellHeightMultiplier,
		CellWidthMultiplier:          &e.CellWidthMultiplier,
		OverviewVertical:             &e.OverviewVertical,
		OverviewCurrentDay:           &overviewCurrentDay,
		OverviewOffset:               &e.OverviewOffset,
		OverviewDuration:             &e.OverviewDuration,
		OverviewApplyLimit:           &e.OverviewApplyLimit,
		OverviewDurationLimit:        &e.OverviewDurationLimit,
		AllowHorizontalScrolling:     &e.AllowHorizontalScrolling,
		HabitHeatmapsOverride:        &e.HabitHeatmapsOverride,
		HabitHeatmapsCurrentDay:      &habitHeatmapsCurrentDay,
		ShowStopwatchTimeInPageTitle: &e.ShowStopwatchTimeInPageTitle,
		HideCellHint:                 &e.HideCellHint,
		HideOnboarding:               &e.HideOnboarding,
		ProjectsEnableCustomOrder:    &e.ProjectsEnableCustomOrder,
		ProjectsIDOrder:              &e.ProjectsIDOrder,
		CreatedAt:                    &e.CreatedAt,
		UpdatedAt:                    &e.UpdatedAt,
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
