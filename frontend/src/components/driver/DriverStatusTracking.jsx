import React, { useEffect, useState } from "react";
import { AlertCircle, Edit, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { driverApi } from "../../api/drivers";
import { getApiErrorMessage } from "../../api/client";
import AppHeader from "../layout/AppHeader";
import LoadingState from "../ui/LoadingState";
import StatusBadge from "../ui/StatusBadge";

const DriverStatusTracking = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await driverApi.getMyProfile();
      setProfile(data);
    } catch (err) {
      if (err.response?.status === 404) setError("Your driver profile has not been created yet.");
      else setError(getApiErrorMessage(err, "Unable to load your profile."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="min-h-screen bg-[#f7f4ea]">
      <AppHeader title="TruckLink Driver" subtitle="Profile status" actions={<button onClick={load} className="rounded-xl bg-[#2d6a4f] p-2.5 text-white" aria-label="Refresh profile"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /></button>} />
      <main className="mx-auto max-w-5xl p-4 py-8 sm:px-6">
        {loading ? <LoadingState label="Loading your profile..." /> : error ? (
          <div className="rounded-3xl border border-amber-200 bg-[#fff8e8] p-6">
            <div className="flex gap-3"><AlertCircle className="h-5 w-5 text-amber-700" /><div><h2 className="font-bold text-[#604d25]">Profile unavailable</h2><p className="mt-1 text-sm text-[#76643f]">{error}</p><button onClick={() => navigate("/driver/profile")} className="mt-4 rounded-xl bg-[#2d6a4f] px-4 py-2.5 text-sm font-bold text-white">Create profile</button></div></div>
          </div>
        ) : (
          <div className="space-y-5">
            <section className="rounded-3xl border border-[#e7dfca] bg-white p-6 shadow-sm">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div><p className="text-xs font-bold uppercase tracking-widest text-[#2d6a4f]">Profile status</p><h1 className="mt-1 text-3xl font-black text-[#203d31]">{profile.full_name}</h1><div className="mt-3"><StatusBadge status={profile.status} /></div></div>
                <button onClick={() => navigate("/driver/profile")} className="inline-flex items-center gap-2 rounded-xl border border-[#d9e4dd] px-4 py-2.5 text-sm font-semibold text-[#446557]"><Edit className="h-4 w-4" /> Edit profile</button>
              </div>
              {profile.status_reason && <div className="mt-5 rounded-2xl bg-[#fff8e8] p-4"><p className="text-xs font-bold uppercase text-[#8b7135]">Review feedback</p><p className="mt-1 text-sm text-[#66552f]">{profile.status_reason}</p></div>}
            </section>

            <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["Phone", profile.phone || "—"],
                ["CDL class", profile.cdl_class || "—"],
                ["Experience", `${profile.years_experience || 0} years`],
                ["Availability", profile.availability || "—"],
                ["Endorsements", Array.isArray(profile.endorsements) && profile.endorsements.length ? `${profile.endorsements.length} selected` : "None selected"],
                ["Equipment experience", Array.isArray(profile.equipment_types) && profile.equipment_types.length ? `${profile.equipment_types.length} selected` : "None selected"],
                ["Preferred region", profile.preferred_region ? "Selected" : "No preference"],
                ["Last updated", profile.updated_at ? new Date(profile.updated_at).toLocaleString() : "—"],
              ].map(([label, value]) => <div key={label} className="rounded-2xl border border-[#e7dfca] bg-[#fffdf8] p-5"><p className="text-xs font-bold uppercase tracking-wide text-[#849087]">{label}</p><p className="mt-2 font-semibold text-[#29483a]">{value}</p></div>)}
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default DriverStatusTracking;
