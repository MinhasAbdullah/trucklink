import React, { useEffect, useState } from "react";
import { AlertCircle, ArrowLeft, Save, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { driverApi } from "../../api/drivers";
import { getApiErrorMessage } from "../../api/client";
import LoadingState from "../ui/LoadingState";

const emptyProfile = {
  full_name: "",
  phone: "",
  cdl_class: "",
  years_experience: 0,
  availability: "",
};

const DriverProfileForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyProfile);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const { data } = await driverApi.getMyProfile();
        if (!active) return;
        setEditMode(true);
        setForm({
          full_name: data.full_name || "",
          phone: data.phone || "",
          cdl_class: data.cdl_class || "",
          years_experience: data.years_experience ?? 0,
          availability: data.availability || "",
        });
      } catch (err) {
        if (!active) return;
        if (err.response?.status !== 404) {
          setError(getApiErrorMessage(err, "Unable to load your profile."));
        }
      } finally {
        if (active) setInitialLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  const change = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: name === "years_experience" ? Number(value) : value,
    }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    const payload = {
      full_name: form.full_name.trim(),
      phone: form.phone.trim(),
      cdl_class: form.cdl_class,
      years_experience: Number(form.years_experience || 0),
      availability: form.availability.trim(),
    };

    try {
      if (editMode) await driverApi.updateMyProfile(payload);
      else await driverApi.createProfile(payload);
      navigate("/driver/status", { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err, editMode ? "Unable to save your changes." : "Unable to create your profile."));
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="min-h-screen bg-[#f7f4ea] p-4"><div className="mx-auto max-w-3xl py-10"><LoadingState label="Loading your profile..." /></div></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff8e7] via-[#f2f8f4] to-[#dceee5] p-4">
      <div className="mx-auto max-w-3xl py-8">
        <button onClick={() => navigate(editMode ? "/driver/status" : "/driver")} className="mb-4 flex items-center gap-1 text-sm font-semibold text-[#547264]">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="rounded-3xl border border-[#e8dfc7] bg-white/95 p-6 shadow-xl sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2d6a4f]"><Truck className="h-6 w-6 text-white" /></div>
            <div>
              <h1 className="text-2xl font-black text-[#213d31]">{editMode ? "Edit driver profile" : "Create driver profile"}</h1>
              <p className="text-sm text-[#708078]">Keep your professional details accurate so your profile can be reviewed quickly.</p>
            </div>
          </div>

          {error && <div className="mb-5 flex gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"><AlertCircle className="h-4 w-4 shrink-0" /> {error}</div>}

          <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name *"><input required name="full_name" value={form.full_name} onChange={change} autoComplete="name" /></Field>
            <Field label="Phone"><input name="phone" maxLength={20} value={form.phone} onChange={change} autoComplete="tel" placeholder="Phone number" /></Field>
            <Field label="CDL class *">
              <select required name="cdl_class" value={form.cdl_class} onChange={change}>
                <option value="">Select class</option>
                <option value="A">Class A</option>
                <option value="B">Class B</option>
                <option value="C">Class C</option>
                <option value="HTV">HTV</option>
              </select>
            </Field>
            <Field label="Years of experience"><input type="number" min="0" max="60" name="years_experience" value={form.years_experience} onChange={change} /></Field>
            <Field label="Availability" wide><input name="availability" maxLength={100} value={form.availability} onChange={change} placeholder="Immediate, 2 weeks notice..." /></Field>

            <button disabled={loading} className="sm:col-span-2 flex items-center justify-center gap-2 rounded-xl bg-[#2d6a4f] py-3 font-bold text-white transition hover:bg-[#24583f] disabled:opacity-50">
              <Save className="h-4 w-4" />{loading ? "Saving..." : editMode ? "Save changes" : "Submit for review"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const inputClass = "w-full rounded-xl border-2 border-[#dde7e0] bg-white px-4 py-3 text-sm outline-none focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/15";

const Field = ({ label, children, wide = false }) => (
  <label className={wide ? "sm:col-span-2" : ""}>
    <span className="mb-1.5 block text-sm font-semibold text-[#52675c]">{label}</span>
    {React.cloneElement(children, { className: inputClass })}
  </label>
);

export default DriverProfileForm;
