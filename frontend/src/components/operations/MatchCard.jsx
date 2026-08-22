import React from "react";
import { CheckCircle2, MapPin, Truck, Package, Gauge } from "lucide-react";

const MatchCard = ({ match, onAccept, accepting = false }) => {
  const load = match.load_details || match.load || {};
  const truck = match.truck_details || match.truck || {};
  const accepted = match.status === "ACCEPTED";
  return (
    <article className="rounded-2xl border border-[#e8f5ee] bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#e8f5ee] px-2.5 py-1 text-xs font-bold text-[#2d6a4f]">Recommended match</span>
            <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${accepted ? "bg-emerald-50 text-emerald-700" : "bg-[#fff6df] text-[#8a6a2d]"}`}>{match.status}</span>
          </div>
          <h3 className="mt-3 text-lg font-bold text-[#1a2a3a]">{load.title || "Freight load"}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-[#718078]"><MapPin className="h-4 w-4" /> {load.origin_city || "Origin"} → {load.destination_city || "Destination"}</p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-3xl font-black text-[#2d6a4f]">{Number(match.match_score || 0).toFixed(1)}%</p>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#8aa89a]">Match score</p>
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-[#f8fbf9] p-3"><p className="flex items-center gap-1.5 text-xs font-bold uppercase text-[#8aa89a]"><Truck className="h-3.5 w-3.5" /> Truck</p><p className="mt-1 text-sm font-semibold text-[#405d4f]">{truck.truck_number || "Truck"}</p><p className="text-xs text-[#718078]">{truck.driver_name || "Driver"}</p></div>
        <div className="rounded-xl bg-[#f8fbf9] p-3"><p className="flex items-center gap-1.5 text-xs font-bold uppercase text-[#8aa89a]"><Package className="h-3.5 w-3.5" /> Equipment</p><p className="mt-1 text-sm font-semibold text-[#405d4f]">{truck.equipment_type || load.equipment_type || "—"}</p></div>
        <div className="rounded-xl bg-[#f8fbf9] p-3"><p className="flex items-center gap-1.5 text-xs font-bold uppercase text-[#8aa89a]"><Gauge className="h-3.5 w-3.5" /> Deadhead</p><p className="mt-1 text-sm font-semibold text-[#405d4f]">{match.breakdown?.proximity?.deadhead_miles ?? "—"} mi</p></div>
      </div>
      {onAccept && (
        <div className="mt-4 flex justify-end">
          <button type="button" onClick={() => onAccept(match.id)} disabled={accepted || accepting} className="inline-flex items-center gap-2 rounded-xl bg-[#2d6a4f] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"><CheckCircle2 className="h-4 w-4" /> {accepted ? "Accepted" : accepting ? "Accepting..." : "Accept match"}</button>
        </div>
      )}
    </article>
  );
};

export default MatchCard;
