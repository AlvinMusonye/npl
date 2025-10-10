// src/App.jsx
import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './LandingPage'
import Login from './Login'
import Signup from './Signup'

import ProtectedRoute from './ProtectedRoutes'
import AdminDashboard from './Dashboards/AdminDashboard'
import MarketplacePlatform from './Dashboards/MarketPlacePlatform'
import BorrowerDashboard from './Borrower/BorrowerDashboard'
import MyAssetsPage from './Borrower/MyAssets'
import RegisterAssetPage from './Borrower/RegisterAsset'
import MyOffersPage from './Borrower/MyOffers'
import MyDocumentsPage from './Borrower/MyDocuments'
import MyTransactionsPage from './Borrower/Records'
import CommunicationsPage from './Borrower/Communications'
import UserProfilePage from './Borrower/UserProfilePage'
import LenderDashboard from './Lender/LenderDashboard'
import AssetListings from './Lender/AssetListings'
import RegisterAssetPageLender from './Lender/RegisterAsset'
import ContactRequestsPage from './Lender/ContactRequests'
import TransactionRecordsPage from './Lender/TransactionRecords';
import FinancierDashboard from './Financier/FinancierDashboard';
import AssetMarketplace from './Financier/AssetMarketplace';
import MyOffersMade from './Financier/MyOffersMade';
import TransactionRecordsPageFinancier from './Financier/TransactionRecords';
import BuyerDashboard from './Buyer/BuyerDashboard';
import RepossedMarketplace from './Buyer/RepossedMarketplace';
import TransactionRecordsPageBuyer from './Buyer/TransactionRecords';
import ConversationsPage from './Buyer/Conversations';




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

        {/* Redirect from generic /dashboard to role-specific dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role={role}>
              {role === 'ADMIN' && <Navigate to="/admin/dashboard" replace />}
              {role === 'BORROWER' && <Navigate to="/borrower" replace />}
              {role === 'LENDER' && <Navigate to="/lender" replace />}
              {role === 'FINANCIER' && <Navigate to="/financier" replace />}
              {role === 'BUYER' && <Navigate to="/buyer/dashboard" replace />}
              {!role && <Navigate to="/login" replace />}
            </ProtectedRoute>
          }
        />


        {/* Protected Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute role={role} allowedRole="ADMIN">
                <AdminDashboard setRole={setRole} />
                </ProtectedRoute>
          }
        />
                <Route
          path="/financier"
          element={
            <ProtectedRoute role={role} allowedRole="FINANCIER">
              <FinancierDashboard setRole={setRole} />
              </ProtectedRoute>
          }
        />
        <Route
          path="/financier/marketplace"
          element={
            <ProtectedRoute role={role} allowedRole="FINANCIER">
              <AssetMarketplace setRole={setRole} />
              </ProtectedRoute>
          }
        />
        <Route
          path="/financier/offers-made"
          element={
            <ProtectedRoute role={role} allowedRole="FINANCIER">
              <MyOffersMade setRole={setRole} />
              </ProtectedRoute>
          }
        />
        <Route
          path="/financier/record-transaction"
          element={
            <ProtectedRoute role={role} allowedRole="FINANCIER">
              <TransactionRecordsPageFinancier setRole={setRole} />
              </ProtectedRoute>
          }
        />

        <Route
          path="/borrower"
          element={
            <ProtectedRoute role={role} allowedRole="BORROWER">
              <BorrowerDashboard setRole={setRole} />
              </ProtectedRoute>
          }
        />
        <Route
          path="/borrower/assets"
          element={
            <ProtectedRoute role={role} allowedRole="BORROWER">
              <MyAssetsPage setRole={setRole} />
              </ProtectedRoute>
          }
        />
        <Route
          path="/borrower/register-asset"
          element={
            <ProtectedRoute role={role} allowedRole="BORROWER">
              <RegisterAssetPage setRole={setRole} />
              </ProtectedRoute>
          }
        />
        <Route
          path="/borrower/offers"
          element={
            <ProtectedRoute role={role} allowedRole="BORROWER">
              <MyOffersPage setRole={setRole} />
              </ProtectedRoute>
          }
        />
        <Route
          path="/borrower/documents"
          element={
            <ProtectedRoute role={role} allowedRole="BORROWER">
              <MyDocumentsPage setRole={setRole} />
              </ProtectedRoute>
          }
        />
        <Route
          path="/borrower/transactions"
          element={
            <ProtectedRoute role={role} allowedRole="BORROWER">
              <MyTransactionsPage setRole={setRole} />
              </ProtectedRoute>
          }
        />
        <Route
          path="/borrower/communication"
          element={
            <ProtectedRoute role={role} allowedRole="BORROWER">
              <CommunicationsPage setRole={setRole} />
              </ProtectedRoute>
          }
        />

        <Route
          path="/lender"
          element={
            <ProtectedRoute role={role} allowedRole="LENDER">
              <LenderDashboard setRole={setRole} />
              </ProtectedRoute>
          }
        />
        <Route
          path="/lender/assets"
          element={
            <ProtectedRoute role={role} allowedRole="LENDER">
              <AssetListings setRole={setRole} />
              </ProtectedRoute>
          }
        />
        <Route
          path="/lender/register-asset"
          element={
            <ProtectedRoute role={role} allowedRole="LENDER">
              <RegisterAssetPageLender setRole={setRole} />
              </ProtectedRoute>
          }
        />
        <Route
          path="/lender/contact-requests"
          element={
            <ProtectedRoute role={role} allowedRole="LENDER">
              <ContactRequestsPage setRole={setRole} />
              </ProtectedRoute>
          }
        />
        <Route
          path="/lender/record-transaction"
          element={
            <ProtectedRoute role={role} allowedRole="LENDER">
              <TransactionRecordsPage setRole={setRole} />
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
            <ProtectedRoute role={role}>
              <UserProfilePage role={role} setRole={setRole} />
              </ProtectedRoute>
          }
        />
        <Route
          path="/buyer/dashboard"
          element={
            <ProtectedRoute role={role} allowedRole="BUYER">
              <BuyerDashboard setRole={setRole} />
              </ProtectedRoute>
          }
        />
        <Route
          path="/buyer/marketplace"
          element={
            <ProtectedRoute role={role} allowedRole="BUYER">
              <RepossedMarketplace setRole={setRole} />
              </ProtectedRoute>
          }
        />
        <Route
          path="/buyer/record-transaction"
          element={
            <ProtectedRoute role={role} allowedRole="BUYER">
              <TransactionRecordsPageBuyer setRole={setRole} />
              </ProtectedRoute>
          }
        />
        <Route
          path="/buyer/conversations"
          element={
            <ProtectedRoute role={role} allowedRole="BUYER">
              <ConversationsPage setRole={setRole} />
              </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  )
}

export default App
