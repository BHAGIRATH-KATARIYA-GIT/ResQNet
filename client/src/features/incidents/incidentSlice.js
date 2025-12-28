import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { incidentAPI } from './incidentAPI';

// Async thunks
export const fetchIncidents = createAsyncThunk(
  'incidents/fetchAll',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await incidentAPI.getIncidents(filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch incidents');
    }
  }
);

export const fetchIncidentById = createAsyncThunk(
  'incidents/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await incidentAPI.getIncidentById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch incident');
    }
  }
);

export const createIncident = createAsyncThunk(
  'incidents/create',
  async (incidentData, { rejectWithValue }) => {
    try {
      const response = await incidentAPI.createIncident(incidentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create incident');
    }
  }
);

export const updateIncidentStatus = createAsyncThunk(
  'incidents/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await incidentAPI.updateIncidentStatus(id, status);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update incident');
    }
  }
);

export const deleteIncident = createAsyncThunk(
  'incidents/delete',
  async (id, { rejectWithValue }) => {
    try {
      await incidentAPI.deleteIncident(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete incident');
    }
  }
);

export const fetchNearbyIncidents = createAsyncThunk(
  'incidents/fetchNearby',
  async ({ lng, lat, radius = 5 }, { rejectWithValue }) => {
    try {
      const response = await incidentAPI.getNearbyIncidents(lng, lat, radius);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch nearby incidents');
    }
  }
);

const initialState = {
  items: {},
  ids: [],
  currentIncident: null,
  nearbyIncidents: [],
  filters: {
    category: '',
    status: '',
    severity: '',
  },
  loading: false,
  error: null,
  lastUpdate: null,
};

const incidentSlice = createSlice({
  name: 'incidents',
  initialState,
  reducers: {
    // Socket update handlers
    socketNewIncident: (state, action) => {
      const incident = action.payload;
      if (!state.items[incident._id]) {
        state.items[incident._id] = incident;
        state.ids.unshift(incident._id);
      }
    },
    socketUpdateIncident: (state, action) => {
      const incident = action.payload;
      if (state.items[incident._id]) {
        state.items[incident._id] = { ...state.items[incident._id], ...incident };
      }
      if (state.currentIncident?._id === incident._id) {
        state.currentIncident = { ...state.currentIncident, ...incident };
      }
    },
    socketDeleteIncident: (state, action) => {
      const incidentId = action.payload;
      delete state.items[incidentId];
      state.ids = state.ids.filter((id) => id !== incidentId);
      if (state.currentIncident?._id === incidentId) {
        state.currentIncident = null;
      }
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentIncident: (state) => {
      state.currentIncident = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all incidents
      .addCase(fetchIncidents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIncidents.fulfilled, (state, action) => {
        state.loading = false;
        const incidents = action.payload;
        const normalized = {};
        incidents.forEach((incident) => {
          normalized[incident._id] = incident;
        });
        state.items = normalized;
        state.ids = incidents.map((incident) => incident._id);
        state.lastUpdate = new Date().toISOString();
      })
      .addCase(fetchIncidents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch by ID
      .addCase(fetchIncidentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIncidentById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentIncident = action.payload;
        // Also add to items
        state.items[action.payload._id] = action.payload;
      })
      .addCase(fetchIncidentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create incident
      .addCase(createIncident.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createIncident.fulfilled, (state, action) => {
        state.loading = false;
        const incident = action.payload;
        state.items[incident._id] = incident;
        state.ids.unshift(incident._id);
      })
      .addCase(createIncident.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update status
      .addCase(updateIncidentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateIncidentStatus.fulfilled, (state, action) => {
        state.loading = false;
        const incident = action.payload;
        state.items[incident._id] = incident;
        if (state.currentIncident?._id === incident._id) {
          state.currentIncident = incident;
        }
      })
      .addCase(updateIncidentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete incident
      .addCase(deleteIncident.fulfilled, (state, action) => {
        const incidentId = action.payload;
        delete state.items[incidentId];
        state.ids = state.ids.filter((id) => id !== incidentId);
        if (state.currentIncident?._id === incidentId) {
          state.currentIncident = null;
        }
      })
      // Fetch nearby
      .addCase(fetchNearbyIncidents.fulfilled, (state, action) => {
        state.nearbyIncidents = action.payload;
      });
  },
});

export const {
  socketNewIncident,
  socketUpdateIncident,
  socketDeleteIncident,
  setFilters,
  clearCurrentIncident,
  clearError,
} = incidentSlice.actions;

export default incidentSlice.reducer;

