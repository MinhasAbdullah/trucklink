import React from "react";

const LoadingState = ({ label = "Loading..." }) => (
  <div className="flex min-h-48 items-center justify-center gap-3 rounded-2xl border border-[#ebe3cd] bg-white/80 p-8 text-sm font-medium text-[#617369]">
    <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#2d6a4f] border-t-transparent" />
    {label}
  </div>
);

export default LoadingState;
