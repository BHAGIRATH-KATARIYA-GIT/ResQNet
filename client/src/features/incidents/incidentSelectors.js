import { createSelector } from '@reduxjs/toolkit';

const selectIncidentsState = (state) => state.incidents;

export const selectAllIncidents = createSelector(
  [selectIncidentsState],
  (incidentsState) => incidentsState.ids.map((id) => incidentsState.items[id])
);

export const selectIncidentById = (id) =>
  createSelector(
    [selectIncidentsState],
    (incidentsState) => incidentsState.items[id] || incidentsState.currentIncident
  );

export const selectFilteredIncidents = createSelector(
  [selectAllIncidents, selectIncidentsState],
  (incidents, incidentsState) => {
    const { filters } = incidentsState;
    return incidents.filter((incident) => {
      if (filters.category && incident.category !== filters.category) return false;
      if (filters.status && incident.status !== filters.status) return false;
      if (filters.severity && incident.severity !== parseInt(filters.severity)) return false;
      return true;
    });
  }
);

export const selectPendingIncidents = createSelector([selectAllIncidents], (incidents) =>
  incidents.filter((incident) => incident.status === 'pending')
);

export const selectIncidentsByStatus = (status) =>
  createSelector([selectAllIncidents], (incidents) =>
    incidents.filter((incident) => incident.status === status)
  );

export const selectLoading = createSelector([selectIncidentsState], (state) => state.loading);
export const selectError = createSelector([selectIncidentsState], (state) => state.error);
export const selectCurrentIncident = createSelector(
  [selectIncidentsState],
  (state) => state.currentIncident
);
export const selectNearbyIncidents = createSelector(
  [selectIncidentsState],
  (state) => state.nearbyIncidents
);
export const selectFilters = createSelector([selectIncidentsState], (state) => state.filters);

