// src/App.jsx
import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './LandingPage'
import Login from './Login'
import Signup from './Signup'

import ProtectedRoute from './ProtectedRoutes'
import AdminDashboard from './Dashboards/AdminDashboard'
import MarketplacePlatform from './Dashboards/MarketPlacePlatform'
import ListAssetPage from './Dashboards/ListAssets'
import UserProfilePage from './Dashboards/UserProfilePage'



const App = () => {
  // This will be set after login (for example: 'admin', 'borrower', 'lender', 'recovery')
  const [role, setRole] = useState(() => {
    // Initialize role from localStorage on component mount
    const savedRole = localStorage.getItem('userRole');
    return savedRole || null;
  });  

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login setRole={setRole} />} />
        <Route path="/signup" element={<Signup />} />


        {/* Protected Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role={role} allowedRole="ADMIN">
                <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/borrower"
          element={
            <ProtectedRoute role={role} allowedRole="BORROWER">
              <ListAssetPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lender"
          element={
            <ProtectedRoute role={role} allowedRole="LENDER">
              <MarketplacePlatform />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recovery"
          element={
            <ProtectedRoute role={role} allowedRole="recovery">

            </ProtectedRoute>
          }
        />
                <Route
          path="/profile"
          element={
            <ProtectedRoute role={role} allowedRole="BORROWER">
              <UserProfilePage />
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  )
}

export default App
