import React, { useState, useEffect } from 'react';
import { getStats } from './api';
import { useWebSocket } from './useWebSocket';

import MatchingHub from './components/MatchingHub';
import LoadManager from './components/LoadManager';
import FleetManager from './components/FleetManager';
import RealtimeConsole from './components/RealtimeConsole';
import CloudinaryUploader from './components/CloudinaryUploader';

import { Cpu, Package, Truck, Radio, Cloud, BarChart3, RefreshCw, Zap } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('matching');
  const [stats, setStats] = useState(null);
  const { isConnected, messages, latestEvent, sendPayload } = useWebSocket();

  useEffect(() => {
    fetchStats();
  }, [latestEvent]);

  const fetchStats = async () => {
    try {
      const res = await getStats();
      setStats(res.data);
    } catch (e) {
      console.error('Error fetching stats:', e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/20 font-black text-xl">
              T
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                TruckLink <span className="text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded font-mono font-normal">Real-Time Core</span>
              </h1>
              <p className="text-[11px] text-slate-400">Logistics Matching Engine & Cloudinary Media Hub</p>
            </div>
          </div>

          {/* Stats & WebSocket Pill */}
          <div className="hidden md:flex items-center space-x-4">
            {stats && (
              <div className="flex items-center space-x-3 text-xs border-r border-slate-800 pr-4">
                <div>
                  <span className="text-slate-400 block">Open Loads</span>
                  <span className="font-bold text-white font-mono">{stats.open_loads}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Available Fleet</span>
                  <span className="font-bold text-white font-mono">{stats.available_trucks}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Matches Accepted</span>
                  <span className="font-bold text-emerald-400 font-mono">{stats.accepted_matches}</span>
                </div>
              </div>
            )}

            {/* WebSocket Indicator */}
            <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border text-xs font-mono font-semibold ${
              isConnected 
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400' 
                : 'bg-rose-950/60 border-rose-500/40 text-rose-400'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-ping' : 'bg-rose-400'}`}></span>
              <span>{isConnected ? 'Channels Online' : 'WS Offline'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto space-x-2 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800 scrollbar-none">
          <button
            onClick={() => setActiveTab('matching')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'matching' 
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Matching Logic Engine</span>
          </button>

          <button
            onClick={() => setActiveTab('loads')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'loads' 
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Loads & Cloudinary Uploads</span>
          </button>

          <button
            onClick={() => setActiveTab('fleet')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'fleet' 
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Carrier Fleet</span>
          </button>

          <button
            onClick={() => setActiveTab('realtime')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'realtime' 
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>Django Channels WS Stream</span>
          </button>

          <button
            onClick={() => setActiveTab('cloudinary')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'cloudinary' 
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Cloud className="w-4 h-4" />
            <span>Standalone Cloudinary Uploader</span>
          </button>
        </div>

        {/* View Switching */}
        {activeTab === 'matching' && <MatchingHub onMatchAccepted={() => fetchStats()} />}
        {activeTab === 'loads' && <LoadManager />}
        {activeTab === 'fleet' && <FleetManager />}
        {activeTab === 'realtime' && (
          <RealtimeConsole
            isConnected={isConnected}
            messages={messages}
            sendPayload={sendPayload}
          />
        )}
        {activeTab === 'cloudinary' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 max-w-xl mx-auto space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Cloud className="w-5 h-5 text-cyan-400" />
              <span>Direct Cloudinary Media Uploader</span>
            </h3>
            <p className="text-slate-400 text-sm">
              Test Cloudinary image or PDF upload directly to the `/api/upload/cloudinary/` endpoint.
            </p>
            <CloudinaryUploader
              label="Select Cargo Photo, BOL, or Driver Permit"
              folder="trucklink_general"
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
