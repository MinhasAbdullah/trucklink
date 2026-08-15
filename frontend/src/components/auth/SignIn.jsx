import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, AlertCircle, LogIn } from "lucide-react";
import { motion } from "framer-motion";


const SignIn = ({ onSignIn, isLoading, selectedRole, onSwitchToSignUp }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      await onSignIn(formData);
    } catch (err) {
      setError(err.message || "Failed to sign in. Please try again.");
    }
  };

  const roleLabel = selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-[#4a6a5a] mb-1.5">
          Email Address
        </label>
        <div className="flex items-center border-2 border-[#dce8e2] rounded-xl px-4 py-2.5 focus-within:border-[#2d6a4f] focus-within:ring-2 focus-within:ring-[#2d6a4f]/20 transition-all">
          <Mail className="w-4 h-4 text-[#8aa89a] mr-2 flex-shrink-0" />
          <input
            type="email"
            name="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
            required
            className="w-full bg-transparent outline-none text-[#1a2a3a] placeholder:text-[#aac0b5] text-sm"
            autoComplete="email"
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-[#4a6a5a] mb-1.5">
          Password
        </label>
        <div className="flex items-center border-2 border-[#dce8e2] rounded-xl px-4 py-2.5 focus-within:border-[#2d6a4f] focus-within:ring-2 focus-within:ring-[#2d6a4f]/20 transition-all">
          <Lock className="w-4 h-4 text-[#8aa89a] mr-2 flex-shrink-0" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
            required
            className="w-full bg-transparent outline-none text-[#1a2a3a] placeholder:text-[#aac0b5] text-sm"
            autoComplete="current-password"
            minLength="6"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-[#8aa89a] hover:text-[#4a6a5a] transition-colors flex-shrink-0"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
            disabled={isLoading}
            className="w-4 h-4 accent-[#2d6a4f] rounded border-[#c8dcd2]"
          />
          <span className="text-sm text-[#4a6a5a]">Remember me</span>
        </label>
        <button
          type="button"
          className="text-sm text-[#2d6a4f] hover:text-[#1a4a35] font-medium transition-colors"
        >
          Forgot Password?
        </button>
      </div>

      {/* Submit */}
      <motion.button
        type="submit"
        disabled={isLoading}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full bg-gradient-to-r from-[#2d6a4f] to-[#409f7a] text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            Signing In...
          </>
        ) : (
          <>
            <LogIn className="w-4 h-4" />
            Log In as {roleLabel}
          </>
        )}
      </motion.button>

      {/* Footer - Switch to Sign Up */}
      {selectedRole !== "admin" && (
        <p className="text-center text-sm text-[#8aa89a]">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToSignUp}
            className="text-[#2d6a4f] font-medium hover:underline transition-colors"
          >
            Sign up
          </button>
        </p>
      )}
    </form>
  );
};

export default SignIn;