import React from "react";

const AdminStatCard = ({ label, value, icon: Icon }) => (
  <div className="rounded-2xl border border-[#eadfbd] bg-[#fffaf0] p-5 shadow-sm">
    <div className="flex items-center justify-between gap-3">
      <div><p className="text-xs font-semibold uppercase tracking-wide text-[#7c897f]">{label}</p><p className="mt-2 text-3xl font-bold text-[#244536]">{value ?? "—"}</p></div>
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e5f1e9] text-[#2d6a4f]">{Icon && <Icon className="h-5 w-5" />}</div>
    </div>
  </div>
);
export default AdminStatCard;
