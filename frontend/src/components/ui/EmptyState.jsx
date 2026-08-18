import React from "react";
import { Inbox } from "lucide-react";

const EmptyState = ({ title, description, icon: Icon = Inbox }) => (
  <div className="rounded-2xl border border-dashed border-[#d9d0b7] bg-[#fffaf0] p-10 text-center">
    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f2ec]">
      <Icon className="h-6 w-6 text-[#2d6a4f]" />
    </div>
    <h3 className="font-semibold text-[#263d33]">{title}</h3>
    <p className="mx-auto mt-1 max-w-md text-sm text-[#748178]">{description}</p>
  </div>
);

export default EmptyState;
