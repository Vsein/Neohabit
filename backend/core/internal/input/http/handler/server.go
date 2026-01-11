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
			return gen.Login404JSONResponse{Error: "User not found"}, nil
		}
		s.logger.Error("user not found", zap.Error(err))
		return gen.Login500JSONResponse{}, nil
	}

	if bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)) != nil {
		return gen.Login401JSONResponse{Error: "Wrong password"}, nil
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

	return gen.DeleteUser204Response{}, nil
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

	habits, err := s.habits.List(ctx, userID)
	if err != nil {
		s.logger.Error("failed to list habits", zap.Error(err))
		return gen.ListHabits500JSONResponse{}, nil
	}

	response := make([]gen.Habit, 0, len(habits))
	for _, habit := range habits {
		response = append(response, toAPIHabit(habit))
	}

	return gen.ListHabits200JSONResponse(response), nil
}

// GET /habit/outside_projects
func (s *server) ListHabitsOutsideProjects(
	ctx context.Context,
	request gen.ListHabitsOutsideProjectsRequestObject,
) (gen.ListHabitsOutsideProjectsResponseObject, error) {
	userID, ok := s.auth.GetUserID(ctx)
	if !ok {
		return gen.ListHabitsOutsideProjects401Response{}, nil
	}

	habits, err := s.habits.ListHabitsOutsideProjects(ctx, userID)
	if err != nil {
		s.logger.Error("failed to list projectless habits", zap.Error(err))
		return gen.ListHabitsOutsideProjects500JSONResponse{}, nil
	}

	response := make([]gen.Habit, 0, len(habits))
	for _, habit := range habits {
		response = append(response, toAPIHabit(habit))
	}

	return gen.ListHabitsOutsideProjects200JSONResponse(response), nil
}

// POST /habit
func (s *server) CreateHabit(
	ctx context.Context,
	request gen.CreateHabitRequestObject,
) (gen.CreateHabitResponseObject, error) {
	userID, ok := s.auth.GetUserID(ctx)
	if !ok {
		return gen.CreateHabit401Response{}, nil
	}

	habit := &entity.Habit{
		Name:        request.Body.Name,
		Description: request.Body.Description,
		Color:       *request.Body.Color,
		UserID:      userID,
	}

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

// PUT /habit/{habit_id}
func (s *server) UpdateHabit(
	ctx context.Context,
	request gen.UpdateHabitRequestObject,
) (gen.UpdateHabitResponseObject, error) {
	if request.HabitID == "" {
		return gen.UpdateHabit400Response{}, nil
	}

	userID, ok := s.auth.GetUserID(ctx)
	if !ok {
		return gen.UpdateHabit401Response{}, nil
	}

	habit := &entity.Habit{
		ID:          request.HabitID,
		Name:        request.Body.Name,
		Description: request.Body.Description,
		Color:       *request.Body.Color,
		UserID:      userID,
	}

	err := s.habits.Update(ctx, habit)
	if err != nil {
		if errors.Is(err, cases.ErrNotFound) {
			return gen.UpdateHabit404JSONResponse{}, nil
		}
		s.logger.Error("failed to update habit", zap.Error(err))
		return gen.UpdateHabit500JSONResponse{}, nil
	}

	return gen.UpdateHabit204Response{}, nil
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

	return gen.DeleteHabit204Response{}, nil
}

// GetHabit handles GET /habit/{habitId}
// func (s *server) GetHabit(
// 	ctx context.Context,
// 	request gen.GetHabitRequestObject,
// ) (gen.GetHabitResponseObject, error) {
// 	habit, err := s.habits.Read(ctx, request.HabitID)
// 	if err != nil {
// 		if errors.Is(err, cases.ErrNotFound) {
// 			return gen.GetHabit404JSONResponse{}, nil
// 		}
// 		s.logger.Error("failed to get habit", zap.Error(err))
// 		return gen.GetHabit500JSONResponse{}, nil
// 	}
//
// 	response := toAPIHabit(habit)
// 	return gen.GetHabit200JSONResponse(response), nil
// }

// Returns all projects of the authorized user
// GET /projects
func (s *server) ListProjects(
	ctx context.Context,
	request gen.ListProjectsRequestObject,
) (gen.ListProjectsResponseObject, error) {
	userID, ok := s.auth.GetUserID(ctx)
	if !ok {
		return gen.ListProjects401Response{}, nil
	}

	projects, err := s.projects.List(ctx, userID)
	if err != nil {
		s.logger.Error("failed to list projects", zap.Error(err))
		return gen.ListProjects500JSONResponse{}, nil
	}

	response := make([]gen.Project, 0, len(projects))
	for _, project := range projects {
		response = append(response, toAPIProject(project))
	}

	return gen.ListProjects200JSONResponse(response), nil
}

// POST /project
func (s *server) CreateProject(
	ctx context.Context,
	request gen.CreateProjectRequestObject,
) (gen.CreateProjectResponseObject, error) {
	userID, ok := s.auth.GetUserID(ctx)
	if !ok {
		return gen.CreateProject401Response{}, nil
	}

	project := &entity.Project{
		Name:        request.Body.Name,
		Description: *request.Body.Description,
		Color:       *request.Body.Color,
		HabitIDs:    *request.Body.HabitIds,
		UserID:      userID,
	}

	id, err := s.projects.Create(ctx, project)
	if err != nil {
		if errors.Is(err, cases.ErrAlreadyExists) {
			return gen.CreateProject409JSONResponse{}, nil
		}
		s.logger.Error("failed to create project", zap.Error(err))
		return gen.CreateProject500JSONResponse{}, nil
	}

	return gen.CreateProject201JSONResponse(id), nil
}

// PUT /project/{project_id}
func (s *server) UpdateProject(
	ctx context.Context,
	request gen.UpdateProjectRequestObject,
) (gen.UpdateProjectResponseObject, error) {
	if request.ProjectID == "" {
		return gen.UpdateProject400Response{}, nil
	}

	userID, ok := s.auth.GetUserID(ctx)
	if !ok {
		return gen.UpdateProject401Response{}, nil
	}

	project := &entity.Project{
		ID:          request.ProjectID,
		Name:        request.Body.Name,
		Description: request.Body.Description,
		Color:       *request.Body.Color,
		HabitIDs:    *request.Body.HabitIds,
		UserID:      userID,
	}

	err := s.projects.Update(ctx, project)
	if err != nil {
		if errors.Is(err, cases.ErrNotFound) {
			return gen.UpdateProject404JSONResponse{}, nil
		}
		s.logger.Error("failed to update habit", zap.Error(err))
		return gen.UpdateProject500JSONResponse{}, nil
	}

	return gen.UpdateProject204Response{}, nil
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

	return gen.DeleteProject204Response{}, nil
}

// PUT /projects/order
func (s *server) UpdateProjectsOrder(
	ctx context.Context,
	request gen.UpdateProjectsOrderRequestObject,
) (gen.UpdateProjectsOrderResponseObject, error) {
	_, ok := s.auth.GetUserID(ctx)
	if !ok {
		return gen.UpdateProjectsOrder401Response{}, nil
	}

	err := s.projects.UpdateProjectsOrder(ctx, request.Body.NewProjectsOrder)
	if err != nil {
		s.logger.Error("failed to update projects order", zap.Error(err))
		return gen.UpdateProjectsOrder500JSONResponse{}, nil
	}

	return gen.UpdateProjectsOrder204Response{}, nil
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

	tasks, err := s.tasks.List(ctx, userID)
	if err != nil {
		s.logger.Error("failed to list tasks", zap.Error(err))
		return gen.ListTasks500JSONResponse{}, nil
	}

	response := make([]gen.Task, 0, len(tasks))
	for _, task := range tasks {
		response = append(response, toAPITask(task))
	}

	return gen.ListTasks200JSONResponse(response), nil
}

// POST /task
func (s *server) CreateTask(
	ctx context.Context,
	request gen.CreateTaskRequestObject,
) (gen.CreateTaskResponseObject, error) {
	userID, ok := s.auth.GetUserID(ctx)
	if !ok {
		return gen.CreateTask401Response{}, nil
	}

	task := &entity.Task{
		Name:        &request.Body.Name,
		Description: &request.Body.Description,
		UserID:      userID,
	}

	id, err := s.tasks.Create(ctx, task)
	if err != nil {
		if errors.Is(err, cases.ErrAlreadyExists) {
			return gen.CreateTask409JSONResponse{}, nil
		}
		s.logger.Error("failed to create task", zap.Error(err))
		return gen.CreateTask500JSONResponse{}, nil
	}

	return gen.CreateTask201JSONResponse(id), nil
}

// PATCH /task/{task_id}
func (s *server) UpdateTask(
	ctx context.Context,
	request gen.UpdateTaskRequestObject,
) (gen.UpdateTaskResponseObject, error) {
	if request.TaskID == "" {
		return gen.UpdateTask400Response{}, nil
	}

	userID, ok := s.auth.GetUserID(ctx)
	if !ok {
		return gen.UpdateTask401Response{}, nil
	}

	task := &entity.Task{
		ID:          request.TaskID,
		Name:        request.Body.Name,
		Description: request.Body.Description,
		IsCompleted: request.Body.IsCompleted,
		UserID:      userID,
	}

	err := s.tasks.Update(ctx, task)
	if err != nil {
		if errors.Is(err, cases.ErrNotFound) {
			return gen.UpdateTask404JSONResponse{}, nil
		}
		s.logger.Error("failed to update task", zap.Error(err))
		return gen.UpdateTask500JSONResponse{}, nil
	}

	return gen.UpdateTask204Response{}, nil
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

	return gen.DeleteTask204Response{}, nil
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

	skilltrees, err := s.skilltrees.List(ctx, userID)
	if err != nil {
		s.logger.Error("failed to list skilltrees", zap.Error(err))
		return gen.ListSkilltrees500JSONResponse{}, nil
	}

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

	return gen.DeleteSkilltree204Response{}, nil
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

	stopwatch, err := s.stopwatches.Read(ctx, userID)
	if err != nil {
		s.logger.Error("failed to read stopwatch", zap.Error(err))
		return gen.GetStopwatch500JSONResponse{}, nil
	}

	return gen.GetStopwatch200JSONResponse(toAPIStopwatch(stopwatch)), nil
}

// PATCH /stopwatch
func (s *server) UpdateStopwatch(
	ctx context.Context,
	request gen.UpdateStopwatchRequestObject,
) (gen.UpdateStopwatchResponseObject, error) {
	userID, ok := s.auth.GetUserID(ctx)
	if !ok {
		return gen.UpdateStopwatch401Response{}, nil
	}

	stopwatch := &entity.Stopwatch{
		UserID:        userID,
		HabitID:       request.Body.HabitID,
		IsInitiated:   request.Body.IsInitiated,
		StartTime:     request.Body.StartTime,
		Duration:      request.Body.Duration,
		IsPaused:      request.Body.IsPaused,
		PauseDuration: request.Body.PauseDuration,
	}

	err := s.stopwatches.Update(ctx, stopwatch)
	if err != nil {
		s.logger.Error("failed to update stopwatch", zap.Error(err))
		return gen.UpdateStopwatch500JSONResponse{}, nil
	}

	return gen.UpdateStopwatch204Response{}, nil
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

	settings, err := s.settings.Read(ctx, userID)
	if err != nil {
		s.logger.Error("failed to read settings", zap.Error(err))
		return gen.GetSettings500JSONResponse{}, nil
	}

	return gen.GetSettings200JSONResponse(toAPISettings(settings)), nil
}

// PATCH /settings
func (s *server) UpdateSettings(
	ctx context.Context,
	request gen.UpdateSettingsRequestObject,
) (gen.UpdateSettingsResponseObject, error) {
	userID, ok := s.auth.GetUserID(ctx)
	if !ok {
		return gen.UpdateSettings401Response{}, nil
	}

	settings := &entity.Settings{
		UserID:                       userID,
		ReadSettingsFromConfigFile:   request.Body.ReadSettingsFromConfigFile,
		CellHeightMultiplier:         request.Body.CellHeightMultiplier,
		CellWidthMultiplier:          request.Body.CellWidthMultiplier,
		OverviewVertical:             request.Body.OverviewVertical,
		OverviewOffset:               request.Body.OverviewOffset,
		OverviewDuration:             request.Body.OverviewDuration,
		OverviewApplyLimit:           request.Body.OverviewApplyLimit,
		OverviewDurationLimit:        request.Body.OverviewDurationLimit,
		AllowHorizontalScrolling:     request.Body.AllowHorizontalScrolling,
		HabitHeatmapsOverride:        request.Body.HabitHeatmapsOverride,
		ShowStopwatchTimeInPageTitle: request.Body.ShowStopwatchTimeInPageTitle,
		HideCellHint:                 request.Body.HideCellHint,
		HideOnboarding:               request.Body.HideOnboarding,
		ProjectsEnableCustomOrder:    request.Body.ProjectsEnableCustomOrder,
	}

	if request.Body.Theme != nil {
		theme := entity.SettingsTheme(map[gen.SettingsTheme]int{
			"dark":  0,
			"light": 1,
		}[*request.Body.Theme])
		settings.Theme = &theme
	}

	if request.Body.OverviewCurrentDay != nil {
		overviewCurrentDay := entity.SettingsHeatmapCurrentDay(map[gen.SettingsOverviewCurrentDay]int{
			"end":    0,
			"middle": 1,
			"start":  2,
		}[*request.Body.OverviewCurrentDay])
		settings.OverviewCurrentDay = &overviewCurrentDay
	}

	if request.Body.HabitHeatmapsCurrentDay != nil {
		habitHeatmapsCurrentDay := entity.SettingsHeatmapCurrentDay(map[gen.SettingsHabitHeatmapsCurrentDay]int{
			"end":    0,
			"middle": 1,
			"start":  2,
		}[*request.Body.HabitHeatmapsCurrentDay])
		settings.HabitHeatmapsCurrentDay = &habitHeatmapsCurrentDay
	}

	err := s.settings.Update(ctx, settings)
	if err != nil {
		s.logger.Error("failed to update settings", zap.Error(err))
		return gen.UpdateSettings500JSONResponse{}, nil
	}

	return gen.UpdateSettings204Response{}, nil
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
			w.Header().Add("Access-Control-Allow-Methods", "POST, GET, PUT, PATCH, DELETE, OPTIONS")

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
