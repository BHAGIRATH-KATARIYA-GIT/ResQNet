export const setupIncidentSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });

    // Join a room for a specific incident
    socket.on('join:incident', (incidentId) => {
      socket.join(`incident:${incidentId}`);
      console.log(`Socket ${socket.id} joined incident:${incidentId}`);
    });

    // Leave a room for a specific incident
    socket.on('leave:incident', (incidentId) => {
      socket.leave(`incident:${incidentId}`);
      console.log(`Socket ${socket.id} left incident:${incidentId}`);
    });
  });

  // Helper function to emit incident events
  const emitIncidentEvent = (event, data) => {
    io.emit(event, data);

    // Also emit to specific incident room if incident has ID
    if (data.incident?._id || data.incident?.id) {
      const incidentId = data.incident._id || data.incident.id;
      io.to(`incident:${incidentId}`).emit(event, data);
    }
  };

  return {
    emitNewIncident: (incident) => {
      emitIncidentEvent('incident:new', { incident });
    },
    emitUpdatedIncident: (incident) => {
      emitIncidentEvent('incident:update', { incident });
    },
    emitDeletedIncident: (incidentId) => {
      emitIncidentEvent('incident:delete', { incidentId });
    },
  };
};

