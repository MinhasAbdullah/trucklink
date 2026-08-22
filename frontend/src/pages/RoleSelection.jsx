import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Truck, ArrowRight, Users, Briefcase, Shield, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const RoleSelection = () => {
  const navigate = useNavigate();
  const [hoveredRole, setHoveredRole] = useState(null);

  const roles = [
    {
      id: "driver",
      title: "Driver",
      description: "Find driving jobs and build your career",
      icon: Users,
      features: ["Create Profile", "Find Jobs", "Track Status"],
      avatar: "/images/driver-avatar.png",
      avatarAlt: "Driver avatar",
      color: "from-emerald-500 to-teal-400",
    },
    {
      id: "recruiter",
      title: "Recruiter",
      description: "Find and hire verified driving talent",
      icon: Briefcase,
      features: ["Post Jobs", "Find Talent", "Shortlist Drivers"],
      avatar: "/images/recruiter-avatar.png",
      avatarAlt: "Recruiter avatar",
      color: "from-blue-500 to-indigo-400",
    },
    {
      id: "admin",
      title: "Admin",
      description: "Manage and grow the platform",
      icon: Shield,
      features: ["Moderate Profiles", "Manage Users", "Analytics"],
      avatar: "/images/admin-avatar.png",
      avatarAlt: "Admin avatar",
      color: "from-purple-500 to-pink-400",
    },
  ];

  const handleRoleSelect = (roleId) => {
    navigate(`/auth?role=${roleId}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0f7f4] via-[#e8f5ee] to-[#d4ede3] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-[#2d6a4f] to-[#409f7a] rounded-2xl flex items-center justify-center shadow-lg">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#1a2a3a] to-[#2d6a4f] bg-clip-text text-transparent">
              Truck<span className="text-[#2d6a4f]">Link</span>
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-semibold text-[#1a2a3a] mb-3">
              Welcome to TruckLink
            </h2>
            <p className="text-lg text-[#4a6a5a] max-w-2xl mx-auto">
              The ultimate platform connecting drivers with recruiters. 
              Choose your role to get started.
            </p>
          </motion.div>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role, index) => {
            const Icon = role.icon;
            const isHovered = hoveredRole === role.id;
            
            return (
              <motion.button
                key={role.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredRole(role.id)}
                onMouseLeave={() => setHoveredRole(null)}
                onClick={() => handleRoleSelect(role.id)}
                className="group relative flex flex-col items-center text-center p-8 rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-[#2d6a4f]"
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                {/* Avatar */}
                <div className="relative mb-5">
                  <motion.div
                    className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#e8f5ee] shadow-md"
                    animate={isHovered ? { scale: 1.1, rotate: [0, -5, 5, 0] } : { scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img 
                      src={role.avatar} 
                      alt={role.avatarAlt || role.title}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  
                  {/* Role icon badge */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isHovered ? { scale: 1 } : { scale: 0 }}
                    className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-r ${role.color} flex items-center justify-center shadow-lg`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </motion.div>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-[#1a2a3a] mb-2">
                  {role.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-[#4a6a5a] mb-4 leading-relaxed">
                  {role.description}
                </p>

                {/* Features */}
                <div className="flex flex-col gap-1.5 mb-5 w-full">
                  {role.features.map((feature, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={isHovered ? { opacity: 1, x: 0 } : { opacity: 0.6, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center gap-2 text-xs text-[#4a6a5a]"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-[#2d6a4f]" />
                      <span>{feature}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Get Started */}
                <motion.div 
                  className="flex items-center gap-2 text-[#2d6a4f] font-semibold text-sm"
                  animate={isHovered ? { x: 5 } : { x: 0 }}
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </motion.button>
            );
          })}
        </div>

        {/* Footer */}
        <motion.div 
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm text-[#8aa89a]">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/auth")}
              className="text-[#2d6a4f] font-medium hover:underline transition-colors"
            >
              Log in
            </button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RoleSelection;