import React, { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Building2,
  CheckCircle,
  Clock,
  RefreshCw,
  Search,
  Shield,
  Users,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAdminRecruiters } from "../../context/AdminRecruitersContext";
import LoadingState from "../../components/ui/LoadingState";

const statusConfig = {
  active: { label: "Active", className: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle },
  pending: { label: "Pending", className: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock },
  suspended: { label: "Suspended", className: "bg-red-50 text-red-700 border-red-200", icon: XCircle },
};

const AdminRecruiters = () => {
  const { recruiters, loading, updatingId, error, loadRecruiters, updateRecruiterStatus } = useAdminRecruiters();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    loadRecruiters();
  }, [loadRecruiters]);

  const filteredRecruiters = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return recruiters.filter((recruiter) => {
      const matchesStatus = filterStatus === "all" || recruiter.status === filterStatus;
      const matchesSearch =
        !term ||
        String(recruiter.company_name || "").toLowerCase().includes(term) ||
        String(recruiter.contact_phone || "").toLowerCase().includes(term) ||
        String(recruiter.user || "").includes(term);
      return matchesStatus && matchesSearch;
    });
  }, [filterStatus, recruiters, searchTerm]);

  const counts = useMemo(
    () => ({
      all: recruiters.length,
      active: recruiters.filter((item) => item.status === "active").length,
      pending: recruiters.filter((item) => item.status === "pending").length,
      suspended: recruiters.filter((item) => item.status === "suspended").length,
    }),
    [recruiters]
  );

  const changeStatus = async (recruiter, status) => {
    if (recruiter.status === status) return;
    setActionError("");
    try {
      await updateRecruiterStatus(recruiter.id, status);
    } catch (err) {
      setActionError(err.message || "Unable to update recruiter status.");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-[#1a2a3a]">
            <Users className="h-6 w-6 text-[#2d6a4f]" /> Recruiter Accounts
          </h1>
          <p className="text-sm text-[#8aa89a]">Approve, monitor, or suspend recruiter accounts.</p>
        </div>
        <button
          type="button"
          onClick={loadRecruiters}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-[#2d6a4f] px-4 py-2.5 text-sm font-medium text-white shadow-md transition hover:bg-[#1a4a35] disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {(error || actionError) && (
        <div className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {actionError || error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["All recruiters", counts.all, Users, "all"],
          ["Active", counts.active, CheckCircle, "active"],
          ["Pending", counts.pending, Clock, "pending"],
          ["Suspended", counts.suspended, XCircle, "suspended"],
        ].map(([label, value, Icon, key]) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilterStatus(key)}
            className={`rounded-2xl border p-4 text-left shadow-sm transition ${
              filterStatus === key ? "border-[#2d6a4f] bg-[#e8f5ee]" : "border-[#e8f5ee] bg-white hover:border-[#b8d5c8]"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f0f7f4] text-[#2d6a4f]"><Icon className="h-4 w-4" /></div>
              <span className="text-2xl font-bold text-[#1a2a3a]">{value}</span>
            </div>
            <p className="mt-3 text-sm font-medium text-[#4a6a5a]">{label}</p>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8aa89a]" />
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search company or phone..."
            className="w-full rounded-xl border-2 border-[#e8f5ee] bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/15"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(event) => setFilterStatus(event.target.value)}
          className="rounded-xl border-2 border-[#e8f5ee] bg-white px-4 py-2.5 text-sm text-[#4a6a5a] outline-none focus:border-[#2d6a4f]"
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {loading && !recruiters.length ? (
        <LoadingState label="Loading recruiter accounts..." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#e8f5ee] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px]">
              <thead>
                <tr className="bg-gradient-to-r from-[#f8fbf9] to-[#fff6df]/60 text-left">
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-[#8aa89a]">Company</th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-[#8aa89a]">Contact</th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-[#8aa89a]">Joined</th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-[#8aa89a]">Status</th>
                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-[#8aa89a]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eef4ef]">
                {filteredRecruiters.length ? (
                  filteredRecruiters.map((recruiter, index) => {
                    const cfg = statusConfig[recruiter.status] || statusConfig.pending;
                    const StatusIcon = cfg.icon;
                    const busy = updatingId === recruiter.id;
                    return (
                      <motion.tr
                        key={recruiter.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.02 }}
                        className="transition hover:bg-[#f8fbf9]"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f5ee] text-[#2d6a4f]"><Building2 className="h-5 w-5" /></div>
                            <div>
                              <p className="font-semibold text-[#1a2a3a]">{recruiter.company_name || `Recruiter #${recruiter.id}`}</p>
                              <p className="text-xs text-[#8aa89a]">Recruiter account</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-[#4a6a5a]">{recruiter.contact_phone || "Not provided"}</td>
                        <td className="px-5 py-4 text-sm text-[#8aa89a]">
                          {recruiter.created_at ? new Date(recruiter.created_at).toLocaleDateString() : "—"}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${cfg.className}`}>
                            <StatusIcon className="h-3.5 w-3.5" /> {cfg.label}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            {recruiter.status !== "active" && (
                              <button
                                type="button"
                                onClick={() => changeStatus(recruiter, "active")}
                                disabled={busy}
                                className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50"
                              >
                                Activate
                              </button>
                            )}
                            {recruiter.status !== "suspended" && (
                              <button
                                type="button"
                                onClick={() => changeStatus(recruiter, "suspended")}
                                disabled={busy}
                                className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                              >
                                Suspend
                              </button>
                            )}
                            {recruiter.status !== "pending" && (
                              <button
                                type="button"
                                onClick={() => changeStatus(recruiter, "pending")}
                                disabled={busy}
                                className="rounded-lg bg-[#fff6df] px-3 py-2 text-xs font-semibold text-[#8a6a2d] transition hover:bg-[#faedcb] disabled:opacity-50"
                              >
                                Pending
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-14 text-center">
                      <Shield className="mx-auto h-10 w-10 text-[#c8d8cf]" />
                      <p className="mt-3 font-medium text-[#4a6a5a]">No recruiter accounts match this view.</p>
                      <p className="mt-1 text-sm text-[#8aa89a]">Try a different search or status filter.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AdminRecruiters;
