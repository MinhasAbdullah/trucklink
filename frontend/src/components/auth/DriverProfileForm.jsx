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
    const loadExistingProfile = async () => {
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
      } catch (error) {
        if (!active) return;
        // The supplied backend currently raises 500 rather than 404 when
        // a valid driver account has not created a profile yet.
        if (![404, 500].includes(error.response?.status)) {
          setError(getApiErrorMessage(error, "Unable to check your current profile."));
        }
      } finally {
        if (active) setInitialLoading(false);
      }
    };
    loadExistingProfile();
    return () => {
      active = false;
    };
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
    try {
      if (editMode) {
        await driverApi.updateMyProfile(form);
      } else {
        await driverApi.createProfile(form);
      }
      navigate("/driver/status", { replace: true });
    } catch (error) {
      setError(
        getApiErrorMessage(
          error,
          editMode ? "Unable to update driver profile." : "Unable to create driver profile."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-[#f7f4ea] p-4">
        <div className="mx-auto max-w-3xl py-10">
          <LoadingState label="Checking your profile..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff8e7] via-[#f2f8f4] to-[#dceee5] p-4">
      <div className="mx-auto max-w-3xl py-8">
        <button
          onClick={() => navigate("/driver/status")}
          className="mb-4 flex items-center gap-1 text-sm font-semibold text-[#547264]"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div className="rounded-3xl border border-[#e8dfc7] bg-white/95 p-6 shadow-xl sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2d6a4f]">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#213d31]">
                {editMode ? "Edit driver profile" : "Create driver profile"}
              </h1>
              <p className="text-sm text-[#708078]">
                Fields below map directly to the current backend serializer.
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-5 flex gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name *">
              <input required name="full_name" value={form.full_name} onChange={change} />
            </Field>
            <Field label="Phone">
              <input name="phone" value={form.phone} onChange={change} />
            </Field>
            <Field label="CDL class *">
              <input
                required
                maxLength={10}
                name="cdl_class"
                value={form.cdl_class}
                onChange={change}
                placeholder="A, B, C, HTV..."
              />
            </Field>
            <Field label="Years of experience">
              <input
                type="number"
                min="0"
                name="years_experience"
                value={form.years_experience}
                onChange={change}
              />
            </Field>
            <Field label="Availability" wide>
              <input
                name="availability"
                value={form.availability}
                onChange={change}
                placeholder="Immediate, 2 weeks notice..."
              />
            </Field>

            <div className="sm:col-span-2 rounded-2xl border border-amber-200 bg-[#fff8e8] p-4 text-sm text-[#715d32]">
              Endorsements, equipment and preferred region require numeric master-data IDs, but the backend does not expose lookup endpoints yet. Document upload endpoints are also absent, so this form does not send fake values or fake files.
            </div>

            <button
              disabled={loading}
              className="sm:col-span-2 flex items-center justify-center gap-2 rounded-xl bg-[#2d6a4f] py-3 font-bold text-white disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {loading ? "Saving..." : editMode ? "Save changes" : "Submit for moderation"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, children, wide }) => (
  <label className={wide ? "sm:col-span-2" : ""}>
    <span className="mb-1.5 block text-sm font-semibold text-[#52675c]">{label}</span>
    {React.cloneElement(children, {
      className:
        "w-full rounded-xl border-2 border-[#dde7e0] bg-white px-4 py-3 text-sm outline-none focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/15",
    })}
  </label>
);

export default DriverProfileForm;
