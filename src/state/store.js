import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import localForage from 'localforage';
import api from './services/api';
import authApi from './services/auth';
import rtkQueryErrorLogger from './services/errorHandler';
import overlayReducer from './features/overlay/overlaySlice';
import cellAddReducer from './features/cellAdd/cellAddSlice';
import cellTipReducer from './features/cellTip/cellTipSlice';
import isPWA from '../utils/pwa';

const combinedReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  [authApi.reducerPath]: authApi.reducer,
  overlay: overlayReducer,
  cellAdd: cellAddReducer,
  cellTip: cellTipReducer,
});

const rootReducer = (state, action) => {
  if (action.type === 'RESET') {
    state = undefined;
    // I'm not sure whether I should make it the default behavior
    // changeTheme('dark');
  }
  return combinedReducer(state, action);
};

const persistConfig = {
  key: 'root',
  version: 1,
  storage: localForage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: isPWA() ? persistedReducer : rootReducer,
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: isPWA()
        ? {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          }
        : false,
    }).concat([rtkQueryErrorLogger, api.middleware, authApi.middleware]),
});

const persistor = persistStore(store);

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);

export { store, persistor };
