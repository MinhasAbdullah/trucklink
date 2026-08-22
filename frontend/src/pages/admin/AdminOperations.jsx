import React, { useEffect, useState } from "react";
import { Activity, Box, CheckCircle2, Radio, RefreshCw, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { useOperations } from "../../context/OperationsContext";
import { useRealtimeEvents } from "../../hooks/useRealtimeEvents";
import LoadingState from "../../components/ui/LoadingState";
import MatchCard from "../../components/operations/MatchCard";

const friendlyStatus = (value) => String(value || "Unavailable").replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

const AdminOperations = () => {
  const { stats, loads, trucks, matches, loading, error, refreshAll, acceptMatch } = useOperations();
  const [acceptingId, setAcceptingId] = useState(null);
  const { status: realtimeStatus, lastEvent } = useRealtimeEvents(true);

  useEffect(() => { refreshAll(); }, []);
  const accept = async (id) => { setAcceptingId(id); try { await acceptMatch(id); await refreshAll(); } finally { setAcceptingId(null); } };
  const liveLabel = realtimeStatus === "connected" ? "Connected" : realtimeStatus === "connecting" ? "Connecting" : "Offline";
  const cards = [
    ["Open Loads", stats?.open_loads, Box, `of ${stats?.total_loads ?? "—"} total`],
    ["Available Trucks", stats?.available_trucks, Truck, `of ${stats?.total_trucks ?? "—"} total`],
    ["Accepted Matches", stats?.accepted_matches, CheckCircle2, "confirmed freight matches"],
    ["Service Status", friendlyStatus(stats?.system_status), Activity, `Live updates: ${liveLabel}`],
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#fff6df] px-3 py-1 text-xs font-semibold text-[#7d683b]"><Radio className="h-3.5 w-3.5" /> Live operations</div><h1 className="text-2xl font-bold text-[#1a2a3a]">Freight Operations</h1><p className="text-sm text-[#8aa89a]">Monitor active loads, trucks, matches, and recent activity.</p></div>
        <button onClick={refreshAll} className="inline-flex items-center gap-2 rounded-xl bg-[#2d6a4f] px-4 py-2.5 text-sm font-semibold text-white"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh</button>
      </div>

      {error && <div className="rounded-xl border border-amber-200 bg-[#fff8e8] p-3 text-sm text-[#765f2c]">{error}</div>}
      {loading && !stats ? <LoadingState label="Loading freight operations..." /> : <>
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">{cards.map(([label, value, Icon, sub]) => <div key={label} className="rounded-2xl border border-[#e8f5ee] bg-white p-5 shadow-sm"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f5ee]"><Icon className="h-5 w-5 text-[#2d6a4f]" /></div><p className="mt-4 text-2xl font-black text-[#1a2a3a]">{value ?? "—"}</p><p className="text-sm font-semibold text-[#4a6a5a]">{label}</p><p className="mt-1 text-xs text-[#8aa89a]">{sub}</p></div>)}</div>

        <div className="grid gap-6 xl:grid-cols-2">
          <section className="rounded-2xl border border-[#e8f5ee] bg-white p-5"><h2 className="font-bold text-[#29483a]">Latest loads</h2><div className="mt-4 space-y-3">{loads.slice(0, 5).map((load) => <div key={load.id} className="flex justify-between gap-3 rounded-xl bg-[#f8fbf9] p-3"><div><p className="text-sm font-semibold text-[#405d4f]">{load.title}</p><p className="text-xs text-[#8aa89a]">{load.origin_city} → {load.destination_city}</p></div><span className="text-xs font-bold capitalize text-[#2d6a4f]">{String(load.status || "").toLowerCase()}</span></div>)}{!loads.length && <p className="text-sm text-[#8aa89a]">No loads have been posted yet.</p>}</div></section>
          <section className="rounded-2xl border border-[#e8f5ee] bg-white p-5"><h2 className="font-bold text-[#29483a]">Latest trucks</h2><div className="mt-4 space-y-3">{trucks.slice(0, 5).map((truck) => <div key={truck.id} className="flex justify-between gap-3 rounded-xl bg-[#f8fbf9] p-3"><div><p className="text-sm font-semibold text-[#405d4f]">{truck.truck_number} · {truck.driver_name}</p><p className="text-xs text-[#8aa89a]">{truck.current_city} · {truck.equipment_type}</p></div><span className="text-xs font-bold capitalize text-[#2d6a4f]">{String(truck.status || "").toLowerCase()}</span></div>)}{!trucks.length && <p className="text-sm text-[#8aa89a]">No trucks have been registered yet.</p>}</div></section>
        </div>

        <section className="rounded-2xl border border-[#e8f5ee] bg-white p-5"><h2 className="font-bold text-[#29483a]">Live activity</h2><div className="mt-3 flex flex-wrap items-center gap-3"><span className={`rounded-full px-3 py-1 text-xs font-bold ${realtimeStatus === "connected" ? "bg-[#e8f5ee] text-[#2d6a4f]" : "bg-[#fff6df] text-[#8a6a2d]"}`}>{liveLabel}</span><span className="text-sm text-[#718078]">{lastEvent?.type ? `Latest update: ${friendlyStatus(lastEvent.type)}` : "Waiting for the next live update."}</span></div></section>

        <section><h2 className="mb-4 text-lg font-bold text-[#29483a]">Top freight matches</h2><div className="space-y-4">{matches.slice(0, 5).map((match) => <MatchCard key={match.id} match={match} onAccept={accept} accepting={acceptingId === match.id} />)}{!matches.length && <div className="rounded-2xl border border-[#e8f5ee] bg-white p-6 text-sm text-[#8aa89a]">No freight matches are available yet.</div>}</div></section>
      </>}
    </motion.div>
  );
};

export default AdminOperations;
