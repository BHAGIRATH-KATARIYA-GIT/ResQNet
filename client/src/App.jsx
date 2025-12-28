import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { store } from './app/store';
import ReportIncident from './pages/ReportIncident';
import IncidentFeedDashboard from './pages/IncidentFeedDashboard';
import IncidentDetails from './pages/IncidentDetails';
import IncidentVerification from './pages/IncidentVerification';
import LoginForAdmin from './pages/LoginForAdmin';
import ProtectedRoute from './components/ProtectedRoute';
import { checkAuth } from './features/admin/adminSlice';
import './sockets/socket'; // Initialize socket connection

// Component to check auth on app load
const AppContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if admin is already authenticated from localStorage
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/feed" replace />} />
      <Route path="/feed" element={<IncidentFeedDashboard />} />
      <Route path="/report" element={<ReportIncident />} />
      <Route path="/incidents/:id" element={<IncidentDetails />} />
      <Route
        path="/verify"
        element={
          <ProtectedRoute>
            <IncidentVerification />
          </ProtectedRoute>
        }
      />
      <Route path="/admin-login" element={<LoginForAdmin />} />
    </Routes>
  );
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;

