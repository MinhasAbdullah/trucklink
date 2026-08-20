import React, { useState, useEffect } from 'react';
import { getLoads, getTrucks, findMatches, acceptMatch } from '../api';
import { Cpu, Zap, CheckCircle, ShieldCheck, MapPin, Truck as TruckIcon, Package, DollarSign, Calendar, AlertTriangle } from 'lucide-react';

export default function MatchingHub({ onMatchAccepted }) {
  const [loads, setLoads] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [selectedLoadId, setSelectedLoadId] = useState('');
  const [selectedTruckId, setSelectedTruckId] = useState('');
  const [mode, setMode] = useState('load'); // 'load' or 'truck'
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptingId, setAcceptingId] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [loadsRes, trucksRes] = await Promise.all([getLoads(), getTrucks()]);
      setLoads(loadsRes.data);
      setTrucks(trucksRes.data);
      if (loadsRes.data.length > 0) setSelectedLoadId(loadsRes.data[0].id);
      if (trucksRes.data.length > 0) setSelectedTruckId(trucksRes.data[0].id);
    } catch (e) {
      console.error("Error loading data:", e);
    }
  };

  const handleRunMatching = async () => {
    setIsLoading(true);
    setStatusMessage(null);
    try {
      const payload = mode === 'load' 
        ? { load_id: parseInt(selectedLoadId), min_score: 20 } 
        : { truck_id: parseInt(selectedTruckId), min_score: 20 };

      const res = await findMatches(payload);
      setMatches(res.data.matches || []);
      if ((res.data.matches || []).length === 0) {
        setStatusMessage({ type: 'warning', text: 'No compatible matches found above minimum threshold.' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.response?.data?.error || 'Failed to calculate matches.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (matchId) => {
    setAcceptingId(matchId);
    try {
      const res = await acceptMatch(matchId);
      setStatusMessage({ type: 'success', text: res.data.message });
      // Refresh list & triggers parent event
      loadData();
      setMatches(prev => prev.map(m => m.id === matchId ? { ...m, status: 'ACCEPTED' } : m));
      if (onMatchAccepted) onMatchAccepted(res.data);
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.response?.data?.error || 'Failed to accept match.' });
    } finally {
      setAcceptingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-1">
              <Cpu className="w-4 h-4 animate-pulse" />
              <span>Multi-Factor Matching Logic Engine</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Real-Time Truck-Load Matchmaker</h2>
            <p className="text-slate-400 text-sm mt-1">
              Evaluates Equipment compatibility (25%), Weight Payload (25%), Route Proximity (30%), Date Alignment (10%), & Financial Rate Fit (10%).
            </p>
          </div>

          <button
            onClick={handleRunMatching}
            disabled={isLoading || (mode === 'load' ? !selectedLoadId : !selectedTruckId)}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-cyan-500/25 transition-all transform active:scale-95 disabled:opacity-50"
          >
            <Zap className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Calculating Algorithm...' : 'Find Matches Now'}</span>
          </button>
        </div>

        {/* Target Entity Selection Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Matching Direction</label>
            <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800">
              <button
                type="button"
                onClick={() => setMode('load')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${mode === 'load' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'}`}
              >
                Match for Load
              </button>
              <button
                type="button"
                onClick={() => setMode('truck')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${mode === 'truck' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'}`}
              >
                Match for Truck
              </button>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Select {mode === 'load' ? 'Open Load Requirement' : 'Available Truck Fleet'}
            </label>
            {mode === 'load' ? (
              <select
                value={selectedLoadId}
                onChange={(e) => setSelectedLoadId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                {loads.map((l) => (
                  <option key={l.id} value={l.id}>
                    Load #{l.id}: {l.title} ({l.origin_city} ➔ {l.destination_city}) | {l.equipment_type} | {l.weight_lbs} lbs | ${l.max_budget}
                  </option>
                ))}
              </select>
            ) : (
              <select
                value={selectedTruckId}
                onChange={(e) => setSelectedTruckId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                {trucks.map((t) => (
                  <option key={t.id} value={t.id}>
                    Truck #{t.id}: {t.truck_number} ({t.driver_name}) | {t.equipment_type} | Max {t.max_capacity_lbs} lbs | Location: {t.current_city}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Status Alert Banner */}
      {statusMessage && (
        <div className={`p-4 rounded-xl border flex items-center space-x-3 ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-950/50 border-emerald-800 text-emerald-300' 
            : statusMessage.type === 'warning'
            ? 'bg-amber-950/50 border-amber-800 text-amber-300'
            : 'bg-rose-950/50 border-rose-800 text-rose-300'
        }`}>
          {statusMessage.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0 text-emerald-400" /> : <AlertTriangle className="w-5 h-5 shrink-0" />}
          <p className="text-sm font-medium">{statusMessage.text}</p>
        </div>
      )}

      {/* Matches Results List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Ranked Candidates</span>
            <span className="bg-slate-800 text-slate-300 text-xs px-2.5 py-0.5 rounded-full font-mono">
              {matches.length} matches found
            </span>
          </h3>
        </div>

        {matches.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center">
            <Cpu className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h4 className="text-slate-300 font-medium">No Matches Displayed</h4>
            <p className="text-slate-500 text-sm max-w-md mx-auto mt-1">
              Select a load or truck above and click <span className="text-cyan-400">"Find Matches Now"</span> to calculate match compatibility scores.
            </p>
          </div>
        ) : (
          matches.map((m) => {
            const bd = m.breakdown || {};
            const isAccepted = m.status === 'ACCEPTED';
            const scoreColor = m.match_score >= 80 ? 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30' 
              : m.match_score >= 60 ? 'text-cyan-400 border-cyan-500/40 bg-cyan-950/30' 
              : 'text-amber-400 border-amber-500/40 bg-amber-950/30';

            return (
              <div key={m.id} className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all shadow-lg">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left Column: Match Score & Entity info */}
                  <div className="flex items-start space-x-4">
                    {/* Score Circle Badge */}
                    <div className={`w-20 h-20 rounded-2xl border-2 flex flex-col items-center justify-center shrink-0 ${scoreColor}`}>
                      <span className="text-2xl font-black tracking-tight">{m.match_score.toFixed(0)}%</span>
                      <span className="text-[10px] uppercase tracking-wider font-semibold opacity-80">Match Score</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono bg-slate-800 text-cyan-400 px-2 py-0.5 rounded font-semibold">
                          Match #{m.id}
                        </span>
                        {isAccepted ? (
                          <span className="text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" /> ACCEPTED & BOOKED
                          </span>
                        ) : (
                          <span className="text-xs font-semibold bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                            PROPOSED
                          </span>
                        )}
                      </div>

                      <h4 className="text-lg font-bold text-white">
                        {m.load_details?.title} <span className="text-slate-500 font-normal">↔</span> {m.truck_details?.driver_name} ({m.truck_details?.truck_number})
                      </h4>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 pt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                          {m.load_details?.origin_city} ➔ {m.load_details?.destination_city}
                        </span>
                        <span className="flex items-center gap-1">
                          <Package className="w-3.5 h-3.5 text-amber-400" />
                          {m.load_details?.equipment_type} | {m.load_details?.weight_lbs} lbs
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                          Budget: ${m.load_details?.max_budget}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="shrink-0 flex items-center">
                    {!isAccepted ? (
                      <button
                        onClick={() => handleAccept(m.id)}
                        disabled={acceptingId === m.id}
                        className="w-full lg:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {acceptingId === m.id ? 'Confirming...' : 'Accept Match'}
                      </button>
                    ) : (
                      <div className="text-right">
                        <span className="text-xs text-emerald-400 font-mono block">Status: Booked</span>
                        <span className="text-[11px] text-slate-500">Realtime channels notified</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Score Breakdown Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-5 pt-4 border-t border-slate-800/60">
                  <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5">
                    <span className="text-[10px] text-slate-400 block uppercase font-mono">Equipment (25%)</span>
                    <span className="text-sm font-bold text-white">{bd.equipment?.score}%</span>
                    <span className="text-[11px] text-slate-400 block truncate">{bd.equipment?.type_load} vs {bd.equipment?.type_truck}</span>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5">
                    <span className="text-[10px] text-slate-400 block uppercase font-mono">Capacity (25%)</span>
                    <span className="text-sm font-bold text-white">{bd.weight_capacity?.score}%</span>
                    <span className="text-[11px] text-slate-400 block">{bd.weight_capacity?.ratio} payload</span>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5">
                    <span className="text-[10px] text-slate-400 block uppercase font-mono">Proximity (30%)</span>
                    <span className="text-sm font-bold text-white">{bd.proximity?.score}%</span>
                    <span className="text-[11px] text-slate-400 block">{bd.proximity?.deadhead_miles} mi deadhead</span>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5">
                    <span className="text-[10px] text-slate-400 block uppercase font-mono">Date Fit (10%)</span>
                    <span className="text-sm font-bold text-white">{bd.date_alignment?.score}%</span>
                    <span className="text-[11px] text-slate-400 block truncate">{bd.date_alignment?.pickup_date}</span>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-slate-400 block uppercase font-mono">Rate Fit (10%)</span>
                    <span className="text-sm font-bold text-white">{bd.rate_fit?.score}%</span>
                    <span className="text-[11px] text-slate-400 block">${bd.rate_fit?.budget} budget</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
