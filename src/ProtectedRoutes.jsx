// src/components/ProtectedRoute.jsx
import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children, role, allowedRole }) => {
  if (!role) {
    return <Navigate to="/login" replace />
  }

  // If allowedRole is specified, check if the user's role matches
  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/" replace />;

  }

  return children
}

export default ProtectedRoute
