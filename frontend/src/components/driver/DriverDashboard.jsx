import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DriverDashboard = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if profile exists
    const hasProfile = localStorage.getItem('driverProfileSubmitted');
    if (hasProfile === 'true') {
      navigate("/driver/status");
    } else {
      navigate("/driver/profile");
    }
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#2d6a4f] border-t-transparent"></div>
    </div>
  );
};

export default DriverDashboard;