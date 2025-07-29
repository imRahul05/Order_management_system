import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { hasRole } from '../utils/roleCheck';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  const getStoredAuth = () => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (!storedToken || !storedUser) return { hasAuth: false, userInfo: null };
    
    try {
      const parsedUser = JSON.parse(storedUser);
      return { hasAuth: true, userInfo: parsedUser };
    } catch {
      return { hasAuth: false, userInfo: null };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check context state first, then fallback to localStorage
  const contextHasAuth = isAuthenticated && user;
  const { hasAuth: storedHasAuth, userInfo: storedUser } = getStoredAuth();
  
  const finalHasAuth = contextHasAuth || storedHasAuth;
  const finalUser = user || storedUser;

  if (!finalHasAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !hasRole(finalUser, allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
