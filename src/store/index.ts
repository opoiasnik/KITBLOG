import { configureStore } from '@reduxjs/toolkit';
import blogReducer from './blogSlice';

export const store = configureStore({
  reducer: {
    blog: blogReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Полностью отключаем проверки сериализации для разработки
      serializableCheck: false,
      immutableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 