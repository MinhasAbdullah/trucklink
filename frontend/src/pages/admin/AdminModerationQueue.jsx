import React, { useEffect, useMemo, useState } from "react";
import { RefreshCw, Search, ShieldCheck, Truck, Users, UserCheck, UserX } from "lucide-react";
import AdminDriverTable from "../../components/admin/AdminDriverTable";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminSectionCard from "../../components/admin/AdminSectionCard";
import AdminStatCard from "../../components/admin/AdminStatCard";
import DriverReviewPanel from "../../components/admin/DriverReviewPanel";
import ModerationActionModal from "../../components/admin/ModerationActionModal";
import EmptyState from "../../components/ui/EmptyState";
import LoadingState from "../../components/ui/LoadingState";
import { useAdminModeration } from "../../context/AdminModerationContext";

const AdminModerationQueue = () => {
  const { drivers, analytics, loading, actionLoadingId, error, loadDashboard, moderateDriver } = useAdminModeration();
  const [selected, setSelected] = useState(null);
  const [action, setAction] = useState(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const filtered = useMemo(
    () =>
      drivers
        .filter((driver) =>
          `${driver.full_name || ""} ${driver.phone || ""} ${driver.cdl_class || ""}`
            .toLowerCase()
            .includes(search.toLowerCase())
        )
        .sort((a, b) => {
          const av = new Date(a.created_at || 0).getTime();
          const bv = new Date(b.created_at || 0).getTime();
          return sort === "newest" ? bv - av : av - bv;
        }),
    [drivers, search, sort]
  );
  const stats = analytics?.driver_status_breakdown || {};

  const confirmAction = async (comment) => {
    setActionError("");
    try {
      await moderateDriver(selected.id, action, comment);
      setAction(null);
      setSelected(null);
    } catch (err) {
      setActionError(err.message);
    }
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Platform moderation"
        title="Moderation Queue"
        description="Review submitted driver information, add feedback, and approve, reject, or request changes."
        actions={
          <button
            type="button"
            onClick={loadDashboard}
            disabled={loading}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#2d6a4f] px-4 text-sm font-bold text-white disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="Pending" value={stats.pending ?? drivers.length} icon={Truck} />
        <AdminStatCard label="Approved" value={stats.approved} icon={UserCheck} />
        <AdminStatCard label="Rejected" value={stats.rejected} icon={UserX} />
        <AdminStatCard label="Driver signups" value={analytics?.total_driver_signups} icon={Users} />
      </div>

      <AdminSectionCard
        className="mt-6"
        title="Pending driver profiles"
        description={`${filtered.length} profile${filtered.length === 1 ? "" : "s"} waiting for review`}
        action={
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <label className="flex min-w-64 items-center gap-2 rounded-xl border border-[#dbe3dd] bg-white px-3 py-2">
              <Search className="h-4 w-4 text-[#84938a]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search driver, phone, CDL"
                className="w-full bg-transparent text-sm outline-none"
              />
            </label>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="rounded-xl border border-[#dbe3dd] bg-white px-3 py-2 text-sm outline-none"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>
        }
      >
        {error && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-bold">Queue API error</p>
            <p className="mt-1">{error}</p>
          </div>
        )}
        {loading ? (
          <LoadingState label="Loading moderation queue..." />
        ) : filtered.length ? (
          <AdminDriverTable drivers={filtered} onReview={setSelected} />
        ) : (
          <EmptyState
            icon={ShieldCheck}
            title="No pending drivers"
            description={error ? "Fix the API error above and refresh." : "Every submitted profile has been reviewed."}
          />
        )}
      </AdminSectionCard>

      {actionError && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>}

      <DriverReviewPanel driver={selected} onClose={() => setSelected(null)} onAction={setAction} />
      <ModerationActionModal
        open={Boolean(action)}
        action={action}
        driver={selected}
        loading={actionLoadingId === selected?.id}
        onClose={() => setAction(null)}
        onConfirm={confirmAction}
      />
    </>
  );
};

export default AdminModerationQueue;
