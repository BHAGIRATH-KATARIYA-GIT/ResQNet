import { createSelector } from '@reduxjs/toolkit';

const selectAdminState = (state) => state.admin;

export const selectIsAdminAuthenticated = createSelector(
  [selectAdminState],
  (adminState) => adminState.isAuthenticated
);

export const selectAdmin = createSelector([selectAdminState], (adminState) => adminState.admin);

export const selectAdminLoading = createSelector([selectAdminState], (adminState) => adminState.loading);

export const selectAdminError = createSelector([selectAdminState], (adminState) => adminState.error);

