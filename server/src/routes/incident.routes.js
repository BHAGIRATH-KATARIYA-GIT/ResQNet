import express from 'express';
import {
  createIncident,
  getIncidents,
  getIncidentById,
  getNearbyIncidents,
  updateIncidentStatus,
  deleteIncident,
} from '../controllers/incident.controller.js';

const router = express.Router();

router.post('/', createIncident);
router.get('/', getIncidents);
router.get('/nearby', getNearbyIncidents);
router.get('/:id', getIncidentById);
router.patch('/:id/status', updateIncidentStatus);
router.delete('/:id', deleteIncident);

export default router;

