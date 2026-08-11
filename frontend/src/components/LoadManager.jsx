import React, { useState, useEffect } from 'react';
import { getLoads, createLoad } from '../api';
import CloudinaryUploader from './CloudinaryUploader';
import { Package, PlusCircle, MapPin, Calendar, DollarSign, FileText, CheckCircle2 } from 'lucide-react';

export default function LoadManager() {
  const [loads, setLoads] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    origin_city: '',
    origin_lat: 41.8781,
    origin_lng: -87.6298,
    destination_city: '',
    destination_lat: 33.7490,
    destination_lng: -84.3880,
    equipment_type: 'Dry Van',
    weight_lbs: 35000,
    max_budget: 2000.00,
    pickup_date: new Date().toISOString().split('T')[0],
    image_url: '',
    document_url: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLoads();
  }, []);

  const fetchLoads = async () => {
    try {
      const res = await getLoads();
      setLoads(res.data);
    } catch (err) {
      console.error('Error fetching loads:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createLoad(formData);
      fetchLoads();
      setShowCreateForm(false);
      // reset
      setFormData({
        title: '',
        origin_city: '',
        origin_lat: 41.8781,
        origin_lng: -87.6298,
        destination_city: '',
        destination_lat: 33.7490,
        destination_lng: -84.3880,
        equipment_type: 'Dry Van',
        weight_lbs: 35000,
        max_budget: 2000.00,
        pickup_date: new Date().toISOString().split('T')[0],
        image_url: '',
        document_url: '',
      });
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create load.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-cyan-400" />
            <span>Shipper Load Board & Cargo Docs</span>
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">Post freight loads with attached Cloudinary bill of lading / cargo images.</p>
        </div>

        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm transition-all flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{showCreateForm ? 'Cancel' : 'Post New Freight Load'}</span>
        </button>
      </div>

      {/* Create Load Form */}
      {showCreateForm && (
        <form onSubmit={handleSubmit} className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white mb-2">Freight Load Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Load Title / Cargo Description</label>
              <input
                type="text"
                required
                placeholder="e.g., 40,000 lbs Refrigerated Frozen Meat"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Equipment Type Required</label>
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
              <label className="block text-xs text-slate-400 mb-1">Origin City (Pickup)</label>
              <input
                type="text"
                required
                placeholder="e.g., Chicago, IL"
                value={formData.origin_city}
                onChange={(e) => setFormData({ ...formData, origin_city: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Destination City (Delivery)</label>
              <input
                type="text"
                required
                placeholder="e.g., Atlanta, GA"
                value={formData.destination_city}
                onChange={(e) => setFormData({ ...formData, destination_city: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Cargo Weight (lbs)</label>
              <input
                type="number"
                required
                value={formData.weight_lbs}
                onChange={(e) => setFormData({ ...formData, weight_lbs: parseInt(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Max Shipper Budget ($ USD)</label>
              <input
                type="number"
                required
                value={formData.max_budget}
                onChange={(e) => setFormData({ ...formData, max_budget: parseFloat(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200"
              />
            </div>
          </div>

          {/* Cloudinary Document & Image Uploader Integration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <CloudinaryUploader
              label="Cargo Image / Photo (Cloudinary)"
              folder="cargo_photos"
              onUploadSuccess={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
            />
            <CloudinaryUploader
              label="Bill of Lading / Spec Sheet (Cloudinary)"
              folder="load_documents"
              onUploadSuccess={(url) => setFormData(prev => ({ ...prev, document_url: url }))}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold py-3 rounded-xl transition-all"
            >
              {loading ? 'Publishing Load...' : 'Publish Load to Network'}
            </button>
          </div>
        </form>
      )}

      {/* Loads Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loads.map((l) => (
          <div key={l.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 relative overflow-hidden">
            {l.image_url && (
              <div className="h-32 -mx-5 -mt-5 mb-3 overflow-hidden border-b border-slate-800 relative">
                <img src={l.image_url} alt={l.title} className="w-full h-full object-cover object-center" />
                <span className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur text-cyan-400 text-[10px] px-2 py-0.5 rounded border border-slate-700">
                  Cloudinary Asset
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-xs font-mono bg-slate-800 text-cyan-400 px-2 py-0.5 rounded font-bold">
                Load #{l.id}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                l.status === 'OPEN' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
              }`}>
                {l.status}
              </span>
            </div>

            <h4 className="text-base font-bold text-white">{l.title}</h4>

            <div className="space-y-1 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>{l.origin_city} ➔ {l.destination_city}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Package className="w-3.5 h-3.5 text-amber-400" />
                <span>{l.equipment_type} | {l.weight_lbs.toLocaleString()} lbs</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>Max Budget: <strong className="text-emerald-400">${l.max_budget}</strong></span>
              </div>
            </div>

            {l.document_url && (
              <div className="pt-2 border-t border-slate-800/80">
                <a
                  href={l.document_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-cyan-400 hover:underline flex items-center gap-1 truncate"
                >
                  <FileText className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">View Attached Cloudinary BOL</span>
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
