/**
 * Map service utilities for Leaflet operations
 */

export const DEFAULT_CENTER = [40.7128, -74.0060]; // New York City default
export const DEFAULT_ZOOM = 13;

/**
 * Get severity color for map markers
 */
export const getSeverityColor = (severity) => {
  switch (severity) {
    case 1:
      return 'green';
    case 2:
      return 'blue';
    case 3:
      return 'yellow';
    case 4:
      return 'orange';
    case 5:
      return 'red';
    default:
      return 'gray';
  }
};

/**
 * Get category icon
 */
export const getCategoryIcon = (category) => {
  const icons = {
    Fire: '🔥',
    Accident: '🚗',
    Crime: '🚨',
    Disaster: '🌪️',
  };
  return icons[category] || '📍';
};

/**
 * Format coordinates for display
 */
export const formatCoordinates = (coordinates) => {
  if (!coordinates || coordinates.length !== 2) return 'N/A';
  return `${coordinates[1].toFixed(6)}, ${coordinates[0].toFixed(6)}`;
};

