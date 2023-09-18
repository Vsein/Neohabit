import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import api from './services/api';
import authApi from './services/auth';
import habitOverlayReducer from './features/habitOverlay/habitOverlaySlice';
import taskOverlayReducer from './features/taskOverlay/taskOverlaySlice';
import deleteOverlayReducer from './features/deleteOverlay/deleteOverlaySlice';
import cellAddReducer from './features/cellAdd/cellAddSlice';
import cellTipReducer from './features/cellTip/cellTipSlice';
import themeReducer, { changeTheme } from './features/theme/themeSlice';

const combinedReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  [authApi.reducerPath]: authApi.reducer,
  habitOverlay: habitOverlayReducer,
  taskOverlay: taskOverlayReducer,
  deleteOverlay: deleteOverlayReducer,
  cellAdd: cellAddReducer,
  cellTip: cellTipReducer,
  theme: themeReducer,
});

const rootReducer = (state, action) => {
  if (action.type === 'RESET') {
    state = undefined;
    // I'm not sure whether I should make it the default behavior
    // changeTheme('dark');
  }
  return combinedReducer(state, action);
};

const store = configureStore({
  reducer: rootReducer,
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([api.middleware, authApi.middleware]),
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);

export default store;
