import React, { useEffect, useState } from "react";
import { Save, X } from "lucide-react";
import { EQUIPMENT_CHOICES, LOAD_STATUS_CHOICES } from "../../api/operations";
import CloudinaryUploadField from "./CloudinaryUploadField";
import FormField, { inputClass } from "./FormField";

const emptyLoad = {
  title: "",
  origin_city: "",
  origin_lat: 0,
  origin_lng: 0,
  destination_city: "",
  destination_lat: 0,
  destination_lng: 0,
  equipment_type: "Dry Van",
  weight_lbs: "",
  max_budget: "",
  pickup_date: "",
  status: "OPEN",
  image_url: "",
  document_url: "",
};

const numericFields = new Set(["origin_lat", "origin_lng", "destination_lat", "destination_lng", "weight_lbs", "max_budget"]);

const LoadForm = ({ initialValue, onSubmit, onCancel }) => {
  const [form, setForm] = useState(emptyLoad);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(initialValue ? { ...emptyLoad, ...initialValue, pickup_date: String(initialValue.pickup_date || "").slice(0, 10) } : emptyLoad);
  }, [initialValue]);

  const change = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: numericFields.has(name) && value !== "" ? Number(value) : value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSubmit({
        ...form,
        weight_lbs: Number(form.weight_lbs),
        max_budget: Number(form.max_budget),
        image_url: form.image_url || null,
        document_url: form.document_url || null,
      });
      if (!initialValue) setForm(emptyLoad);
    } catch (err) {
      setError(err.message || "Unable to save load.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      {error && <div className="sm:col-span-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      <FormField label="Load title *" wide><input required name="title" value={form.title} onChange={change} className={inputClass} placeholder="Regional refrigerated load" /></FormField>
      <FormField label="Origin city *"><input required name="origin_city" value={form.origin_city} onChange={change} className={inputClass} /></FormField>
      <FormField label="Destination city *"><input required name="destination_city" value={form.destination_city} onChange={change} className={inputClass} /></FormField>
      <FormField label="Origin latitude"><input type="number" step="any" name="origin_lat" value={form.origin_lat} onChange={change} className={inputClass} /></FormField>
      <FormField label="Origin longitude"><input type="number" step="any" name="origin_lng" value={form.origin_lng} onChange={change} className={inputClass} /></FormField>
      <FormField label="Destination latitude"><input type="number" step="any" name="destination_lat" value={form.destination_lat} onChange={change} className={inputClass} /></FormField>
      <FormField label="Destination longitude"><input type="number" step="any" name="destination_lng" value={form.destination_lng} onChange={change} className={inputClass} /></FormField>
      <FormField label="Equipment type *"><select name="equipment_type" value={form.equipment_type} onChange={change} className={inputClass}>{EQUIPMENT_CHOICES.map((item) => <option key={item}>{item}</option>)}</select></FormField>
      <FormField label="Weight (lbs) *"><input required min="1" type="number" name="weight_lbs" value={form.weight_lbs} onChange={change} className={inputClass} /></FormField>
      <FormField label="Maximum budget (USD) *"><input required min="0" step="0.01" type="number" name="max_budget" value={form.max_budget} onChange={change} className={inputClass} /></FormField>
      <FormField label="Pickup date *"><input required type="date" name="pickup_date" value={form.pickup_date} onChange={change} className={inputClass} /></FormField>
      <FormField label="Status"><select name="status" value={form.status} onChange={change} className={inputClass}>{LOAD_STATUS_CHOICES.map((item) => <option key={item} value={item}>{item.replaceAll("_", " ")}</option>)}</select></FormField>
      <CloudinaryUploadField label="Load image" value={form.image_url} onChange={(value) => setForm((current) => ({ ...current, image_url: value }))} folder="trucklink_load_images" accept="image/*" />
      <CloudinaryUploadField label="Load document" value={form.document_url} onChange={(value) => setForm((current) => ({ ...current, document_url: value }))} folder="trucklink_load_documents" accept=".pdf,.doc,.docx,image/*" />
      <div className="sm:col-span-2 flex flex-wrap justify-end gap-2 border-t border-[#edf2ee] pt-4">
        {onCancel && <button type="button" onClick={onCancel} className="inline-flex items-center gap-2 rounded-xl border border-[#d9e5de] px-4 py-2.5 text-sm font-semibold text-[#4a6a5a]"><X className="h-4 w-4" /> Cancel</button>}
        <button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-[#2d6a4f] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"><Save className="h-4 w-4" /> {saving ? "Saving..." : initialValue ? "Update load" : "Create load"}</button>
      </div>
    </form>
  );
};

export default LoadForm;
