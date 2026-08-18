import React, { useState } from "react";
import { AlertCircle, Eye, EyeOff, Lock, Mail, Shield, User, UserPlus } from "lucide-react";
import { motion } from "framer-motion";

const SignUp = ({ onSignUp, isLoading, selectedRole, onSwitchToSignIn }) => {
  const [formData, setFormData] = useState({ username:"", email:"", password:"", confirmPassword:"", agreeTerms:false });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  if (selectedRole === "admin") return <div className="py-8 text-center"><div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#2d6a4f]"><Shield className="h-9 w-9 text-white"/></div><h3 className="text-xl font-semibold text-[#1a2a3a]">Admin access</h3><p className="mx-auto mt-2 max-w-xs text-sm text-[#4a6a5a]">Admin accounts are created in the backend. Please log in with an existing admin account.</p><button type="button" onClick={onSwitchToSignIn} className="mt-5 text-sm font-semibold text-[#2d6a4f] hover:underline">Back to login</button></div>;

  const handleChange = (e) => { const {name,value,type,checked}=e.target; setFormData((p)=>({...p,[name]:type==="checkbox"?checked:value})); setError(""); };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username.trim()) return setError("Please enter a username.");
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) return setError("Please enter a valid email address.");
    if (formData.password.length < 8) return setError("Password must be at least 8 characters.");
    if (formData.password !== formData.confirmPassword) return setError("Passwords do not match.");
    if (!formData.agreeTerms) return setError("Please agree to the Terms & Conditions.");
    try { await onSignUp(formData); } catch (err) { setError(err.message || "Registration failed."); }
  };

  return <form onSubmit={handleSubmit} className="space-y-4">
    {error && <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600"><AlertCircle className="h-4 w-4"/>{error}</motion.div>}
    <div><label className="mb-1.5 block text-sm font-medium text-[#4a6a5a]">Username *</label><div className="flex items-center rounded-xl border-2 border-[#dce8e2] px-4 py-2.5 focus-within:border-[#2d6a4f]"><User className="mr-2 h-4 w-4 text-[#8aa89a]"/><input name="username" value={formData.username} onChange={handleChange} placeholder="e.g. ali_driver" className="w-full bg-transparent text-sm outline-none" autoComplete="username"/></div></div>
    <div><label className="mb-1.5 block text-sm font-medium text-[#4a6a5a]">Email *</label><div className="flex items-center rounded-xl border-2 border-[#dce8e2] px-4 py-2.5 focus-within:border-[#2d6a4f]"><Mail className="mr-2 h-4 w-4 text-[#8aa89a]"/><input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="name@example.com" className="w-full bg-transparent text-sm outline-none" autoComplete="email"/></div></div>
    <div><label className="mb-1.5 block text-sm font-medium text-[#4a6a5a]">Password *</label><div className="flex items-center rounded-xl border-2 border-[#dce8e2] px-4 py-2.5 focus-within:border-[#2d6a4f]"><Lock className="mr-2 h-4 w-4 text-[#8aa89a]"/><input type={showPassword?"text":"password"} name="password" value={formData.password} onChange={handleChange} placeholder="Minimum 8 characters" className="w-full bg-transparent text-sm outline-none" autoComplete="new-password"/><button type="button" onClick={()=>setShowPassword((v)=>!v)} className="text-[#8aa89a]">{showPassword?<EyeOff className="h-4 w-4"/>:<Eye className="h-4 w-4"/>}</button></div></div>
    <div><label className="mb-1.5 block text-sm font-medium text-[#4a6a5a]">Confirm password *</label><input type={showPassword?"text":"password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full rounded-xl border-2 border-[#dce8e2] px-4 py-2.5 text-sm outline-none focus:border-[#2d6a4f]"/></div>
    <label className="flex items-start gap-2 text-sm text-[#4a6a5a]"><input type="checkbox" name="agreeTerms" checked={formData.agreeTerms} onChange={handleChange} className="mt-0.5 h-4 w-4 accent-[#2d6a4f]"/><span>I agree to the Terms & Conditions.</span></label>
    <motion.button type="submit" disabled={isLoading} whileTap={{scale:.99}} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2d6a4f] to-[#409f7a] py-3 font-medium text-white disabled:opacity-50">{isLoading?<span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"/>:<UserPlus className="h-4 w-4"/>}Create {selectedRole} account</motion.button>
    <p className="text-center text-sm text-[#8aa89a]">Already have an account? <button type="button" onClick={onSwitchToSignIn} className="font-medium text-[#2d6a4f] hover:underline">Log in</button></p>
  </form>;
};
export default SignUp;
