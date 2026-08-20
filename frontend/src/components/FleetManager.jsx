import React, { useState, useEffect } from 'react';
import { getTrucks, createTruck } from '../api';
import CloudinaryUploader from './CloudinaryUploader';
import { Truck as TruckIcon, PlusCircle, MapPin, Calendar, DollarSign, Shield, FileCheck } from 'lucide-react';

export default function FleetManager() {
  const [trucks, setTrucks] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    driver_name: '',
    truck_number: '',
    equipment_type: 'Dry Van',
    max_capacity_lbs: 42000,
    current_city: '',
    current_lat: 41.8781,
    current_lng: -87.6298,
    target_city: '',
    target_lat: 33.7490,
    target_lng: -84.3880,
    min_rate_per_mile: 2.50,
    available_date: new Date().toISOString().split('T')[0],
    truck_image_url: '',
    license_doc_url: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTrucks();
  }, []);

  const fetchTrucks = async () => {
    try {
      const res = await getTrucks();
      setTrucks(res.data);
    } catch (err) {
      console.error('Error fetching trucks:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createTruck(formData);
      fetchTrucks();
      setShowCreateForm(false);
      setFormData({
        driver_name: '',
        truck_number: '',
        equipment_type: 'Dry Van',
        max_capacity_lbs: 42000,
        current_city: '',
        current_lat: 41.8781,
        current_lng: -87.6298,
        target_city: '',
        target_lat: 33.7490,
        target_lng: -84.3880,
        min_rate_per_mile: 2.50,
        available_date: new Date().toISOString().split('T')[0],
        truck_image_url: '',
        license_doc_url: '',
      });
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to register truck.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <TruckIcon className="w-5 h-5 text-cyan-400" />
            <span>Carrier Fleet & Driver Roster</span>
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">Register truck capacity and upload CDL / proof documents to Cloudinary.</p>
        </div>

        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm transition-all flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{showCreateForm ? 'Cancel' : 'Register New Truck'}</span>
        </button>
      </div>

      {showCreateForm && (
        <form onSubmit={handleSubmit} className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white mb-2">Truck & Driver Profile</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Driver Name</label>
              <input
                type="text"
                required
                placeholder="e.g., Robert Vance"
                value={formData.driver_name}
                onChange={(e) => setFormData({ ...formData, driver_name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Truck ID / Plate Number</label>
              <input
                type="text"
                required
                placeholder="e.g., TRK-8820"
                value={formData.truck_number}
                onChange={(e) => setFormData({ ...formData, truck_number: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Equipment Type</label>
              <select
                value={formData.equipment_type}
                onChange={(e) => setFormData({ ...formData, equipment_type: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200"
              >
                <option value="Dry Van">Dry Van</option>
                <option value="Reefer">Reefer (Temperature Controlled)</option>
                <option value="Flatbed">Flatbed</option>
                <option value="Stepdeck">Stepdeck</option>
                <option value="Box Truck">Box Truck</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Max Payload Capacity (lbs)</label>
              <input
                type="number"
                required
                value={formData.max_capacity_lbs}
                onChange={(e) => setFormData({ ...formData, max_capacity_lbs: parseInt(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Current Location (City, State)</label>
              <input
                type="text"
                required
                placeholder="e.g., Chicago, IL"
                value={formData.current_city}
                onChange={(e) => setFormData({ ...formData, current_city: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Min Rate ($ per mile)</label>
              <input
                type="number"
                step="0.10"
                required
                value={formData.min_rate_per_mile}
                onChange={(e) => setFormData({ ...formData, min_rate_per_mile: parseFloat(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200"
              />
            </div>
          </div>

          {/* Cloudinary Integration for Truck & CDL Upload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <CloudinaryUploader
              label="Truck Vehicle Photo (Cloudinary)"
              folder="truck_photos"
              onUploadSuccess={(url) => setFormData(prev => ({ ...prev, truck_image_url: url }))}
            />
            <CloudinaryUploader
              label="Driver CDL / Permit Doc (Cloudinary)"
              folder="driver_docs"
              onUploadSuccess={(url) => setFormData(prev => ({ ...prev, license_doc_url: url }))}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold py-3 rounded-xl transition-all"
            >
              {loading ? 'Registering...' : 'Register Fleet Unit'}
            </button>
          </div>
        </form>
      )}

      {/* Fleet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trucks.map((t) => (
          <div key={t.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 relative overflow-hidden">
            {t.truck_image_url && (
              <div className="h-32 -mx-5 -mt-5 mb-3 overflow-hidden border-b border-slate-800 relative">
                <img src={t.truck_image_url} alt={t.truck_number} className="w-full h-full object-cover object-center" />
                <span className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur text-cyan-400 text-[10px] px-2 py-0.5 rounded border border-slate-700">
                  Cloudinary Image
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-xs font-mono bg-slate-800 text-cyan-400 px-2 py-0.5 rounded font-bold">
                {t.truck_number}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                t.status === 'AVAILABLE' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
              }`}>
                {t.status}
              </span>
            </div>

            <div>
              <h4 className="text-base font-bold text-white">{t.driver_name}</h4>
              <p className="text-xs text-slate-400">{t.equipment_type} (Max {t.max_capacity_lbs.toLocaleString()} lbs)</p>
            </div>

            <div className="space-y-1 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>Location: <strong>{t.current_city}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>Min Rate: <strong className="text-emerald-400">${t.min_rate_per_mile} / mile</strong></span>
              </div>
            </div>

            {t.license_doc_url && (
              <div className="pt-2 border-t border-slate-800/80">
                <a
                  href={t.license_doc_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-cyan-400 hover:underline flex items-center gap-1 truncate"
                >
                  <FileCheck className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">View Cloudinary Driver CDL</span>
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
