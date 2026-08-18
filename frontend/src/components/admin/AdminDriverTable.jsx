import React from "react";
import { ChevronRight } from "lucide-react";
import StatusBadge from "../ui/StatusBadge";

const AdminDriverTable = ({ drivers, onReview }) => (
  <div className="overflow-hidden rounded-2xl border border-[#e5decb] bg-white shadow-sm">
    <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 border-b border-[#eee7d5] bg-[#fffaf0] px-5 py-3 text-xs font-bold uppercase tracking-wide text-[#78867d] md:grid"><span>Driver</span><span>CDL</span><span>Experience</span><span>Status</span><span/></div>
    <div className="divide-y divide-[#eee9db]">{drivers.map((driver)=><button key={driver.id} onClick={()=>onReview(driver)} className="grid w-full grid-cols-1 gap-3 px-5 py-4 text-left transition hover:bg-[#fbf8ef] md:grid-cols-[2fr_1fr_1fr_1fr_auto] md:items-center md:gap-4"><div><p className="font-bold text-[#284638]">{driver.full_name}</p><p className="text-xs text-[#7e8b83]">{driver.phone || "No phone"} · ID #{driver.id}</p></div><p className="text-sm font-medium text-[#51675b]">{driver.cdl_class || "—"}</p><p className="text-sm text-[#51675b]">{driver.years_experience ?? 0} years</p><div><StatusBadge status={driver.status}/></div><ChevronRight className="hidden h-5 w-5 text-[#8fa097] md:block"/></button>)}</div>
  </div>
);
export default AdminDriverTable;
