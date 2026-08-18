import React, { useState } from "react";
import { AlertCircle, Eye, EyeOff, Lock, LogIn, User } from "lucide-react";
import { motion } from "framer-motion";

const SignIn = ({ onSignIn, isLoading, selectedRole, onSwitchToSignUp }) => {
  const [formData, setFormData] = useState({ username: "", password: "", rememberMe: false });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username.trim() || !formData.password) return setError("Please enter your username and password.");
    try { await onSignIn(formData); } catch (err) { setError(err.message || "Failed to sign in."); }
  };

  const roleLabel = selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1);

  return <form onSubmit={handleSubmit} className="space-y-4">
    {error && <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600"><AlertCircle className="h-4 w-4 shrink-0"/><span>{error}</span></motion.div>}
    <div><label className="mb-1.5 block text-sm font-medium text-[#4a6a5a]">Username</label><div className="flex items-center rounded-xl border-2 border-[#dce8e2] px-4 py-2.5 transition focus-within:border-[#2d6a4f] focus-within:ring-2 focus-within:ring-[#2d6a4f]/20"><User className="mr-2 h-4 w-4 text-[#8aa89a]"/><input name="username" value={formData.username} onChange={handleChange} disabled={isLoading} placeholder="Enter your username" autoComplete="username" className="w-full bg-transparent text-sm text-[#1a2a3a] outline-none"/></div></div>
    <div><label className="mb-1.5 block text-sm font-medium text-[#4a6a5a]">Password</label><div className="flex items-center rounded-xl border-2 border-[#dce8e2] px-4 py-2.5 transition focus-within:border-[#2d6a4f] focus-within:ring-2 focus-within:ring-[#2d6a4f]/20"><Lock className="mr-2 h-4 w-4 text-[#8aa89a]"/><input type={showPassword?"text":"password"} name="password" value={formData.password} onChange={handleChange} disabled={isLoading} placeholder="Enter your password" autoComplete="current-password" className="w-full bg-transparent text-sm text-[#1a2a3a] outline-none"/><button type="button" onClick={()=>setShowPassword((v)=>!v)} className="text-[#8aa89a]">{showPassword?<EyeOff className="h-4 w-4"/>:<Eye className="h-4 w-4"/>}</button></div></div>
    <label className="flex items-center gap-2 text-sm text-[#4a6a5a]"><input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleChange} className="h-4 w-4 accent-[#2d6a4f]"/>Remember me</label>
    <motion.button type="submit" disabled={isLoading} whileTap={{scale:.99}} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2d6a4f] to-[#409f7a] py-3 font-medium text-white shadow-sm disabled:opacity-50">{isLoading?<><span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"/>Signing in...</>:<><LogIn className="h-4 w-4"/>Log in as {roleLabel}</>}</motion.button>
    {selectedRole!=="admin" && <p className="text-center text-sm text-[#8aa89a]">Don't have an account? <button type="button" onClick={onSwitchToSignUp} className="font-medium text-[#2d6a4f] hover:underline">Sign up</button></p>}
  </form>;
};
export default SignIn;
