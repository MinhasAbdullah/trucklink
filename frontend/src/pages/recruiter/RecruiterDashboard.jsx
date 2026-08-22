import React, { useEffect, useState } from "react";
import { BriefcaseBusiness, Edit3, Package, Plus, Save, Sparkles, X } from "lucide-react";
import { Link } from "react-router-dom";
import AppHeader from "../../components/layout/AppHeader";
import JobPostingForm from "../../components/recruiter/JobPostingForm";
import LoadingState from "../../components/ui/LoadingState";
import StatusBadge from "../../components/ui/StatusBadge";
import { recruiterApi } from "../../api/recruiters";
import { getApiErrorMessage } from "../../api/client";

const RecruiterDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [needsProfile, setNeedsProfile] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  const [profileForm, setProfileForm] = useState({ company_name: "", contact_phone: "" });

  const load = async () => {
    setLoading(true);
    setError("");
    const [profileResult, jobsResult] = await Promise.allSettled([
      recruiterApi.getMyProfile(),
      recruiterApi.getMyJobs(),
    ]);

    if (profileResult.status === "fulfilled") {
      setProfile(profileResult.value.data);
      setProfileForm({
        company_name: profileResult.value.data.company_name || "",
        contact_phone: profileResult.value.data.contact_phone || "",
      });
      setNeedsProfile(false);
    } else if (profileResult.reason?.response?.status === 404) {
      setNeedsProfile(true);
    } else {
      setNeedsProfile(true);
      setError(getApiErrorMessage(profileResult.reason, "Unable to load your recruiter profile."));
    }

    if (jobsResult.status === "fulfilled") {
      setJobs(Array.isArray(jobsResult.value.data) ? jobsResult.value.data : []);
    } else if (jobsResult.reason?.response?.status !== 404) {
      setError((current) => current || getApiErrorMessage(jobsResult.reason, "Unable to load your jobs."));
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const createProfile = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const { data } = await recruiterApi.createProfile(profileForm);
      setProfile(data);
      setNeedsProfile(false);
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to create your recruiter profile."));
    }
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const { data } = await recruiterApi.updateMyProfile(profileForm);
      setProfile(data);
      setEditingProfile(false);
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to save your profile."));
    }
  };

  const addJob = (job) => {
    setJobs((current) => [job, ...current]);
    setShowJobForm(false);
  };

  return (
    <div className="min-h-screen bg-[#f7f4ea]">
      <AppHeader title="TruckLink Recruiter" subtitle="Recruiter dashboard" />
      <main className="mx-auto max-w-6xl p-4 py-8 sm:px-6">
        {loading ? <LoadingState label="Loading your dashboard..." /> : <>
          {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
          {needsProfile && !profile ? (
            <form onSubmit={createProfile} className="mx-auto max-w-xl rounded-3xl border border-[#e7dfca] bg-white p-6 shadow-sm">
              <h1 className="text-2xl font-black text-[#203d31]">Create recruiter profile</h1>
              <p className="mt-1 text-sm text-[#718078]">Add your company details to start posting jobs and freight loads.</p>
              <input required value={profileForm.company_name} onChange={(e) => setProfileForm({ ...profileForm, company_name: e.target.value })} placeholder="Company name" className="mt-5 w-full rounded-xl border-2 border-[#dde7e0] px-4 py-3 outline-none focus:border-[#2d6a4f]" />
              <input value={profileForm.contact_phone} onChange={(e) => setProfileForm({ ...profileForm, contact_phone: e.target.value })} placeholder="Contact phone" className="mt-3 w-full rounded-xl border-2 border-[#dde7e0] px-4 py-3 outline-none focus:border-[#2d6a4f]" />
              <button className="mt-4 w-full rounded-xl bg-[#2d6a4f] py-3 font-bold text-white">Create profile</button>
            </form>
          ) : (
            <div className="space-y-5">
              <section className="rounded-3xl border border-[#e7dfca] bg-white p-6 shadow-sm">
                {editingProfile ? (
                  <form onSubmit={saveProfile} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                    <input required value={profileForm.company_name} onChange={(e) => setProfileForm({ ...profileForm, company_name: e.target.value })} className="rounded-xl border-2 border-[#dde7e0] px-4 py-3 outline-none focus:border-[#2d6a4f]" />
                    <input value={profileForm.contact_phone} onChange={(e) => setProfileForm({ ...profileForm, contact_phone: e.target.value })} className="rounded-xl border-2 border-[#dde7e0] px-4 py-3 outline-none focus:border-[#2d6a4f]" />
                    <div className="flex gap-2"><button className="rounded-xl bg-[#2d6a4f] p-3 text-white" aria-label="Save profile"><Save className="h-4 w-4" /></button><button type="button" onClick={() => setEditingProfile(false)} className="rounded-xl border border-[#dde7e0] p-3 text-[#61756a]" aria-label="Cancel"><X className="h-4 w-4" /></button></div>
                  </form>
                ) : (
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div><h1 className="text-2xl font-black text-[#203d31]">{profile?.company_name}</h1><p className="text-sm text-[#718078]">{profile?.contact_phone || "No contact phone"}</p></div>
                    <div className="flex items-center gap-2"><StatusBadge status={profile?.status} /><button onClick={() => setEditingProfile(true)} className="rounded-xl border border-[#dde7e0] p-2.5 text-[#2d6a4f]" aria-label="Edit recruiter profile"><Edit3 className="h-4 w-4" /></button></div>
                  </div>
                )}
              </section>

              <section className="grid gap-3 sm:grid-cols-2">
                <Link to="/recruiter/loads" className="flex items-center justify-between rounded-2xl border border-[#e7dfca] bg-[#fffdf8] p-5 transition hover:-translate-y-0.5 hover:shadow-md"><div><p className="font-bold text-[#29483a]">Freight loads</p><p className="mt-1 text-sm text-[#718078]">Create and manage available loads.</p></div><Package className="h-6 w-6 text-[#2d6a4f]" /></Link>
                <Link to="/recruiter/matches" className="flex items-center justify-between rounded-2xl border border-[#e7dfca] bg-[#fffdf8] p-5 transition hover:-translate-y-0.5 hover:shadow-md"><div><p className="font-bold text-[#29483a]">Freight matches</p><p className="mt-1 text-sm text-[#718078]">Review recommended trucks and opportunities.</p></div><Sparkles className="h-6 w-6 text-[#2d6a4f]" /></Link>
              </section>

              <section className="rounded-3xl border border-[#e7dfca] bg-[#fffdf8] p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3"><div><h2 className="flex items-center gap-2 text-lg font-bold text-[#29483a]"><BriefcaseBusiness className="h-5 w-5" /> Your jobs</h2><p className="text-sm text-[#718078]">Create and manage your open driving positions.</p></div><button onClick={() => setShowJobForm((value) => !value)} className="inline-flex items-center gap-2 rounded-xl bg-[#2d6a4f] px-3 py-2.5 text-xs font-bold text-white"><Plus className="h-4 w-4" /> New job</button></div>
                {showJobForm && <div className="mt-5 rounded-2xl border border-[#e8f5ee] bg-white p-5"><JobPostingForm onCreated={addJob} /></div>}
                {jobs.length ? <div className="mt-4 space-y-3">{jobs.map((job) => (
                  <div key={job.id} className="rounded-2xl border border-[#e6dfcb] bg-white p-4">
                    <div className="flex justify-between gap-3">
                      <div>
                        <p className="font-bold text-[#29483a]">{job.title}</p>
                        <p className="text-sm text-[#718078]">{job.location || "Location flexible"} · {job.route_type || "Route flexible"}</p>
                        <p className="mt-1 text-xs text-[#8aa89a]">{job.required_experience_years ?? 0} years experience required</p>
                      </div>
                      <span className="text-xs font-semibold text-[#2d6a4f]">{job.is_active ? "Open" : "Closed"}</span>
                    </div>
                  </div>
                ))}</div> : <p className="mt-4 rounded-xl border border-dashed border-[#dce6df] p-5 text-center text-sm text-[#718078]">No job postings yet.</p>}
              </section>
            </div>
          )}
        </>}
      </main>
    </div>
  );
};

export default RecruiterDashboard;
