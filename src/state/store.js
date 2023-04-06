import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { todolistApi } from './services/todolist';
import { projectApi } from './services/project';

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [todolistApi.reducerPath]: todolistApi.reducer,
    [projectApi.reducerPath]: projectApi.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      todolistApi.middleware,
      projectApi.middleware,
    ]),
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);
