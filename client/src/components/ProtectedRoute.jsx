import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAdminAuthenticated } from '../features/admin/adminSelectors';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAdminAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

export default ProtectedRoute;

