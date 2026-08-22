import React, { useEffect, useState } from "react";
import { ArrowLeft, Briefcase, Shield, Truck, User } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getRoleHome, useAuth } from "../../context/AuthContext";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const initialRole = searchParams.get("role") || "driver";
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [activeTab, setActiveTab] = useState("signin");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const roles = [{id:"driver",label:"Driver",icon:User},{id:"recruiter",label:"Recruiter",icon:Briefcase},{id:"admin",label:"Admin",icon:Shield}];

  useEffect(()=>{ const role=searchParams.get("role"); if (roles.some((item)=>item.id===role)) setSelectedRole(role); },[searchParams]);
  const changeRole=(role)=>{setSelectedRole(role);setActiveTab("signin");setSuccess("");navigate(`/auth?role=${role}`,{replace:true});};
  const handleSignIn=async(data)=>{setIsLoading(true);try{await login({...data,role:selectedRole});navigate(getRoleHome(selectedRole),{replace:true});}finally{setIsLoading(false);}};
  const handleSignUp=async(data)=>{setIsLoading(true);try{await signup({role:selectedRole,...data});setSuccess("Account created successfully. You can now log in.");setActiveTab("signin");}finally{setIsLoading(false);}};

  return <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#fff8e7] via-[#f0f7f4] to-[#dceee5] p-4"><motion.div initial={{opacity:0,scale:.97}} animate={{opacity:1,scale:1}} className="w-full max-w-[470px]"><div className="rounded-3xl border border-white/70 bg-white/90 p-8 shadow-2xl backdrop-blur"><button onClick={()=>navigate("/")} className="mb-4 flex items-center gap-1 text-sm text-[#7d9186] hover:text-[#2d6a4f]"><ArrowLeft className="h-4 w-4"/>Back</button><div className="mb-6 flex items-center justify-center gap-2"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2d6a4f]"><Truck className="h-6 w-6 text-white"/></div><h1 className="text-2xl font-black text-[#203a2f]">Truck<span className="text-[#2d6a4f]">Link</span></h1></div>
    <div className="mb-6 grid grid-cols-3 gap-2">{roles.map(({id,label,icon:Icon})=><button key={id} onClick={()=>changeRole(id)} className={`flex flex-col items-center gap-1 rounded-xl px-3 py-3 text-sm font-semibold transition ${selectedRole===id?"bg-[#2d6a4f] text-white shadow-md":"bg-[#fff8e7] text-[#4e685b] hover:bg-[#f3ebd6]"}`}><Icon className="h-5 w-5"/>{label}</button>)}</div>
    {success && <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center text-sm text-emerald-700">{success}</div>}
    <div className="mb-6 flex border-b border-[#e4e9e5]"><button onClick={()=>setActiveTab("signin")} className={`flex-1 pb-3 text-sm font-semibold ${activeTab==="signin"?"border-b-2 border-[#2d6a4f] text-[#2d6a4f]":"text-[#8a9991]"}`}>Log In</button>{selectedRole!=="admin"&&<button onClick={()=>setActiveTab("signup")} className={`flex-1 pb-3 text-sm font-semibold ${activeTab==="signup"?"border-b-2 border-[#2d6a4f] text-[#2d6a4f]":"text-[#8a9991]"}`}>Sign Up</button>}</div>
    <AnimatePresence mode="wait">{activeTab==="signin"?<motion.div key="in" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}><SignIn onSignIn={handleSignIn} isLoading={isLoading} selectedRole={selectedRole} onSwitchToSignUp={()=>setActiveTab("signup")}/></motion.div>:<motion.div key="up" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}><SignUp onSignUp={handleSignUp} isLoading={isLoading} selectedRole={selectedRole} onSwitchToSignIn={()=>setActiveTab("signin")}/></motion.div>}</AnimatePresence>
  </div></motion.div></div>;
};
export default AuthPage;
