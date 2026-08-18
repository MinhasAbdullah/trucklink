import React from "react";
import { Building2, LoaderCircle } from "lucide-react";
import StatusBadge from "../ui/StatusBadge";

const AdminRecruiterTable = ({ recruiters, updatingId, onStatusChange }) => (
  <div className="overflow-hidden rounded-2xl border border-[#e5decb] bg-white">
    <div className="hidden grid-cols-[2fr_1fr_1fr_auto] gap-4 border-b border-[#eee7d5] bg-[#fffaf0] px-5 py-3 text-xs font-bold uppercase tracking-wide text-[#78867d] md:grid">
      <span>Recruiter</span>
      <span>Status</span>
      <span>User ID</span>
      <span>Account action</span>
    </div>
    <div className="divide-y divide-[#eee9db]">
      {recruiters.map((recruiter) => {
        const busy = updatingId === recruiter.id;
        return (
          <div key={recruiter.id} className="grid grid-cols-1 gap-4 px-5 py-4 md:grid-cols-[2fr_1fr_1fr_auto] md:items-center">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#edf3ee] text-[#2d6a4f]">
                <Building2 className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0">
                <p className="truncate font-bold text-[#284638]">{recruiter.company_name || "Unnamed recruiter"}</p>
                <p className="truncate text-xs text-[#7e8b83]">{recruiter.contact_phone || "No contact phone"}</p>
              </div>
            </div>
            <div><StatusBadge status={recruiter.status} /></div>
            <p className="text-sm text-[#51675b]">#{recruiter.user ?? "—"}</p>
            <div className="flex items-center gap-2">
              {busy && <LoaderCircle className="h-4 w-4 animate-spin text-[#2d6a4f]" />}
              <select
                value={recruiter.status || "pending"}
                onChange={(event) => onStatusChange(recruiter, event.target.value)}
                disabled={busy}
                className="rounded-xl border border-[#dbe3dd] bg-white px-3 py-2 text-sm font-semibold text-[#3f5d4f] outline-none focus:border-[#2d6a4f] disabled:opacity-60"
                aria-label={`Update ${recruiter.company_name || "recruiter"} status`}
              >
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default AdminRecruiterTable;
