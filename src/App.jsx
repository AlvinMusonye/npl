// src/App.jsx
import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './LandingPage'
import Login from './Login'
import Signup from './Signup'

import ProtectedRoute from './ProtectedRoutes'

const App = () => {
  // This will be set after login (for example: 'admin', 'borrower', 'lender', 'recovery')
  const [role, setRole] = useState(null)

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
            <ProtectedRoute role={role} allowedRole="admin">

            </ProtectedRoute>
          }
        />
        <Route
          path="/borrower"
          element={
            <ProtectedRoute role={role} allowedRole="borrower">

            </ProtectedRoute>
          }
        />
        <Route
          path="/lender"
          element={
            <ProtectedRoute role={role} allowedRole="lender">

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
      </Routes>
    </Router>
  )
}

export default App
