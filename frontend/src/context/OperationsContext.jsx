import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { getApiErrorMessage } from "../api/client";
import { operationsApi } from "../api/operations";

const OperationsContext = createContext(null);

export const OperationsProvider = ({ children }) => {
  const [loads, setLoads] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [matches, setMatches] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const run = useCallback(async (request, fallback) => {
    try {
      return await request();
    } catch (err) {
      throw new Error(getApiErrorMessage(err, fallback));
    }
  }, []);

  const loadLoads = useCallback(async () => {
    const { data } = await run(() => operationsApi.getLoads(), "Unable to load freight loads.");
    setLoads(Array.isArray(data) ? data : []);
    return data;
  }, [run]);

  const loadTrucks = useCallback(async () => {
    const { data } = await run(() => operationsApi.getTrucks(), "Unable to load trucks.");
    setTrucks(Array.isArray(data) ? data : []);
    return data;
  }, [run]);

  const loadMatches = useCallback(async () => {
    const { data } = await run(() => operationsApi.getMatches(), "Unable to load matches.");
    setMatches(Array.isArray(data) ? data : []);
    return data;
  }, [run]);

  const loadStats = useCallback(async () => {
    const { data } = await run(() => operationsApi.getStats(), "Unable to load operations statistics.");
    setStats(data || null);
    return data;
  }, [run]);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    setError("");
    const results = await Promise.allSettled([loadLoads(), loadTrucks(), loadMatches(), loadStats()]);
    const rejected = results.find((result) => result.status === "rejected");
    if (rejected) setError(rejected.reason?.message || "Some operations data could not be loaded.");
    setLoading(false);
    return results;
  }, [loadLoads, loadTrucks, loadMatches, loadStats]);

  const createLoad = useCallback(async (payload) => {
    const { data } = await run(() => operationsApi.createLoad(payload), "Unable to create load.");
    setLoads((current) => [data, ...current.filter((item) => item.id !== data.id)]);
    return data;
  }, [run]);

  const updateLoad = useCallback(async (id, payload) => {
    const { data } = await run(() => operationsApi.updateLoad(id, payload), "Unable to update load.");
    setLoads((current) => current.map((item) => (item.id === id ? data : item)));
    return data;
  }, [run]);

  const deleteLoad = useCallback(async (id) => {
    await run(() => operationsApi.deleteLoad(id), "Unable to delete load.");
    setLoads((current) => current.filter((item) => item.id !== id));
  }, [run]);

  const createTruck = useCallback(async (payload) => {
    const { data } = await run(() => operationsApi.createTruck(payload), "Unable to register truck.");
    setTrucks((current) => [data, ...current.filter((item) => item.id !== data.id)]);
    return data;
  }, [run]);

  const updateTruck = useCallback(async (id, payload) => {
    const { data } = await run(() => operationsApi.updateTruck(id, payload), "Unable to update truck.");
    setTrucks((current) => current.map((item) => (item.id === id ? data : item)));
    return data;
  }, [run]);

  const deleteTruck = useCallback(async (id) => {
    await run(() => operationsApi.deleteTruck(id), "Unable to delete truck.");
    setTrucks((current) => current.filter((item) => item.id !== id));
  }, [run]);

  const findMatches = useCallback(async (payload) => {
    const { data } = await run(() => operationsApi.findMatches(payload), "Unable to calculate matches.");
    if (Array.isArray(data?.matches)) {
      setMatches((current) => {
        const byId = new Map(current.map((item) => [item.id, item]));
        data.matches.forEach((item) => byId.set(item.id, item));
        return [...byId.values()].sort((a, b) => Number(b.match_score || 0) - Number(a.match_score || 0));
      });
    }
    return data;
  }, [run]);

  const acceptMatch = useCallback(async (matchId) => {
    const { data } = await run(() => operationsApi.acceptMatch(matchId), "Unable to accept match.");
    setMatches((current) => current.map((item) => (
      item.id === matchId ? { ...item, status: "ACCEPTED", ...(data?.data || {}) } : item
    )));
    return data;
  }, [run]);

  const value = useMemo(() => ({
    loads,
    trucks,
    matches,
    stats,
    loading,
    error,
    loadLoads,
    loadTrucks,
    loadMatches,
    loadStats,
    refreshAll,
    createLoad,
    updateLoad,
    deleteLoad,
    createTruck,
    updateTruck,
    deleteTruck,
    findMatches,
    acceptMatch,
  }), [
    loads, trucks, matches, stats, loading, error,
    loadLoads, loadTrucks, loadMatches, loadStats, refreshAll,
    createLoad, updateLoad, deleteLoad, createTruck, updateTruck, deleteTruck,
    findMatches, acceptMatch,
  ]);

  return <OperationsContext.Provider value={value}>{children}</OperationsContext.Provider>;
};

export const useOperations = () => {
  const context = useContext(OperationsContext);
  if (!context) throw new Error("useOperations must be used inside OperationsProvider");
  return context;
};
