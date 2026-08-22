import React, { useEffect, useMemo, useState } from "react";
import { RefreshCw, Search, SlidersHorizontal } from "lucide-react";
import AppHeader from "../../components/layout/AppHeader";
import MatchCard from "../../components/operations/MatchCard";
import LoadingState from "../../components/ui/LoadingState";
import { useAuth } from "../../context/AuthContext";
import { useOperations } from "../../context/OperationsContext";

const MatchesPage = () => {
  const { role } = useAuth();
  const { matches, loadMatches, acceptMatch } = useOperations();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("ALL");
  const [query, setQuery] = useState("");
  const [acceptingId, setAcceptingId] = useState(null);

  const refresh = async () => {
    setLoading(true); setError("");
    try { await loadMatches(); } catch (err) { setError(err.message); } finally { setLoading(false); }
  };
  useEffect(() => { refresh(); }, []);

  const filtered = useMemo(() => matches.filter((match) => {
    const matchesStatus = status === "ALL" || match.status === status;
    const haystack = [
      match.load_details?.title,
      match.truck_details?.truck_number,
      match.truck_details?.driver_name,
      match.load_details?.origin_city,
      match.load_details?.destination_city,
    ].join(" ").toLowerCase();
    return matchesStatus && haystack.includes(query.toLowerCase());
  }), [matches, status, query]);

  const accept = async (id) => {
    setAcceptingId(id); setError("");
    try { await acceptMatch(id); } catch (err) { setError(err.message); } finally { setAcceptingId(null); }
  };

  return (
    <div className="min-h-screen bg-[#f7f4ea]">
      <AppHeader title={`TruckLink ${role === "recruiter" ? "Recruiter" : role === "admin" ? "Admin" : "Driver"}`} subtitle="Freight matching" actions={<button onClick={refresh} className="rounded-xl bg-[#2d6a4f] p-2.5 text-white" aria-label="Refresh matches"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /></button>} />
      <main className="mx-auto max-w-6xl space-y-5 p-4 py-8 sm:px-6">
        <div><p className="text-xs font-bold uppercase tracking-widest text-[#2d6a4f]">Freight opportunities</p><h1 className="text-3xl font-black text-[#203d31]">Recommended matches</h1><p className="mt-1 text-sm text-[#718078]">Review matched loads and trucks, compare fit, and confirm the right opportunities.</p></div>
        {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8aa89a]" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search load, driver, truck, or city..." className="w-full rounded-xl border-2 border-[#dde7e0] bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-[#2d6a4f]" /></div>
          <label className="relative"><SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8aa89a]" /><select value={status} onChange={(e) => setStatus(e.target.value)} className="h-full rounded-xl border-2 border-[#dde7e0] bg-white py-2.5 pl-10 pr-8 text-sm outline-none focus:border-[#2d6a4f]"><option value="ALL">All statuses</option><option value="PROPOSED">Proposed</option><option value="ACCEPTED">Accepted</option><option value="REJECTED">Rejected</option></select></label>
        </div>
        {loading && !matches.length ? <LoadingState label="Loading matches..." /> : <div className="space-y-4">{filtered.length ? filtered.map((match) => <MatchCard key={match.id} match={match} onAccept={accept} accepting={acceptingId === match.id} />) : <div className="rounded-2xl border border-[#e8f5ee] bg-white p-8 text-center text-sm text-[#718078]">No matches found for this filter.</div>}</div>}
      </main>
    </div>
  );
};

export default MatchesPage;
