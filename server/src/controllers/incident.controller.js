import Incident from '../models/Incident.model.js';
import { findNearbyIncidents } from '../utils/geo.utils.js';

// @desc    Create a new incident
// @route   POST /api/incidents
// @access  Public
export const createIncident = async (req, res, next) => {
  try {
    const { title, description, category, severity, location, media = [] } = req.body;

    if (!title || !description || !category || !severity || !location || !location.coordinates) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const incident = new Incident({
      title,
      description,
      category,
      severity,
      location: {
        type: 'Point',
        coordinates: location.coordinates, // [lng, lat]
      },
      media,
      status: 'pending',
    });

    const savedIncident = await incident.save();

    // Emit socket event
    if (req.app.locals.socketHandlers) {
      req.app.locals.socketHandlers.emitNewIncident(savedIncident);
    }

    res.status(201).json({
      success: true,
      data: savedIncident,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all incidents with filters
// @route   GET /api/incidents
// @access  Public
export const getIncidents = async (req, res, next) => {
  try {
    const { category, status, severity, minSeverity, maxSeverity } = req.query;
    const query = {};

    if (category) {
      query.category = category;
    }

    if (status) {
      query.status = status;
    }

    if (severity) {
      query.severity = parseInt(severity);
    }

    if (minSeverity) {
      query.severity = { ...query.severity, $gte: parseInt(minSeverity) };
    }

    if (maxSeverity) {
      query.severity = { ...query.severity, $lte: parseInt(maxSeverity) };
    }

    const incidents = await Incident.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: incidents.length,
      data: incidents,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single incident by ID
// @route   GET /api/incidents/:id
// @access  Public
export const getIncidentById = async (req, res, next) => {
  try {
    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found',
      });
    }

    res.json({
      success: true,
      data: incident,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get nearby incidents
// @route   GET /api/incidents/nearby
// @access  Public
export const getNearbyIncidents = async (req, res, next) => {
  try {
    const { lng, lat, radius = 5 } = req.query;

    if (!lng || !lat) {
      return res.status(400).json({
        success: false,
        message: 'Longitude and latitude are required',
      });
    }

    const incidents = await findNearbyIncidents(
      parseFloat(lng),
      parseFloat(lat),
      parseFloat(radius)
    );

    res.json({
      success: true,
      count: incidents.length,
      data: incidents,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update incident status
// @route   PATCH /api/incidents/:id/status
// @access  Public (normally admin only)
export const updateIncidentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['pending', 'verified', 'resolved'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: pending, verified, or resolved',
      });
    }

    const incident = await Incident.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found',
      });
    }

    // Emit socket event
    if (req.app.locals.socketHandlers) {
      req.app.locals.socketHandlers.emitUpdatedIncident(incident);
    }

    res.json({
      success: true,
      data: incident,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete incident
// @route   DELETE /api/incidents/:id
// @access  Public (normally admin only)
export const deleteIncident = async (req, res, next) => {
  try {
    const incident = await Incident.findByIdAndDelete(req.params.id);

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found',
      });
    }

    // Emit socket event
    if (req.app.locals.socketHandlers) {
      req.app.locals.socketHandlers.emitDeletedIncident(req.params.id);
    }

    res.json({
      success: true,
      message: 'Incident deleted successfully',
      data: incident,
    });
  } catch (error) {
    next(error);
  }
};

