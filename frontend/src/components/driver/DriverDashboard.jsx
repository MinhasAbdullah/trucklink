import React,{useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { driverApi } from "../../api/drivers";
const DriverDashboard=()=>{const nav=useNavigate();useEffect(()=>{let active=true;(async()=>{try{await driverApi.getMyProfile();if(active)nav("/driver/status",{replace:true});}catch(e){if(active)nav("/driver/profile",{replace:true});}})();return()=>{active=false};},[nav]);return <div className="flex min-h-screen items-center justify-center bg-[#f7f4ea]"><div className="h-10 w-10 animate-spin rounded-full border-4 border-[#2d6a4f] border-t-transparent"/></div>};export default DriverDashboard;
