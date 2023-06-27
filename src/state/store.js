import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import api from './services/api';
import authApi from './services/auth';
import projectOverlayReducer from './features/projectOverlay/projectOverlaySlice';
import taskOverlayReducer from './features/taskOverlay/taskOverlaySlice';
import cellAddReducer from './features/cellAdd/cellAddSlice';
import themeReducer from './features/theme/themeSlice';

const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [api.reducerPath]: api.reducer,
    [authApi.reducerPath]: authApi.reducer,
    projectOverlay: projectOverlayReducer,
    taskOverlay: taskOverlayReducer,
    cellAdd: cellAddReducer,
    theme: themeReducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      api.middleware,
      authApi.middleware,
    ]),
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);

export default store;
