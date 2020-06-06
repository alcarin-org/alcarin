import {
  configureStore,
  createImmutableStateInvariantMiddleware,
  createSerializableStateInvariantMiddleware,
} from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import rootReducer from './reducer';

export const store = configureStore({
  reducer: rootReducer,
  middleware: [
    createImmutableStateInvariantMiddleware(),
    createSerializableStateInvariantMiddleware(),
  ],
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
