import { io } from 'socket.io-client';
import { store } from '../app/store';
import { socketNewIncident, socketUpdateIncident, socketDeleteIncident } from '../features/incidents/incidentSlice';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling'],
  autoConnect: true,
});

// Socket event handlers
socket.on('connect', () => {
  console.log('Connected to server:', socket.id);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

// Incident events
socket.on('incident:new', (data) => {
  console.log('New incident received:', data);
  store.dispatch(socketNewIncident(data.incident));
});

socket.on('incident:update', (data) => {
  console.log('Incident update received:', data);
  store.dispatch(socketUpdateIncident(data.incident));
});

socket.on('incident:delete', (data) => {
  console.log('Incident delete received:', data);
  store.dispatch(socketDeleteIncident(data.incidentId));
});

// Helper functions
export const joinIncidentRoom = (incidentId) => {
  socket.emit('join:incident', incidentId);
};

export const leaveIncidentRoom = (incidentId) => {
  socket.emit('leave:incident', incidentId);
};

export default socket;

