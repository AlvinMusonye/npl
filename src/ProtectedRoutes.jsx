// src/components/ProtectedRoute.jsx
import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children, role, allowedRole }) => {
  if (!role) {
    return <Navigate to="/login" replace />
  }

  if (role !== allowedRole) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
