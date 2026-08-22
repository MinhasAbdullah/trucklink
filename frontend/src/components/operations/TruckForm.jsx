import React, { useEffect, useState } from "react";
import { Save, X } from "lucide-react";
import { EQUIPMENT_CHOICES, TRUCK_STATUS_CHOICES } from "../../api/operations";
import CloudinaryUploadField from "./CloudinaryUploadField";
import FormField, { inputClass } from "./FormField";

const emptyTruck = {
  driver_name: "",
  truck_number: "",
  equipment_type: "Dry Van",
  max_capacity_lbs: "",
  current_city: "",
  current_lat: 0,
  current_lng: 0,
  target_city: "",
  target_lat: 0,
  target_lng: 0,
  min_rate_per_mile: 2.5,
  available_date: "",
  status: "AVAILABLE",
  truck_image_url: "",
  license_doc_url: "",
};

const numericFields = new Set(["max_capacity_lbs", "current_lat", "current_lng", "target_lat", "target_lng", "min_rate_per_mile"]);

const TruckForm = ({ initialValue, onSubmit, onCancel }) => {
  const [form, setForm] = useState(emptyTruck);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(initialValue ? { ...emptyTruck, ...initialValue, available_date: String(initialValue.available_date || "").slice(0, 10) } : emptyTruck);
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
        max_capacity_lbs: Number(form.max_capacity_lbs),
        min_rate_per_mile: Number(form.min_rate_per_mile),
        target_city: form.target_city || null,
        truck_image_url: form.truck_image_url || null,
        license_doc_url: form.license_doc_url || null,
      });
      if (!initialValue) setForm(emptyTruck);
    } catch (err) {
      setError(err.message || "Unable to save truck.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      {error && <div className="sm:col-span-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      <FormField label="Driver name *"><input required name="driver_name" value={form.driver_name} onChange={change} className={inputClass} /></FormField>
      <FormField label="Truck number *"><input required name="truck_number" value={form.truck_number} onChange={change} className={inputClass} /></FormField>
      <FormField label="Equipment type *"><select name="equipment_type" value={form.equipment_type} onChange={change} className={inputClass}>{EQUIPMENT_CHOICES.map((item) => <option key={item}>{item}</option>)}</select></FormField>
      <FormField label="Max capacity (lbs) *"><input required min="1" type="number" name="max_capacity_lbs" value={form.max_capacity_lbs} onChange={change} className={inputClass} /></FormField>
      <FormField label="Current city *"><input required name="current_city" value={form.current_city} onChange={change} className={inputClass} /></FormField>
      <FormField label="Target city"><input name="target_city" value={form.target_city || ""} onChange={change} className={inputClass} /></FormField>
      <FormField label="Current latitude"><input type="number" step="any" name="current_lat" value={form.current_lat} onChange={change} className={inputClass} /></FormField>
      <FormField label="Current longitude"><input type="number" step="any" name="current_lng" value={form.current_lng} onChange={change} className={inputClass} /></FormField>
      <FormField label="Target latitude"><input type="number" step="any" name="target_lat" value={form.target_lat} onChange={change} className={inputClass} /></FormField>
      <FormField label="Target longitude"><input type="number" step="any" name="target_lng" value={form.target_lng} onChange={change} className={inputClass} /></FormField>
      <FormField label="Minimum rate / mile ($) *"><input required min="0" step="0.01" type="number" name="min_rate_per_mile" value={form.min_rate_per_mile} onChange={change} className={inputClass} /></FormField>
      <FormField label="Available date *"><input required type="date" name="available_date" value={form.available_date} onChange={change} className={inputClass} /></FormField>
      <FormField label="Status"><select name="status" value={form.status} onChange={change} className={inputClass}>{TRUCK_STATUS_CHOICES.map((item) => <option key={item} value={item}>{item}</option>)}</select></FormField>
      <div />
      <CloudinaryUploadField label="Truck image" value={form.truck_image_url} onChange={(value) => setForm((current) => ({ ...current, truck_image_url: value }))} folder="trucklink_truck_images" accept="image/*" />
      <CloudinaryUploadField label="License document" value={form.license_doc_url} onChange={(value) => setForm((current) => ({ ...current, license_doc_url: value }))} folder="trucklink_truck_documents" accept=".pdf,.doc,.docx,image/*" />
      <div className="sm:col-span-2 flex flex-wrap justify-end gap-2 border-t border-[#edf2ee] pt-4">
        {onCancel && <button type="button" onClick={onCancel} className="inline-flex items-center gap-2 rounded-xl border border-[#d9e5de] px-4 py-2.5 text-sm font-semibold text-[#4a6a5a]"><X className="h-4 w-4" /> Cancel</button>}
        <button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-[#2d6a4f] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"><Save className="h-4 w-4" /> {saving ? "Saving..." : initialValue ? "Update truck" : "Register truck"}</button>
      </div>
    </form>
  );
};

export default TruckForm;
