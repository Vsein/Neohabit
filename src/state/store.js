import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { todolistApi } from './services/todolist';
import { projectApi } from './services/project';
import { heatmapApi } from './services/heatmap';
import projectOverlayReducer from './features/projectOverlay/projectOverlaySlice';
import taskOverlayReducer from './features/taskOverlay/taskOverlaySlice';
import cellAddReducer from './features/cellAdd/cellAddSlice';

const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [todolistApi.reducerPath]: todolistApi.reducer,
    [projectApi.reducerPath]: projectApi.reducer,
    [heatmapApi.reducerPath]: heatmapApi.reducer,
    projectOverlay: projectOverlayReducer,
    taskOverlay: taskOverlayReducer,
    cellAdd: cellAddReducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      todolistApi.middleware,
      projectApi.middleware,
      heatmapApi.middleware,
    ]),
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);

export default store;
