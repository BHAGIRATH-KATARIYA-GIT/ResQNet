import { configureStore } from '@reduxjs/toolkit';
import incidentReducer from '../features/incidents/incidentSlice';
import adminReducer from '../features/admin/adminSlice';

export const store = configureStore({
  reducer: {
    incidents: incidentReducer,
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['incidents/socketUpdate'],
        ignoredPaths: ['incidents.socketUpdate'],
      },
    }),
});

