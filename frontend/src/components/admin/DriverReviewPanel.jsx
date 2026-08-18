import React from "react";
import { X } from "lucide-react";
import DriverDocuments from "./DriverDocuments";
import StatusBadge from "../ui/StatusBadge";

const Field = ({ label, value }) => <div><p className="text-xs font-semibold uppercase tracking-wide text-[#849087]">{label}</p><p className="mt-1 break-words text-sm font-medium text-[#2d493c]">{value === null || value === undefined || value === "" ? "—" : String(value)}</p></div>;
const ids = (value) => Array.isArray(value) && value.length ? value.join(", ") : "None";

const DriverReviewPanel = ({ driver, onClose, onAction }) => {
  if (!driver) return null;
  return <div className="fixed inset-0 z-40 bg-[#183327]/35" onMouseDown={onClose}>
    <aside className="ml-auto h-full w-full max-w-xl overflow-y-auto bg-[#fffdf8] shadow-2xl" onMouseDown={(e)=>e.stopPropagation()}>
      <div className="sticky top-0 flex items-center justify-between border-b border-[#e8dfc8] bg-[#fffdf8]/95 px-6 py-5 backdrop-blur"><div><p className="text-xs font-bold uppercase tracking-widest text-[#2d6a4f]">Driver review</p><h2 className="text-2xl font-bold text-[#1f3c30]">{driver.full_name}</h2></div><button onClick={onClose} className="rounded-xl p-2 hover:bg-[#f4ecd9]"><X className="h-5 w-5"/></button></div>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between rounded-2xl border border-[#e6dfcb] bg-white p-4"><div><p className="text-xs text-[#829087]">Current status</p><div className="mt-1"><StatusBadge status={driver.status}/></div></div><p className="text-xs text-[#829087]">Submitted {driver.created_at ? new Date(driver.created_at).toLocaleString() : "—"}</p></div>
        <section className="rounded-2xl border border-[#e6dfcb] bg-white p-5"><h3 className="font-bold text-[#29483a]">Profile details</h3><div className="mt-4 grid grid-cols-2 gap-5"><Field label="Phone" value={driver.phone}/><Field label="CDL class" value={driver.cdl_class}/><Field label="Experience" value={`${driver.years_experience ?? 0} years`}/><Field label="Availability" value={driver.availability}/><Field label="Region ID" value={driver.preferred_region}/><Field label="User ID" value={driver.user}/><Field label="Endorsement IDs" value={ids(driver.endorsements)}/><Field label="Equipment IDs" value={ids(driver.equipment_types)}/></div></section>
        <DriverDocuments documents={driver.documents} />
        {driver.status_reason && <section className="rounded-2xl border border-[#dce7df] bg-[#f4f8f5] p-5"><p className="text-xs font-semibold uppercase tracking-wide text-[#688076]">Latest admin comment</p><p className="mt-2 text-sm text-[#365547]">{driver.status_reason}</p></section>}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3"><button onClick={()=>onAction("request_changes")} className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-3 text-sm font-bold text-amber-800">Request changes</button><button onClick={()=>onAction("reject")} className="rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm font-bold text-red-700">Reject</button><button onClick={()=>onAction("approve")} className="rounded-xl bg-[#2d6a4f] px-3 py-3 text-sm font-bold text-white shadow-sm">Approve</button></div>
      </div>
    </aside>
  </div>;
};
export default DriverReviewPanel;
