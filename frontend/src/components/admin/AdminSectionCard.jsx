import React from "react";

const AdminSectionCard = ({ title, description, action, children, className = "" }) => (
  <section className={`rounded-3xl border border-[#e7dfca] bg-[#fffdf8] p-5 shadow-sm sm:p-6 ${className}`}>
    {(title || description || action) && (
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {title && <h2 className="text-lg font-bold text-[#29483a]">{title}</h2>}
          {description && <p className="mt-1 text-sm leading-6 text-[#7a8780]">{description}</p>}
        </div>
        {action}
      </div>
    )}
    {children}
  </section>
);

export default AdminSectionCard;
