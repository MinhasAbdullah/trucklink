import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthPage from "./components/auth/AuthPage";
import DriverProfileForm from "./components/auth/DriverProfileForm";
import DriverDashboard from "./components/driver/DriverDashboard";
import DriverStatusTracking from "./components/driver/DriverStatusTracking";
import AdminShell from "./components/layout/AdminShell";
import AdminRoute from "./components/routes/AdminRoute";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import PublicRoute from "./components/routes/PublicRoute";
import RoleRoute from "./components/routes/RoleRoute";
import { AdminModerationProvider } from "./context/AdminModerationContext";
import { AdminRecruitersProvider } from "./context/AdminRecruitersContext";
import LandingPage from "./pages/LandingPage";
import RoleSelection from "./pages/RoleSelection";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminModerationQueue from "./pages/admin/AdminModerationQueue";
import AdminOperations from "./pages/admin/AdminOperations";
import AdminRecruiters from "./pages/admin/AdminRecruiters";
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import LoadsPage from "./pages/operations/LoadsPage";
import TrucksPage from "./pages/operations/TrucksPage";
import MatchesPage from "./pages/operations/MatchesPage";

const AdminArea = () => (
  <AdminModerationProvider>
    <AdminRecruitersProvider>
      <AdminShell />
    </AdminRecruitersProvider>
  </AdminModerationProvider>
);

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/roles" element={<RoleSelection />} />
        <Route path="/auth" element={<AuthPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRole="driver" />}>
          <Route path="/driver" element={<DriverDashboard />} />
          <Route path="/driver/profile" element={<DriverProfileForm />} />
          <Route path="/driver/status" element={<DriverStatusTracking />} />
          <Route path="/driver/trucks" element={<TrucksPage />} />
          <Route path="/driver/matches" element={<MatchesPage />} />
        </Route>

        <Route element={<RoleRoute allowedRole="recruiter" />}>
          <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
          <Route path="/recruiter/loads" element={<LoadsPage />} />
          <Route path="/recruiter/matches" element={<MatchesPage />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route element={<AdminArea />}>
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/moderation" element={<AdminModerationQueue />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/recruiters" element={<AdminRecruiters />} />
            <Route path="/admin/operations" element={<AdminOperations />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default App;
