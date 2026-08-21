import React from "react";

const FormField = ({ label, hint, wide = false, children }) => (
  <label className={wide ? "sm:col-span-2" : ""}>
    <span className="mb-1.5 block text-sm font-semibold text-[#52675c]">{label}</span>
    {children}
    {hint && <span className="mt-1 block text-xs leading-5 text-[#8aa89a]">{hint}</span>}
  </label>
);

export const inputClass = "w-full rounded-xl border-2 border-[#dde7e0] bg-white px-3.5 py-2.5 text-sm text-[#29483a] outline-none transition focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/15 disabled:bg-[#f4f6f4]";

export default FormField;
