import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

const labels = { approve: "Approve profile", reject: "Reject profile", request_changes: "Request changes" };

const ModerationActionModal = ({ open, action, driver, loading, onClose, onConfirm }) => {
  const [comment, setComment] = useState("");
  useEffect(() => { if (open) setComment(""); }, [open, action, driver?.id]);
  if (!open || !driver) return null;
  const needsReason = action !== "approve";

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#173126]/45 p-4" onMouseDown={onClose}>
    <div className="w-full max-w-lg rounded-3xl border border-[#e7dcc0] bg-[#fffdf8] p-6 shadow-2xl" onMouseDown={(e)=>e.stopPropagation()}>
      <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-widest text-[#2d6a4f]">Moderation action</p><h3 className="mt-1 text-xl font-bold text-[#203d31]">{labels[action]}</h3><p className="mt-1 text-sm text-[#718078]">{driver.full_name}</p></div><button onClick={onClose} className="rounded-xl p-2 text-[#76847c] hover:bg-[#f3ecd9]"><X className="h-5 w-5"/></button></div>
      <label className="mt-5 block text-sm font-semibold text-[#496255]">Comment {needsReason ? "*" : "(optional)"}</label>
      <textarea value={comment} onChange={(e)=>setComment(e.target.value)} rows={4} placeholder={needsReason ? "Explain what the driver needs to change..." : "Optional approval note"} className="mt-2 w-full rounded-2xl border border-[#d9dfd9] bg-white px-4 py-3 text-sm outline-none focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/15" />
      <div className="mt-5 flex justify-end gap-2"><button onClick={onClose} disabled={loading} className="rounded-xl border border-[#d8ded9] bg-white px-4 py-2.5 text-sm font-semibold text-[#52675c]">Cancel</button><button disabled={loading || (needsReason && !comment.trim())} onClick={()=>onConfirm(comment.trim())} className="rounded-xl bg-[#2d6a4f] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{loading ? "Saving..." : labels[action]}</button></div>
    </div>
  </div>;
};
export default ModerationActionModal;
