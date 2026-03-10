import React from 'react';
import { Navigate } from 'react-router-dom';
import { AdminData } from '../context/AdminContext.jsx';

export const ProtectedAdminRoute = ({ children }) => {
  const { isAdminAuth } = AdminData();
  
  return isAdminAuth ? children : <Navigate to="/admin/login" replace />;
};

export const AdminLoginRoute = ({ children }) => {
  const { isAdminAuth } = AdminData();
  
  return isAdminAuth ? <Navigate to="/admin/dashboard" replace /> : children;
};
