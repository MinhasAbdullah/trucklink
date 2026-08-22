import React, { useState } from "react";
import { AlertCircle, Database, MapPin, Search, Tag, Truck } from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  {
    id: "endorsements",
    label: "Endorsements",
    singular: "Endorsement",
    icon: Tag,
    backendModel: "EndorsementType",
  },
  {
    id: "equipment",
    label: "Equipment",
    singular: "Equipment Type",
    icon: Truck,
    backendModel: "EquipmentType",
  },
  {
    id: "regions",
    label: "Regions",
    singular: "Region",
    icon: MapPin,
    backendModel: "Region",
  },
];

const AdminMasterData = () => {
  const [activeTab, setActiveTab] = useState("endorsements");
  const [searchTerm, setSearchTerm] = useState("");
  const active = categories.find((item) => item.id === activeTab) || categories[0];
  const ActiveIcon = active.icon;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-[#1a2a3a]">
          <Database className="h-6 w-6 text-[#2d6a4f]" /> Master Data Management
        </h1>
        <p className="text-sm text-[#8aa89a]">Endorsement types, equipment types, and service regions</p>
      </div>

      <div className="flex flex-wrap gap-2 rounded-2xl border border-[#e8f5ee] bg-white/90 p-1.5 shadow-sm backdrop-blur">
        {categories.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition ${
                isActive ? "bg-[#2d6a4f] text-white shadow-md" : "text-[#4a6a5a] hover:bg-[#e8f5ee]"
              }`}
            >
              <Icon className="h-4 w-4" /> {tab.label}
            </motion.button>
          );
        })}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8aa89a]" />
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder={`Search ${active.label.toLowerCase()}...`}
          disabled
          className="w-full rounded-xl border-2 border-[#e8f5ee] bg-white py-2.5 pl-10 pr-4 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <section className="overflow-hidden rounded-2xl border border-[#e8f5ee] bg-white shadow-sm">
        <div className="border-b border-[#e8f5ee] bg-gradient-to-r from-[#f8fbf9] to-[#fff6df]/60 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f5ee] text-[#2d6a4f]"><ActiveIcon className="h-5 w-5" /></div>
            <div>
              <h2 className="font-semibold text-[#1a2a3a]">{active.label}</h2>
              <p className="text-xs text-[#8aa89a]">Backend model: {active.backendModel}</p>
            </div>
          </div>
        </div>
        <div className="flex min-h-[300px] flex-col items-center justify-center px-6 py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff6df]">
            <AlertCircle className="h-7 w-7 text-[#9a782f]" />
          </div>
          <h3 className="mt-5 text-lg font-semibold text-[#1a2a3a]">Master-data API is not exposed yet</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6f8077]">
            The supplied backend contains the {active.backendModel} model, but it does not provide list/create/update/delete API routes for {active.label.toLowerCase()}. Because there is no endpoint to call, mock rows from the revised frontend were removed rather than shown as real data.
          </p>
          <div className="mt-6 grid w-full max-w-2xl gap-3 text-left sm:grid-cols-2">
            <div className="rounded-xl border border-[#e8f5ee] bg-[#f8fbf9] p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[#8aa89a]">Recommended list route</p>
              <code className="mt-2 block text-sm font-semibold text-[#2d6a4f]">GET /api/master-data/{active.id}/</code>
            </div>
            <div className="rounded-xl border border-[#e8f5ee] bg-[#f8fbf9] p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[#8aa89a]">Recommended CRUD route</p>
              <code className="mt-2 block text-sm font-semibold text-[#2d6a4f]">POST/PATCH/DELETE /api/master-data/{active.id}/</code>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default AdminMasterData;
