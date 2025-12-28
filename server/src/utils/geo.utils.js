import Incident from '../models/Incident.model.js';

/**
 * Find incidents within a radius from a point
 * @param {number} longitude - Longitude of the center point
 * @param {number} latitude - Latitude of the center point
 * @param {number} radiusKm - Radius in kilometers
 * @returns {Promise<Array>} Array of nearby incidents
 */
export const findNearbyIncidents = async (longitude, latitude, radiusKm = 5) => {
  const radiusInMeters = radiusKm * 1000;

  const nearbyIncidents = await Incident.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        $maxDistance: radiusInMeters,
      },
    },
  })
    .sort({ createdAt: -1 })
    .limit(10);

  return nearbyIncidents;
};

/**
 * Calculate distance between two points (Haversine formula)
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

