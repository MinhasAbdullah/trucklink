import React from "react";

const AdminPageHeader = ({ eyebrow, title, description, actions }) => (
  <div className="mb-6 flex flex-col gap-4 sm:mb-7 lg:flex-row lg:items-end lg:justify-between">
    <div className="min-w-0">
      {eyebrow && (
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#2d6a4f]">{eyebrow}</p>
      )}
      <h1 className="mt-1 text-3xl font-black tracking-tight text-[#1f3a2f] sm:text-[2rem]">{title}</h1>
      {description && <p className="mt-2 max-w-3xl text-sm leading-6 text-[#718078]">{description}</p>}
    </div>
    {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
  </div>
);

export default AdminPageHeader;
