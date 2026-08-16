import React, { useState } from "react";
import { 
  Users, UserCheck, UserX, Search, Filter,
  CheckCircle, XCircle, Clock, Eye, Edit,
  Shield, Briefcase, Mail, Phone, MapPin,
  Building2, Calendar, ArrowUpDown, Download,
  AlertCircle, Check, X, Plus, Trash2,
  RefreshCw, MoreVertical, ChevronDown,
  Star, Award, TrendingUp, BarChart3,
  Globe, FileSpreadsheet,
  Printer, Copy, Share2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AdminRecruiters = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [newRecruiter, setNewRecruiter] = useState({
    companyName: "",
    email: "",
    phone: "",
    location: "",
    description: ""
  });

  // ✅ Pakistan-Based Recruiters Data
  const [recruiters, setRecruiters] = useState([
    {
      id: 1,
      companyName: "Karachi Logistics (Pvt) Ltd.",
      email: "info@karachilogistics.pk",
      phone: "+92 321 1234567",
      location: "Karachi, Sindh",
      status: "approved",
      joinedDate: "2024-01-15",
      driversHired: 28,
      jobsPosted: 15,
      activeJobs: 8,
      rating: 4.8,
      description: "Leading logistics company in Karachi specializing in container transport and freight forwarding across Pakistan.",
      website: "www.karachilogistics.pk",
      employees: 120,
      city: "Karachi",
      province: "Sindh"
    },
    {
      id: 2,
      companyName: "Lahore Transport Services",
      email: "careers@lahoretransport.com",
      phone: "+92 322 2345678",
      location: "Lahore, Punjab",
      status: "pending",
      joinedDate: "2024-02-20",
      driversHired: 5,
      jobsPosted: 3,
      activeJobs: 2,
      rating: 0,
      description: "Lahore-based transport company providing inter-city and inter-province cargo services.",
      website: "www.lahoretransport.com",
      employees: 35,
      city: "Lahore",
      province: "Punjab"
    },
    {
      id: 3,
      companyName: "Peshawar Freight Lines",
      email: "hr@peshawarfreight.pk",
      phone: "+92 323 3456789",
      location: "Peshawar, KPK",
      status: "suspended",
      joinedDate: "2024-01-10",
      driversHired: 12,
      jobsPosted: 7,
      activeJobs: 0,
      rating: 3.2,
      description: "Freight and cargo services connecting KPK with major cities across Pakistan.",
      website: "www.peshawarfreight.pk",
      employees: 45,
      city: "Peshawar",
      province: "KPK"
    },
    {
      id: 4,
      companyName: "Islamabad Courier & Cargo",
      email: "jobs@islamabadcargo.com",
      phone: "+92 324 4567890",
      location: "Islamabad",
      status: "approved",
      joinedDate: "2024-01-18",
      driversHired: 18,
      jobsPosted: 10,
      activeJobs: 5,
      rating: 4.5,
      description: "Islamabad-based courier and cargo services with nationwide delivery network.",
      website: "www.islamabadcargo.com",
      employees: 65,
      city: "Islamabad",
      province: "Islamabad"
    },
    {
      id: 5,
      companyName: "Quetta Trucking Company",
      email: "info@quettatrucking.pk",
      phone: "+92 325 5678901",
      location: "Quetta, Balochistan",
      status: "pending",
      joinedDate: "2024-02-22",
      driversHired: 3,
      jobsPosted: 2,
      activeJobs: 1,
      rating: 0,
      description: "Trucking company serving Balochistan and connecting with other provinces.",
      website: "www.quettatrucking.pk",
      employees: 18,
      city: "Quetta",
      province: "Balochistan"
    },
    {
      id: 6,
      companyName: "Sialkot Transport Corporation",
      email: "careers@sialkottransport.com",
      phone: "+92 326 6789012",
      location: "Sialkot, Punjab",
      status: "approved",
      joinedDate: "2024-02-25",
      driversHired: 10,
      jobsPosted: 6,
      activeJobs: 4,
      rating: 4.9,
      description: "Leading transport company in Sialkot specializing in export-import cargo handling.",
      website: "www.sialkottransport.com",
      employees: 40,
      city: "Sialkot",
      province: "Punjab"
    },
    {
      id: 7,
      companyName: "Gwadar Port Logistics",
      email: "info@gwadarport.pk",
      phone: "+92 327 7890123",
      location: "Gwadar, Balochistan",
      status: "approved",
      joinedDate: "2024-03-01",
      driversHired: 8,
      jobsPosted: 5,
      activeJobs: 3,
      rating: 4.2,
      description: "Specialized logistics services for Gwadar Port and CPEC-related projects.",
      website: "www.gwadarport.pk",
      employees: 30,
      city: "Gwadar",
      province: "Balochistan"
    },
    {
      id: 8,
      companyName: "Hyderabad Freight Solutions",
      email: "hr@hyderabadfreight.com",
      phone: "+92 328 8901234",
      location: "Hyderabad, Sindh",
      status: "pending",
      joinedDate: "2024-03-05",
      driversHired: 2,
      jobsPosted: 1,
      activeJobs: 1,
      rating: 0,
      description: "Emerging freight solutions provider in Hyderabad with growing fleet.",
      website: "www.hyderabadfreight.com",
      employees: 12,
      city: "Hyderabad",
      province: "Sindh"
    }
  ]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return { 
          label: "Approved", 
          className: "bg-emerald-50 text-emerald-700 border-emerald-200", 
          icon: CheckCircle,
          dotColor: "bg-emerald-500"
        };
      case "pending":
        return { 
          label: "Pending", 
          className: "bg-yellow-50 text-yellow-700 border-yellow-200", 
          icon: Clock,
          dotColor: "bg-yellow-500"
        };
      case "suspended":
        return { 
          label: "Suspended", 
          className: "bg-red-50 text-red-700 border-red-200", 
          icon: XCircle,
          dotColor: "bg-red-500"
        };
      default:
        return { 
          label: "Unknown", 
          className: "bg-gray-50 text-gray-700 border-gray-200", 
          icon: AlertCircle,
          dotColor: "bg-gray-500"
        };
    }
  };

  const handleStatusChange = (id, newStatus) => {
    if (window.confirm(`Are you sure you want to ${newStatus} this recruiter?`)) {
      setRecruiters(prev => 
        prev.map(r => r.id === id ? { ...r, status: newStatus } : r)
      );
      alert(`Recruiter ${newStatus} successfully!`);
      setShowDetails(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this recruiter account?")) {
      setRecruiters(prev => prev.filter(r => r.id !== id));
      alert("Recruiter deleted successfully!");
      setShowDetails(false);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Data refreshed successfully!");
    }, 1500);
  };

  const handleAddRecruiter = () => {
    if (!newRecruiter.companyName || !newRecruiter.email) {
      alert("Please fill in company name and email");
      return;
    }
    
    const newId = recruiters.length + 1;
    const recruiter = {
      id: newId,
      ...newRecruiter,
      status: "pending",
      joinedDate: new Date().toISOString().split('T')[0],
      driversHired: 0,
      jobsPosted: 0,
      activeJobs: 0,
      rating: 0,
      employees: 0,
      website: "www.example.com"
    };
    
    setRecruiters([...recruiters, recruiter]);
    setShowAddModal(false);
    setNewRecruiter({
      companyName: "",
      email: "",
      phone: "",
      location: "",
      description: ""
    });
    alert("New recruiter added successfully!");
  };

  // ✅ EXPORT FUNCTIONALITY - Only CSV
  const handleExportCSV = () => {
    setExportLoading(true);
    setShowExportOptions(false);
    
    setTimeout(() => {
      const exportData = filteredRecruiters.map(r => ({
        ID: r.id,
        Company: r.companyName,
        Email: r.email,
        Phone: r.phone,
        City: r.city || r.location,
        Province: r.province || '',
        Status: r.status,
        'Drivers Hired': r.driversHired,
        'Jobs Posted': r.jobsPosted,
        'Active Jobs': r.activeJobs,
        Rating: r.rating || 'N/A',
        'Joined Date': r.joinedDate,
        Website: r.website,
        Employees: r.employees
      }));

      // CSV Export
      const headers = Object.keys(exportData[0] || {});
      const csvRows = [];
      csvRows.push(headers.join(','));
      exportData.forEach(row => {
        const values = headers.map(header => {
          const val = row[header] || '';
          return `"${String(val).replace(/"/g, '""')}"`;
        });
        csvRows.push(values.join(','));
      });
      const csvString = csvRows.join('\n');
      const blob = new Blob([csvString], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `recruiters_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      alert(`✅ ${exportData.length} recruiters exported as CSV!`);
      
      setExportLoading(false);
    }, 500);
  };

  const filteredRecruiters = recruiters.filter(r => {
    const matchesSearch = r.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.province?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || r.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: recruiters.length,
    approved: recruiters.filter(r => r.status === "approved").length,
    pending: recruiters.filter(r => r.status === "pending").length,
    suspended: recruiters.filter(r => r.status === "suspended").length
  };

  const StatCard = ({ icon: Icon, label, value, bgColor }) => (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl ${bgColor} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-600" />
            Manage Recruiters
          </h1>
          <p className="text-sm text-gray-500">View and manage all recruiter accounts across Pakistan</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-emerald-600 transition-all shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="text-sm">Refresh</span>
          </button>
          
          {/* ✅ Export CSV Button */}
          <button
            onClick={handleExportCSV}
            disabled={exportLoading || filteredRecruiters.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all shadow-sm disabled:opacity-50"
          >
            {exportLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-600 border-t-transparent" />
            ) : (
              <>
                <FileSpreadsheet className="w-4 h-4 text-green-600" />
                <span className="text-sm">Export CSV</span>
              </>
            )}
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Add Recruiter
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          icon={Users} 
          label="Total Recruiters" 
          value={stats.total} 
          bgColor="bg-blue-500"
        />
        <StatCard 
          icon={CheckCircle} 
          label="Approved" 
          value={stats.approved} 
          bgColor="bg-emerald-600"
        />
        <StatCard 
          icon={Clock} 
          label="Pending" 
          value={stats.pending} 
          bgColor="bg-yellow-500"
        />
        <StatCard 
          icon={XCircle} 
          label="Suspended" 
          value={stats.suspended} 
          bgColor="bg-red-500"
        />
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by company, city, province, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-emerald-500 outline-none transition-all bg-white"
        >
          <option value="all">All Status</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="suspended">Suspended</option>
        </select>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterStatus("all");
            }}
            className="px-4 py-2.5 border-2 border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Recruiters Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hired</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRecruiters.length > 0 ? (
                filteredRecruiters.map((recruiter, index) => {
                  const statusBadge = getStatusBadge(recruiter.status);
                  const StatusIcon = statusBadge.icon;
                  return (
                    <motion.tr
                      key={recruiter.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                      whileHover={{ backgroundColor: 'rgba(45,106,79,0.03)' }}
                      className="transition-all cursor-pointer"
                      onClick={() => {
                        setSelectedRecruiter(recruiter);
                        setShowDetails(true);
                      }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{recruiter.companyName}</p>
                            <p className="text-xs text-gray-400">ID: #{String(recruiter.id).padStart(4, '0')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          {recruiter.city || recruiter.location}
                        </span>
                        <p className="text-xs text-gray-400">{recruiter.province || ''}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-800">{recruiter.email}</p>
                        <p className="text-xs text-gray-400">{recruiter.phone}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${statusBadge.className}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dotColor}`} />
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{recruiter.driversHired}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {recruiter.status === "pending" && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(recruiter.id, "approved");
                              }}
                              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </motion.button>
                          )}
                          {recruiter.status === "approved" && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(recruiter.id, "suspended");
                              }}
                              className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all"
                              title="Suspend"
                            >
                              <XCircle className="w-4 h-4" />
                            </motion.button>
                          )}
                          {recruiter.status === "suspended" && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(recruiter.id, "approved");
                              }}
                              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                              title="Reactivate"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </motion.button>
                          )}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRecruiter(recruiter);
                              setShowDetails(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="w-12 h-12 text-gray-200" />
                      <p className="text-gray-500 font-medium">No recruiters found</p>
                      <p className="text-sm text-gray-400">Try adjusting your search or filter</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-3 border-t border-gray-100 flex justify-between items-center flex-wrap gap-2">
          <span className="text-sm text-gray-500">
            Showing {filteredRecruiters.length} of {recruiters.length} recruiters
          </span>
          <button
            onClick={handleExportCSV}
            disabled={filteredRecruiters.length === 0}
            className="text-sm text-emerald-600 hover:underline flex items-center gap-1 disabled:opacity-50"
          >
            <Download className="w-3 h-3" />
            Export all as CSV
          </button>
        </div>
      </div>

      {/* Recruiter Details Modal */}
      <AnimatePresence>
        {showDetails && selectedRecruiter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10 rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{selectedRecruiter.companyName}</h3>
                    <p className="text-sm text-gray-500">Recruiter Details</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Status:</span>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusBadge(selectedRecruiter.status).className}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${getStatusBadge(selectedRecruiter.status).dotColor}`} />
                    {getStatusBadge(selectedRecruiter.status).label}
                  </span>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-800 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {selectedRecruiter.email}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-medium text-gray-800 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {selectedRecruiter.phone}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500">City</p>
                    <p className="text-sm font-medium text-gray-800 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {selectedRecruiter.city || selectedRecruiter.location}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500">Province</p>
                    <p className="text-sm font-medium text-gray-800">{selectedRecruiter.province || 'N/A'}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500">Joined Date</p>
                    <p className="text-sm font-medium text-gray-800 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {selectedRecruiter.joinedDate}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500">Drivers Hired</p>
                    <p className="text-sm font-medium text-gray-800">{selectedRecruiter.driversHired}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500">Jobs Posted</p>
                    <p className="text-sm font-medium text-gray-800">{selectedRecruiter.jobsPosted}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500">Active Jobs</p>
                    <p className="text-sm font-medium text-gray-800">{selectedRecruiter.activeJobs}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500">Employees</p>
                    <p className="text-sm font-medium text-gray-800">{selectedRecruiter.employees}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500">Website</p>
                    <p className="text-sm font-medium text-gray-800">{selectedRecruiter.website}</p>
                  </div>
                </div>

                {/* Description */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500">Description</p>
                  <p className="text-sm text-gray-600 mt-1">{selectedRecruiter.description}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-2">
                  {selectedRecruiter.status === "pending" && (
                    <button
                      onClick={() => handleStatusChange(selectedRecruiter.id, "approved")}
                      className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve Recruiter
                    </button>
                  )}
                  {selectedRecruiter.status === "approved" && (
                    <button
                      onClick={() => handleStatusChange(selectedRecruiter.id, "suspended")}
                      className="flex-1 px-4 py-2.5 bg-yellow-500 text-white rounded-xl font-medium hover:bg-yellow-600 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    >
                      <XCircle className="w-4 h-4" />
                      Suspend Recruiter
                    </button>
                  )}
                  {selectedRecruiter.status === "suspended" && (
                    <button
                      onClick={() => handleStatusChange(selectedRecruiter.id, "approved")}
                      className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Reactivate
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(selectedRecruiter.id)}
                    className="flex-1 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                  </button>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Recruiter Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Add New Recruiter</h3>
                  <p className="text-sm text-gray-500">Create a new recruiter account</p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Company Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Karachi Logistics"
                    value={newRecruiter.companyName}
                    onChange={(e) => setNewRecruiter({...newRecruiter, companyName: e.target.value})}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Email *</label>
                  <input
                    type="email"
                    placeholder="info@company.com"
                    value={newRecruiter.email}
                    onChange={(e) => setNewRecruiter({...newRecruiter, email: e.target.value})}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Phone</label>
                  <input
                    type="text"
                    placeholder="+92 300 1234567"
                    value={newRecruiter.phone}
                    onChange={(e) => setNewRecruiter({...newRecruiter, phone: e.target.value})}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">City</label>
                  <input
                    type="text"
                    placeholder="e.g. Lahore, Karachi"
                    value={newRecruiter.location}
                    onChange={(e) => setNewRecruiter({...newRecruiter, location: e.target.value})}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Description</label>
                  <textarea
                    rows="2"
                    placeholder="Brief description about the company..."
                    value={newRecruiter.description}
                    onChange={(e) => setNewRecruiter({...newRecruiter, description: e.target.value})}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddRecruiter}
                    className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                    Add Recruiter
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminRecruiters;