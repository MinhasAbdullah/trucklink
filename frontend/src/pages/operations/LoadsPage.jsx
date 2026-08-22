import React, { useEffect, useMemo, useState } from "react";
import { Edit3, PackagePlus, RefreshCw, Search, Trash2, WandSparkles } from "lucide-react";
import AppHeader from "../../components/layout/AppHeader";
import LoadForm from "../../components/operations/LoadForm";
import MatchCard from "../../components/operations/MatchCard";
import LoadingState from "../../components/ui/LoadingState";
import { operationsApi } from "../../api/operations";
import { getApiErrorMessage } from "../../api/client";
import { useOperations } from "../../context/OperationsContext";

const LoadsPage = () => {
  const { loads, loadLoads, createLoad, updateLoad, deleteLoad, acceptMatch } = useOperations();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [matchingId, setMatchingId] = useState(null);
  const [matches, setMatches] = useState([]);
  const [acceptingId, setAcceptingId] = useState(null);

  const refresh = async () => {
    setLoading(true); setError("");
    try { await loadLoads(); } catch (err) { setError(err.message); } finally { setLoading(false); }
  };
  useEffect(() => { refresh(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return loads;
    return loads.filter((item) => [item.title, item.origin_city, item.destination_city, item.equipment_type, item.status].some((value) => String(value || "").toLowerCase().includes(q)));
  }, [loads, search]);

  const save = async (payload) => {
    if (editing) await updateLoad(editing.id, payload); else await createLoad(payload);
    setEditing(null); setShowForm(false);
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this load? This action cannot be undone.")) return;
    try { await deleteLoad(id); if (matchingId === id) { setMatchingId(null); setMatches([]); } } catch (err) { setError(err.message); }
  };

  const findMatches = async (load) => {
    setMatchingId(load.id); setError(""); setMatches([]);
    try { const { data } = await operationsApi.getLoadMatches(load.id); setMatches(data?.matches || []); } catch (err) { setError(getApiErrorMessage(err, "Unable to find matches for this load.")); }
  };

  const accept = async (id) => {
    setAcceptingId(id);
    try { await acceptMatch(id); setMatches((current) => current.map((item) => item.id === id ? { ...item, status: "ACCEPTED" } : item)); await loadLoads(); } catch (err) { setError(err.message); } finally { setAcceptingId(null); }
  };

  return <div className="min-h-screen bg-[#f7f4ea]">
    <AppHeader title="TruckLink Recruiter" subtitle="Freight loads" actions={<button onClick={refresh} className="rounded-xl bg-[#2d6a4f] p-2.5 text-white"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}/></button>} />
    <main className="mx-auto max-w-7xl space-y-6 p-4 py-8 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-xs font-bold uppercase tracking-widest text-[#2d6a4f]">Freight planning</p><h1 className="text-3xl font-black text-[#203d31]">Load management</h1><p className="mt-1 text-sm text-[#718078]">Create loads, attach documents, and find suitable trucks.</p></div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2d6a4f] px-4 py-3 text-sm font-bold text-white"><PackagePlus className="h-4 w-4"/> Create load</button>
      </div>
      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {showForm && <section className="rounded-3xl border border-[#e7dfca] bg-white p-6 shadow-sm"><h2 className="mb-5 text-xl font-bold text-[#29483a]">{editing ? `Edit ${editing.title}` : "Create freight load"}</h2><LoadForm initialValue={editing} onSubmit={save} onCancel={() => { setShowForm(false); setEditing(null); }} /></section>}
      <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8aa89a]"/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search title, city, equipment, status..." className="w-full rounded-xl border-2 border-[#dde7e0] bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-[#2d6a4f]"/></div>
      {loading && !loads.length ? <LoadingState label="Loading loads..."/> : filtered.length ? <div className="grid gap-4 lg:grid-cols-2">{filtered.map((load) => <article key={load.id} className="rounded-2xl border border-[#e8f5ee] bg-white p-5 shadow-sm"><div className="flex justify-between gap-4"><div><div className="flex flex-wrap gap-2"><span className="rounded-full bg-[#e8f5ee] px-2.5 py-1 text-xs font-bold text-[#2d6a4f]">{load.status}</span><span className="rounded-full bg-[#fff6df] px-2.5 py-1 text-xs font-bold text-[#8a6a2d]">{load.equipment_type}</span></div><h2 className="mt-3 text-lg font-bold text-[#29483a]">{load.title}</h2><p className="mt-1 text-sm text-[#718078]">{load.origin_city} → {load.destination_city}</p></div><div className="text-right"><p className="font-black text-[#29483a]">${Number(load.max_budget || 0).toLocaleString()}</p><p className="text-xs text-[#8aa89a]">{Number(load.weight_lbs || 0).toLocaleString()} lbs</p></div></div><div className="mt-4 flex flex-wrap gap-2"><button onClick={() => findMatches(load)} className="inline-flex items-center gap-1.5 rounded-lg bg-[#2d6a4f] px-3 py-2 text-xs font-bold text-white"><WandSparkles className="h-3.5 w-3.5"/> Find matches</button><button onClick={() => { setEditing(load); setShowForm(true); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="inline-flex items-center gap-1.5 rounded-lg border border-[#d9e5de] px-3 py-2 text-xs font-semibold text-[#4a6a5a]"><Edit3 className="h-3.5 w-3.5"/> Edit</button><button onClick={() => remove(load.id)} className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600"><Trash2 className="h-3.5 w-3.5"/> Delete</button></div></article>)}</div> : <div className="rounded-2xl border border-[#e8f5ee] bg-white p-8 text-center text-sm text-[#718078]">No loads found.</div>}
      {matchingId && <section className="rounded-3xl border border-[#e7dfca] bg-[#fffdf8] p-6"><h2 className="text-xl font-bold text-[#29483a]">Recommended matches</h2><p className="mt-1 text-sm text-[#718078]">Review trucks that fit this load’s route, equipment, capacity, and availability.</p><div className="mt-5 space-y-4">{matches.length ? matches.map((match) => <MatchCard key={match.id} match={match} onAccept={accept} accepting={acceptingId === match.id}/>) : <p className="rounded-xl bg-white p-5 text-sm text-[#718078]">No qualifying matches found for this load.</p>}</div></section>}
    </main>
  </div>;
};

export default LoadsPage;
