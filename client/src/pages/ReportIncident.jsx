import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import MapView from '../components/MapView';
import { createIncident } from '../features/incidents/incidentSlice';
import { selectLoading, selectError } from '../features/incidents/incidentSelectors';
import { DEFAULT_CENTER } from '../services/map.service';

const ReportIncident = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Fire',
    severity: 1,
    location: null,
    media: [],
  });

  const [selectedLocation, setSelectedLocation] = useState(DEFAULT_CENTER);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPreview, setMediaPreview] = useState([]);

  useEffect(() => {
    // Get user's current location if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSelectedLocation([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          console.log('Geolocation not available');
        }
      );
    }
  }, []);

  const handleMapClick = (coords) => {
    const [lat, lng] = coords;
    setSelectedLocation(coords);
    setFormData({
      ...formData,
      location: {
        type: 'Point',
        coordinates: [lng, lat], // MongoDB expects [lng, lat]
      },
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'severity' ? parseInt(value) : value,
    });
  };

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    setMediaFiles(files);

    // Create preview URLs
    const previews = files.map((file) => URL.createObjectURL(file));
    setMediaPreview(previews);

    // In a real app, you'd upload to a storage service (S3, Cloudinary, etc.)
    // For now, we'll just store the file names/paths
    setFormData({
      ...formData,
      media: files.map((file) => file.name),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.location) {
      alert('Please select a location on the map');
      return;
    }

    try {
      await dispatch(createIncident(formData)).unwrap();
      navigate('/feed');
    } catch (err) {
      console.error('Failed to create incident:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Report an Incident</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Incident Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Building Fire on Main Street"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Fire">🔥 Fire</option>
                <option value="Accident">🚗 Accident</option>
                <option value="Crime">🚨 Crime</option>
                <option value="Disaster">🌪️ Disaster</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Provide detailed information about the incident..."
              />
            </div>

            {/* Severity */}
            <div>
              <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-2">
                Severity Level * (1-5)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  id="severity"
                  name="severity"
                  min="1"
                  max="5"
                  value={formData.severity}
                  onChange={handleInputChange}
                  className="flex-1"
                />
                <span className="text-lg font-bold text-gray-900 w-8 text-center">
                  {formData.severity}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Low</span>
                <span>Critical</span>
              </div>
            </div>

            {/* Location Picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location * (Click on map to set)
              </label>
              <div className="h-96 rounded-lg overflow-hidden border border-gray-300">
                <MapView
                  clickable
                  onMapClick={handleMapClick}
                  selectedLocation={formData.location ? [formData.location.coordinates[1], formData.location.coordinates[0]] : null}
                  center={selectedLocation}
                  zoom={13}
                />
              </div>
              {formData.location && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: {formData.location.coordinates[1].toFixed(6)},{' '}
                  {formData.location.coordinates[0].toFixed(6)}
                </p>
              )}
            </div>

            {/* Media Upload */}
            <div>
              <label htmlFor="media" className="block text-sm font-medium text-gray-700 mb-2">
                Media (Images/Video)
              </label>
              <input
                type="file"
                id="media"
                name="media"
                multiple
                accept="image/*,video/*"
                onChange={handleMediaChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {mediaPreview.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-4">
                  {mediaPreview.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Incident'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/feed')}
                className="px-6 py-3 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportIncident;

