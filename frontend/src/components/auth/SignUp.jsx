import React, { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, UserPlus, Briefcase, Shield, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const SignUp = ({ onSignUp, isLoading, selectedRole, onSwitchToSignIn }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculateStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) strength++;
    if (pass.match(/\d/)) strength++;
    if (pass.match(/[^a-zA-Z\d]/)) strength++;
    return strength;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
    if (name === "password") {
      setPasswordStrength(calculateStrength(value));
    }
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      setError("Please enter your full name");
      return;
    }

    if (!formData.email || !formData.password) {
      setError("Please fill in all required fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!formData.agreeTerms) {
      setError("Please agree to the Terms & Conditions");
      return;
    }

    try {
      await onSignUp({ ...formData, role: selectedRole });
    } catch (err) {
      setError(err.message || "Failed to sign up. Please try again.");
    }
  };

  const getStrengthLabel = () => {
    if (passwordStrength <= 1) return "Weak";
    if (passwordStrength <= 2) return "Medium";
    return "Strong";
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return "bg-red-500";
    if (passwordStrength <= 2) return "bg-yellow-500";
    return "bg-green-500";
  };

  // Recruiter signup - handled by Akash
  if (selectedRole === "recruiter") {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-8"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Briefcase className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-[#1a2a3a] mb-2">Recruiter Signup</h3>
        <p className="text-sm text-[#4a6a5a] max-w-xs mx-auto">
          Recruiter accounts are created separately through the recruiter portal.
          <br />
          Please contact your administrator for access.
        </p>
        <button
          type="button"
          onClick={onSwitchToSignIn}
          className="mt-6 text-[#2d6a4f] font-medium hover:underline text-sm transition-colors"
        >
          Back to Log In
        </button>
      </motion.div>
    );
  }

  // Admin - no signup
  if (selectedRole === "admin") {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-8"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Shield className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-[#1a2a3a] mb-2">Admin Access</h3>
        <p className="text-sm text-[#4a6a5a] max-w-xs mx-auto">
          Admin accounts are created directly in the backend.
          <br />
          Please contact your system administrator.
        </p>
        <button
          type="button"
          onClick={onSwitchToSignIn}
          className="mt-6 text-[#2d6a4f] font-medium hover:underline text-sm transition-colors"
        >
          Back to Log In
        </button>
      </motion.div>
    );
  }

  // Driver Signup Form
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

      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium text-[#4a6a5a] mb-1.5">
          Full Name *
        </label>
        <div className="flex items-center border-2 border-[#dce8e2] rounded-xl px-4 py-2.5 focus-within:border-[#2d6a4f] focus-within:ring-2 focus-within:ring-[#2d6a4f]/20 transition-all">
          <User className="w-4 h-4 text-[#8aa89a] mr-2 flex-shrink-0" />
          <input
            type="text"
            name="fullName"
            placeholder="e.g. Ali Hassan"
            value={formData.fullName}
            onChange={handleChange}
            disabled={isLoading}
            required
            className="w-full bg-transparent outline-none text-[#1a2a3a] placeholder:text-[#aac0b5] text-sm"
            autoComplete="name"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-[#4a6a5a] mb-1.5">
          Email Address *
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
          Password *
        </label>
        <div className="flex items-center border-2 border-[#dce8e2] rounded-xl px-4 py-2.5 focus-within:border-[#2d6a4f] focus-within:ring-2 focus-within:ring-[#2d6a4f]/20 transition-all">
          <Lock className="w-4 h-4 text-[#8aa89a] mr-2 flex-shrink-0" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Minimum 8 characters"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
            required
            className="w-full bg-transparent outline-none text-[#1a2a3a] placeholder:text-[#aac0b5] text-sm"
            autoComplete="new-password"
            minLength="8"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-[#8aa89a] hover:text-[#4a6a5a] transition-colors flex-shrink-0"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {formData.password && (
          <div className="mt-1.5">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                  style={{ width: `${(passwordStrength / 4) * 100}%` }}
                />
              </div>
              <span className="text-xs text-[#4a6a5a]">{getStrengthLabel()}</span>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium text-[#4a6a5a] mb-1.5">
          Confirm Password *
        </label>
        <div className="flex items-center border-2 border-[#dce8e2] rounded-xl px-4 py-2.5 focus-within:border-[#2d6a4f] focus-within:ring-2 focus-within:ring-[#2d6a4f]/20 transition-all">
          <Lock className="w-4 h-4 text-[#8aa89a] mr-2 flex-shrink-0" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={isLoading}
            required
            className="w-full bg-transparent outline-none text-[#1a2a3a] placeholder:text-[#aac0b5] text-sm"
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="text-[#8aa89a] hover:text-[#4a6a5a] transition-colors flex-shrink-0"
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {formData.confirmPassword && formData.password !== formData.confirmPassword && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-red-500 mt-1"
          >
            Passwords do not match
          </motion.p>
        )}
      </div>

      {/* Terms */}
      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          name="agreeTerms"
          checked={formData.agreeTerms}
          onChange={handleChange}
          disabled={isLoading}
          className="w-4 h-4 accent-[#2d6a4f] rounded border-[#c8dcd2] mt-0.5"
        />
        <label className="text-sm text-[#4a6a5a]">
          I agree to the{" "}
          <button type="button" className="text-[#2d6a4f] font-medium hover:underline">
            Terms & Conditions
          </button>{" "}
          and{" "}
          <button type="button" className="text-[#2d6a4f] font-medium hover:underline">
            Privacy Policy
          </button>
        </label>
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isLoading}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full bg-gradient-to-r from-[#2d6a4f] to-[#409f7a] text-white py-3.5 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            Creating Account...
          </>
        ) : (
          <>
            <UserPlus className="w-5 h-5" />
            Create Driver Account
          </>
        )}
      </motion.button>

      {/* Footer */}
      <p className="text-center text-sm text-[#8aa89a]">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToSignIn}
          className="text-[#2d6a4f] font-medium hover:underline transition-colors"
        >
          Log in
        </button>
      </p>
    </form>
  );
};

export default SignUp;