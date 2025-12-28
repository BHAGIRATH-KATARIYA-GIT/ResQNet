import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api/incidents';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const incidentAPI = {
  // Get all incidents with optional filters
  getIncidents: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.status) params.append('status', filters.status);
    if (filters.severity) params.append('severity', filters.severity);
    if (filters.minSeverity) params.append('minSeverity', filters.minSeverity);
    if (filters.maxSeverity) params.append('maxSeverity', filters.maxSeverity);

    const response = await api.get(`?${params.toString()}`);
    return response.data;
  },

  // Get single incident by ID
  getIncidentById: async (id) => {
    const response = await api.get(`/${id}`);
    return response.data;
  },

  // Create new incident
  createIncident: async (incidentData) => {
    const response = await api.post('/', incidentData);
    return response.data;
  },

  // Update incident status
  updateIncidentStatus: async (id, status) => {
    const response = await api.patch(`/${id}/status`, { status });
    return response.data;
  },

  // Delete incident
  deleteIncident: async (id) => {
    const response = await api.delete(`/${id}`);
    return response.data;
  },

  // Get nearby incidents
  getNearbyIncidents: async (lng, lat, radius = 5) => {
    const response = await api.get(`/nearby?lng=${lng}&lat=${lat}&radius=${radius}`);
    return response.data;
  },
};

