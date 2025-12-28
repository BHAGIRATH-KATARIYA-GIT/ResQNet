import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import connectDB from './config/db.js';
import { setupIncidentSocket } from './sockets/incident.socket.js';

const PORT = process.env.PORT || 5000;

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Setup socket handlers
const socketHandlers = setupIncidentSocket(io);

// Make socket handlers available to controllers via app.locals
app.locals.socketHandlers = socketHandlers;

// Connect to database
connectDB();

// Start server
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.IO ready for connections`);
});

export { io };

