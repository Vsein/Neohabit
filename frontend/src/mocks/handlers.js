import { http, HttpResponse } from 'msw';
import { compareAsc } from 'date-fns';
import mockProjects from './mockProjects';
import newId from '../utils/newId';

const currentDate = new Date();

export const demoHandlers = [
  http.get('/mock_api/settings', () =>
    HttpResponse.json({
      allow_horizontal_scrolling: true,
      cell_height_multiplier: 1,
      cell_width_multiplier: 1,
      created_at: currentDate,
      habit_heatmaps_current_day: 'middle',
      habit_heatmaps_override: false,
      hide_cell_hint: false,
      hide_onboarding: false,
      id: 'settings',
      modals_live_color_preview: true,
      overview_apply_limit: false,
      overview_current_day: 'middle',
      overview_duration: 45,
      overview_duration_limit: 45,
      overview_offset: 0,
      overview_vertical: false,
      projects_enable_custom_order: true,
      projects_enable_overview_mode: false,
      read_settings_from_config_file: false,
      show_stopwatch_time_in_page_title: true,
      theme: 'dark',
      updated_at: currentDate,
      user_id: 'demo',
    }),
  ),

  http.get('/mock_api/stopwatch', () =>
    HttpResponse.json({
      created_at: currentDate,
      duration: 0,
      habit_id: '0-0',
      id: 'stopwatch',
      is_initiated: true,
      is_paused: true,
      pause_duration: 0,
      start_time: currentDate,
      updated_at: currentDate,
      user_id: 'mock',
    }),
  ),

  http.get('/mock_api/user', () =>
    HttpResponse.json({
      created_at: currentDate,
      id: 'mock',
      updated_at: currentDate,
      username: 'demo',
      verification_attempts: 0,
      verification_time: currentDate,
      verified: true,
    }),
  ),

  http.get('/mock_api/projects', () => HttpResponse.json(mockProjects)),

  http.get('/mock_api/habits', () =>
    HttpResponse.json(
      mockProjects
        .flatMap((project) => project.habits)
        .sort((h1, h2) => compareAsc(h1.created_at, h2.created_at)),
    ),
  ),

  http.get('/mock_api/habits/outside_projects', () => HttpResponse.json([])),

  http.post('/mock_api/login', async ({ request }) => {
    const body = await request.json();
    // fake success / fail depending on payload
    if (body.email?.includes('demo')) {
      return HttpResponse.json({ token: 'fake-jwt-demo-token' });
    }
    return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }),

  http.post('/mock_api/habit', () => HttpResponse.json(newId())),
  http.post('/mock_api/habit/:habitID/target', () => HttpResponse.json(newId())),
  http.post('/mock_api/project', () => HttpResponse.json(newId())),
  http.post('/mock_api/task', () => HttpResponse.json(newId())),
  http.post('/mock_api/skill', () => HttpResponse.json(newId())),
  http.post('/mock_api/skilltree', () =>
    HttpResponse.json({
      skilltree_id: newId(),
      skill_id: newId(),
    }),
  ),

  http.all('*', () => {}),
];
