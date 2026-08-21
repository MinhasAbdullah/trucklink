import React, { useState } from "react";
import { BriefcaseBusiness, Save } from "lucide-react";
import { recruiterApi } from "../../api/recruiters";
import { getApiErrorMessage } from "../../api/client";

const empty = {
  title: "",
  required_experience_years: 0,
  location: "",
  route_type: "",
  is_active: true,
};

const cls = "w-full rounded-xl border-2 border-[#dde7e0] bg-white px-4 py-3 text-sm outline-none focus:border-[#2d6a4f]";

const JobPostingForm = ({ onCreated }) => {
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (name, value) => setForm((current) => ({ ...current, [name]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        title: form.title.trim(),
        required_experience_years: Number(form.required_experience_years || 0),
        location: form.location.trim(),
        route_type: form.route_type.trim(),
        is_active: Boolean(form.is_active),
      };
      const { data } = await recruiterApi.createJob(payload);
      setForm(empty);
      onCreated?.(data);
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to create the job posting."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      {error && <div className="sm:col-span-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      <label className="sm:col-span-2">
        <span className="mb-1.5 block text-sm font-semibold text-[#52675c]">Job title *</span>
        <input required value={form.title} onChange={(e) => set("title", e.target.value)} className={cls} placeholder="CDL-A Regional Driver" />
      </label>
      <label>
        <span className="mb-1.5 block text-sm font-semibold text-[#52675c]">Experience required</span>
        <input type="number" min="0" max="60" value={form.required_experience_years} onChange={(e) => set("required_experience_years", e.target.value)} className={cls} />
      </label>
      <label>
        <span className="mb-1.5 block text-sm font-semibold text-[#52675c]">Location</span>
        <input value={form.location} onChange={(e) => set("location", e.target.value)} className={cls} placeholder="Dallas, TX" />
      </label>
      <label className="sm:col-span-2">
        <span className="mb-1.5 block text-sm font-semibold text-[#52675c]">Route type</span>
        <input value={form.route_type} onChange={(e) => set("route_type", e.target.value)} className={cls} placeholder="Regional, local, dedicated..." />
      </label>
      <label className="sm:col-span-2 flex items-center gap-3 rounded-xl border border-[#dde7e0] bg-[#f8fbf9] p-3">
        <input type="checkbox" checked={form.is_active} onChange={(e) => set("is_active", e.target.checked)} className="h-4 w-4 accent-[#2d6a4f]" />
        <span className="text-sm font-semibold text-[#52675c]">Open for applications</span>
      </label>
      <button disabled={saving} className="sm:col-span-2 inline-flex items-center justify-center gap-2 rounded-xl bg-[#2d6a4f] py-3 font-bold text-white transition hover:bg-[#24583f] disabled:opacity-50">
        {saving ? <BriefcaseBusiness className="h-4 w-4 animate-pulse" /> : <Save className="h-4 w-4" />}
        {saving ? "Creating..." : "Create job posting"}
      </button>
    </form>
  );
};

export default JobPostingForm;
