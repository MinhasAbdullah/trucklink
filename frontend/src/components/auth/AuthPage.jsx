import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Truck, User, Briefcase, Shield, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialRole = searchParams.get("role") || "driver";
  
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [activeTab, setActiveTab] = useState("signin");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const roles = [
    { id: "driver", label: "Driver", icon: User, color: "from-emerald-500 to-teal-400" },
    { id: "recruiter", label: "Recruiter", icon: Briefcase, color: "from-blue-500 to-indigo-400" },
    { id: "admin", label: "Admin", icon: Shield, color: "from-purple-500 to-pink-400" },
  ];

  useEffect(() => {
    const role = searchParams.get("role");
    if (role && ["driver", "recruiter", "admin"].includes(role)) {
      setSelectedRole(role);
    }
  }, [searchParams]);

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    navigate(`/auth?role=${role}`, { replace: true });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowSuccess(false);
  };

  // ✅ FIXED: Login handler with email-specific profile check
  const handleSignIn = async (data) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      console.log("Sign in successful:", { ...data, role: selectedRole });
      
      // Store login info
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', data.email);
      localStorage.setItem('userRole', selectedRole);
      
      const role = selectedRole;
      if (role === "driver") {
        // ✅ Email-specific profile check
        const profileKey = `driverProfileSubmitted_${data.email}`;
        const hasProfile = localStorage.getItem(profileKey);
        
        if (hasProfile === 'true') {
          navigate("/driver/status");
        } else {
          navigate("/driver/profile");
        }
      } else if (role === "recruiter") {
        navigate("/recruiter/dashboard");
      } else {
        navigate("/admin/dashboard");
      }
    } catch (error) {
      throw new Error("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ FIXED: Signup handler
  const handleSignUp = async (data) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      console.log("Driver signup successful:", { ...data });
      
      // Store user info
      localStorage.setItem('driverEmail', data.email);
      localStorage.setItem('driverName', data.fullName);
      
      // ✅ Initialize profile as NOT submitted for this email
      const profileKey = `driverProfileSubmitted_${data.email}`;
      localStorage.setItem(profileKey, 'false');
      
      setShowSuccess(true);
      setTimeout(() => {
        setActiveTab("signin");
        setShowSuccess(false);
      }, 2000);
    } catch (error) {
      throw new Error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0f7f4] via-[#e8f5ee] to-[#d4ede3] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[460px]"
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/50">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1 text-[#8aa89a] hover:text-[#2d6a4f] transition-colors mb-4 text-sm group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>

          <motion.div 
            className="flex items-center justify-center gap-2 mb-6"
            initial={{ y: -10 }}
            animate={{ y: 0 }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-[#2d6a4f] to-[#409f7a] rounded-xl flex items-center justify-center shadow-lg">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#1a2a3a] to-[#2d6a4f] bg-clip-text text-transparent">
              Truck<span className="text-[#2d6a4f]">Link</span>
            </h1>
          </motion.div>

          <div className="grid grid-cols-3 gap-2 mb-6">
            {roles.map((role) => {
              const Icon = role.icon;
              const isActive = selectedRole === role.id;
              return (
                <motion.button
                  key={role.id}
                  onClick={() => handleRoleChange(role.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex flex-col items-center justify-center gap-1.5 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? `bg-gradient-to-r ${role.color} text-white shadow-md`
                      : "bg-[#e8f5ee] text-[#4a6a5a] hover:bg-[#d4ede3]"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-[#4a6a5a]"}`} />
                  <span>{role.label}</span>
                </motion.button>
              );
            })}
          </div>

          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-green-50 text-green-700 rounded-xl text-sm border border-green-200 text-center"
            >
              ✅ Account created successfully! Redirecting to login...
            </motion.div>
          )}

          <div className="flex border-b border-[#e0ece6] mb-6">
            <button
              onClick={() => handleTabChange("signin")}
              className={`flex-1 pb-3 text-sm font-medium transition-all relative ${
                activeTab === "signin"
                  ? "text-[#2d6a4f]"
                  : "text-[#8aa89a] hover:text-[#4a6a5a]"
              }`}
            >
              Log In
              {activeTab === "signin" && (
                <motion.div
                  layoutId="tabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2d6a4f]"
                />
              )}
            </button>
            {selectedRole !== "admin" && (
              <button
                onClick={() => handleTabChange("signup")}
                className={`flex-1 pb-3 text-sm font-medium transition-all relative ${
                  activeTab === "signup"
                    ? "text-[#2d6a4f]"
                    : "text-[#8aa89a] hover:text-[#4a6a5a]"
                }`}
              >
                Sign Up
                {activeTab === "signup" && (
                  <motion.div
                    layoutId="tabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2d6a4f]"
                  />
                )}
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "signin" ? (
              <motion.div
                key="signin"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <SignIn 
                  onSignIn={handleSignIn} 
                  isLoading={isLoading} 
                  selectedRole={selectedRole} 
                  onSwitchToSignUp={() => setActiveTab("signup")}
                />
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <SignUp 
                  onSignUp={handleSignUp} 
                  isLoading={isLoading} 
                  selectedRole={selectedRole}
                  onSwitchToSignIn={() => setActiveTab("signin")}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div 
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-xs text-[#8aa89a]">
              {selectedRole === "driver" && "🚛 Create your driver profile and find jobs"}
              {selectedRole === "recruiter" && "📋 Post jobs and find verified drivers"}
              {selectedRole === "admin" && "⚙️ Manage the platform and moderate users"}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;