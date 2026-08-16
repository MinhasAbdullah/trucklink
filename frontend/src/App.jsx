import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import RoleSelection from "./pages/RoleSelection";
import AuthPage from "./components/auth/AuthPage";
import DriverProfileForm from "./components/auth/DriverProfileForm";
import DriverStatusTracking from "./components/driver/DriverStatusTracking";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminAnalytics from "./components/admin/AdminAnalytics";
import AdminMasterData from "./components/admin/AdminMasterData";
import AdminRecruiters from "./components/admin/AdminRecruiters";

// ✅ Protected Route Component
const ProtectedAdminRoute = ({ children }) => {
  const userRole = localStorage.getItem('userRole');
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  
  // Agar admin logged in nahi hai toh role selection pe bhejo
  if (!isLoggedIn || userRole !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<RoleSelection />} />
        <Route path="/auth" element={<AuthPage />} />
        
        {/* Driver Routes */}
        <Route path="/driver/profile" element={<DriverProfileForm />} />
        <Route path="/driver/status" element={<DriverStatusTracking />} />
        
        {/* ✅ Admin Routes - Protected */}
        <Route path="/admin" element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        }>
          <Route index element={<Navigate to="/admin/analytics" replace />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="recruiters" element={<AdminRecruiters />} />
          <Route path="master-data" element={<AdminMasterData />} />
          <Route path="moderation" element={
            <div className="text-center py-10 text-gray-500">
              Moderation Queue - Coming Soon
            </div>
          } />
        </Route>
        
        {/* Redirect any unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;