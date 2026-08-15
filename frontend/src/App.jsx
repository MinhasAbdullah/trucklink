import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import RoleSelection from "./pages/RoleSelection";
import AuthPage from "./components/auth/AuthPage";
import DriverProfileForm from "./components/auth/DriverProfileForm";
import DriverStatusTracking from "./components/driver/DriverStatusTracking";

function App() {
  return (
    <Router>
      <Routes>
        {/* Role Selection Page */}
        <Route path="/" element={<RoleSelection />} />
        
        {/* Authentication Page */}
        <Route path="/auth" element={<AuthPage />} />
        
        {/* Driver Profile Form */}
        <Route path="/driver/profile" element={<DriverProfileForm />} />
        
        {/* Driver Status Tracking - After profile submission */}
        <Route path="/driver/status" element={<DriverStatusTracking />} />
        
        {/* Future routes */}
        {/* <Route path="/driver/dashboard" element={<DriverDashboard />} /> */}
        {/* <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} /> */}
        {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
        
        {/* Redirect any unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;