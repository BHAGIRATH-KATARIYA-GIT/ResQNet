import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import incidentRoutes from './routes/incident.routes.js';
import { errorHandler, notFound } from './middlewares/error.middleware.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Incident Tracking API' });
});

app.use('/api/incidents', incidentRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;

