import React, { useState } from "react";
import { 
  Database, Plus, Edit, Trash2, X, Check,
  Tag, Truck, MapPin, Search, AlertCircle,
  Save, FileText, Shield, Sparkles, Zap,
  ChevronDown, ChevronUp, Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AdminMasterData = () => {
  const [activeTab, setActiveTab] = useState("endorsements");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newItemName, setNewItemName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [endorsements, setEndorsements] = useState([
    { id: 1, name: "Hazmat", createdAt: "2024-01-15", usedBy: 45 },
    { id: 2, name: "Tanker", createdAt: "2024-01-15", usedBy: 38 },
    { id: 3, name: "Doubles/Triples", createdAt: "2024-01-16", usedBy: 22 },
    { id: 4, name: "Heavy Machinery", createdAt: "2024-01-17", usedBy: 19 },
    { id: 5, name: "Oversized Loads", createdAt: "2024-01-18", usedBy: 12 },
    { id: 6, name: "Refrigerated Goods", createdAt: "2024-01-19", usedBy: 31 },
    { id: 7, name: "Cross-Border", createdAt: "2024-01-20", usedBy: 27 },
    { id: 8, name: "Night Driving", createdAt: "2024-01-21", usedBy: 16 }
  ]);

  const [equipment, setEquipment] = useState([
    { id: 1, name: "Dry Van", createdAt: "2024-01-15", usedBy: 67 },
    { id: 2, name: "Reefer", createdAt: "2024-01-15", usedBy: 54 },
    { id: 3, name: "Flatbed", createdAt: "2024-01-16", usedBy: 49 },
    { id: 4, name: "Tanker", createdAt: "2024-01-17", usedBy: 33 },
    { id: 5, name: "Hopper", createdAt: "2024-01-18", usedBy: 18 },
    { id: 6, name: "Lowboy", createdAt: "2024-01-19", usedBy: 14 },
    { id: 7, name: "Step Deck", createdAt: "2024-01-20", usedBy: 21 },
    { id: 8, name: "Container", createdAt: "2024-01-21", usedBy: 29 }
  ]);

  const [regions, setRegions] = useState([
    { id: 1, name: "Punjab", createdAt: "2024-01-15", usedBy: 234 },
    { id: 2, name: "Sindh", createdAt: "2024-01-15", usedBy: 187 },
    { id: 3, name: "KPK", createdAt: "2024-01-16", usedBy: 156 },
    { id: 4, name: "Balochistan", createdAt: "2024-01-17", usedBy: 98 },
    { id: 5, name: "Gilgit-Baltistan", createdAt: "2024-01-18", usedBy: 45 },
    { id: 6, name: "AJK", createdAt: "2024-01-19", usedBy: 67 },
    { id: 7, name: "Islamabad", createdAt: "2024-01-20", usedBy: 123 }
  ]);

  const tabs = [
    { id: "endorsements", label: "Endorsements", icon: Tag, count: endorsements.length },
    { id: "equipment", label: "Equipment", icon: Truck, count: equipment.length },
    { id: "regions", label: "Regions", icon: MapPin, count: regions.length }
  ];

  const getCurrentData = () => {
    switch (activeTab) {
      case "endorsements": return endorsements;
      case "equipment": return equipment;
      case "regions": return regions;
      default: return [];
    }
  };

  const setCurrentData = (newData) => {
    switch (activeTab) {
      case "endorsements": setEndorsements(newData); break;
      case "equipment": setEquipment(newData); break;
      case "regions": setRegions(newData); break;
      default: break;
    }
  };

  const getTabLabel = () => {
    switch (activeTab) {
      case "endorsements": return "Endorsement";
      case "equipment": return "Equipment";
      case "regions": return "Region";
      default: return "Item";
    }
  };

  const getIcon = () => {
    switch (activeTab) {
      case "endorsements": return <Tag className="w-5 h-5 text-[#2d6a4f]" />;
      case "equipment": return <Truck className="w-5 h-5 text-[#2d6a4f]" />;
      case "regions": return <MapPin className="w-5 h-5 text-[#2d6a4f]" />;
      default: return <Database className="w-5 h-5 text-[#2d6a4f]" />;
    }
  };

  const handleAdd = () => {
    if (newItemName.trim()) {
      const currentData = getCurrentData();
      const newItem = {
        id: currentData.length + 1,
        name: newItemName.trim(),
        createdAt: new Date().toISOString().split('T')[0],
        usedBy: 0
      };
      setCurrentData([...currentData, newItem]);
      setNewItemName("");
      setShowModal(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setNewItemName(item.name);
    setShowModal(true);
  };

  const handleUpdate = () => {
    if (newItemName.trim() && editingItem) {
      const currentData = getCurrentData();
      const updatedData = currentData.map(item => 
        item.id === editingItem.id ? { ...item, name: newItemName.trim() } : item
      );
      setCurrentData(updatedData);
      setEditingItem(null);
      setNewItemName("");
      setShowModal(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete this ${getTabLabel()}?`)) {
      const currentData = getCurrentData();
      setCurrentData(currentData.filter(item => item.id !== id));
    }
  };

  const filteredData = getCurrentData().filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = getCurrentData().length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a2a3a] flex items-center gap-2">
            <Database className="w-6 h-6 text-[#2d6a4f]" />
            Master Data Management
          </h1>
          <p className="text-sm text-[#8aa89a]">Manage endorsements, equipment types, and regions</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#2d6a4f] text-white rounded-xl text-sm font-medium hover:bg-[#1a4a35] transition-all shadow-md hover:shadow-lg">
          <Sparkles className="w-4 h-4" />
          Sync Data
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 bg-white/80 backdrop-blur-sm rounded-2xl p-1.5 border border-[#e8f5ee] shadow-sm">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#2d6a4f] text-white shadow-md'
                  : 'text-[#4a6a5a] hover:bg-[#e8f5ee]'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                isActive ? 'bg-white/20 text-white' : 'bg-[#e8f5ee] text-[#4a6a5a]'
              }`}>
                {tab.count}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8aa89a]" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-[#e8f5ee] rounded-xl focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/20 outline-none transition-all"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setEditingItem(null);
            setNewItemName("");
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#2d6a4f] text-white rounded-xl font-medium hover:bg-[#1a4a35] transition-all shadow-md hover:shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Add New {getTabLabel()}
        </motion.button>
      </div>

      {/* Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#e8f5ee] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-[#f8fbf9] to-[#e8f5ee]">
                <th className="px-6 py-4 text-left text-xs font-medium text-[#8aa89a] uppercase tracking-wider">#</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#8aa89a] uppercase tracking-wider">
                  {getTabLabel()} Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#8aa89a] uppercase tracking-wider">Created</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#8aa89a] uppercase tracking-wider">Used By</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-[#8aa89a] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8f5ee]">
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.02 }}
                    whileHover={{ backgroundColor: 'rgba(45,106,79,0.03)' }}
                    className="transition-all"
                  >
                    <td className="px-6 py-4 text-sm text-[#8aa89a] font-medium">{item.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#e8f5ee] flex items-center justify-center">
                          {getIcon()}
                        </div>
                        <span className="text-sm font-medium text-[#1a2a3a]">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#8aa89a]">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-[#8aa89a]" />
                        {item.createdAt}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#8aa89a]">
                      <span className="px-2.5 py-1 bg-[#e8f5ee] text-[#2d6a4f] rounded-lg text-xs font-medium">
                        {item.usedBy} drivers
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEdit(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="w-12 h-12 text-[#dce8e2]" />
                      <p className="text-[#8aa89a] font-medium">No {activeTab} found</p>
                      <p className="text-sm text-[#8aa89a]">Click "Add New" to create one</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowModal(false);
              setEditingItem(null);
              setNewItemName("");
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-[#e8f5ee]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-[#1a2a3a]">
                    {editingItem ? `Edit ${getTabLabel()}` : `Add New ${getTabLabel()}`}
                  </h3>
                  <p className="text-sm text-[#8aa89a]">
                    {editingItem ? 'Update the existing entry' : 'Create a new entry'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingItem(null);
                    setNewItemName("");
                  }}
                  className="p-2 hover:bg-[#e8f5ee] rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-[#8aa89a]" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#4a6a5a] mb-1.5">
                    {getTabLabel()} Name
                  </label>
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder={`Enter ${getTabLabel().toLowerCase()} name`}
                    className="w-full border-2 border-[#e8f5ee] rounded-xl px-4 py-2.5 focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/20 outline-none transition-all"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        editingItem ? handleUpdate() : handleAdd();
                      }
                    }}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditingItem(null);
                      setNewItemName("");
                    }}
                    className="flex-1 px-4 py-2.5 border-2 border-[#e8f5ee] rounded-xl text-[#4a6a5a] hover:bg-[#f8fbf9] transition-all"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={editingItem ? handleUpdate : handleAdd}
                    className="flex-1 px-4 py-2.5 bg-[#2d6a4f] text-white rounded-xl font-medium hover:bg-[#1a4a35] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {editingItem ? 'Update' : 'Add'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminMasterData;