import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Truck, User, Clock, CheckCircle, XCircle, AlertCircle,
  Calendar, ArrowLeft, Download, FileText, Eye, MessageSquare,
  History, ChevronRight, Home, RefreshCw, Bell,
  Briefcase, MapPin, DollarSign, ExternalLink, File,
  Check, X, Plus, Filter, Search, ThumbsUp, Award
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DriverStatusTracking = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [downloading, setDownloading] = useState(false);
  const [viewingDoc, setViewingDoc] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Mock status data - In production, this comes from API
  const [profileData, setProfileData] = useState({
    status: "pending", // pending | approved | rejected | in_review
    submittedAt: "2024-01-15T10:30:00",
    lastUpdated: "2024-01-15T14:45:00",
    completion: 85,
    adminComment: "",
    statusHistory: [
      {
        id: 1,
        status: "submitted",
        label: "Profile Submitted",
        description: "Your profile has been submitted for review",
        timestamp: "2024-01-15T10:30:00",
        icon: Clock
      },
      {
        id: 2,
        status: "in_review",
        label: "Under Review",
        description: "Admin team is reviewing your profile and documents",
        timestamp: "2024-01-15T14:45:00",
        icon: RefreshCw
      },
      {
        id: 3,
        status: "pending",
        label: "Pending",
        description: "Profile is pending final approval",
        timestamp: "2024-01-16T09:45:00",
        icon: AlertCircle
      }
    ],
    documents: {
      license: { uploaded: true, verified: true, name: "driver_license.pdf", size: "2.4 MB" },
      medical: { uploaded: true, verified: false, name: "medical_card.pdf", size: "1.8 MB" },
      additional: { uploaded: true, verified: false, name: "certificate.pdf", size: "0.5 MB" }
    },
    opportunities: [
      {
        id: 1,
        title: "Flatbed Driver - Texas",
        company: "ABC Logistics",
        location: "Texas, USA",
        salary: "$1,300 - $1,700 / week",
        type: "Full-Time",
        posted: "2 days ago",
        status: "open"
      },
      {
        id: 2,
        title: "OTR Driver - California",
        company: "Speed Freight",
        location: "California, USA",
        salary: "$1,400 - $1,800 / week",
        type: "Full-Time",
        posted: "3 days ago",
        status: "open"
      },
      {
        id: 3,
        title: "Reefer Driver - Illinois",
        company: "Cool Them Inc.",
        location: "Illinois, USA",
        salary: "$1,300 - $1,600 / week",
        type: "Full-Time",
        posted: "1 day ago",
        status: "open"
      },
      {
        id: 4,
        title: "Local Driver - Chicago",
        company: "City Freight",
        location: "Chicago, IL",
        salary: "$900 - $1,200 / week",
        type: "Part-Time",
        posted: "5 days ago",
        status: "open"
      }
    ]
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
      case "in_review":
        return "yellow";
      case "approved":
        return "green";
      case "rejected":
        return "red";
      default:
        return "gray";
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case "pending":
      case "in_review":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
      case "in_review":
        return Clock;
      case "approved":
        return CheckCircle;
      case "rejected":
        return XCircle;
      default:
        return AlertCircle;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Pending Review";
      case "in_review":
        return "Under Review";
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      default:
        return "Unknown";
    }
  };

  const getStatusDescription = (status) => {
    switch (status) {
      case "pending":
      case "in_review":
        return "Your profile is currently being reviewed by our admin team. We'll notify you once the review is complete.";
      case "approved":
        return "🎉 Congratulations! Your profile has been approved. You are now visible to recruiters.";
      case "rejected":
        return "Your profile has been rejected. Please review the feedback and make necessary changes.";
      default:
        return "";
    }
  };

  const StatusIcon = getStatusIcon(profileData.status);
  const statusColor = getStatusColor(profileData.status);
  const statusBg = getStatusBgColor(profileData.status);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  // 📄 Download Profile - Creates and downloads a PDF-like HTML
  const handleDownloadProfile = () => {
    setDownloading(true);
    
    try {
      const profileHTML = generateProfileHTML();
      const blob = new Blob([profileHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `TruckLink_Profile_${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setTimeout(() => setDownloading(false), 500);
    } catch (error) {
      console.error("Error downloading profile:", error);
      setDownloading(false);
      alert("❌ Failed to download profile. Please try again.");
    }
  };

  // 📄 Generate Profile HTML
  const generateProfileHTML = () => {
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TruckLink - Driver Profile</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Arial, sans-serif;
      background: #f0f7f4;
      padding: 40px;
      color: #1a2a3a;
    }
    .container { 
      max-width: 800px; 
      margin: 0 auto; 
      background: white; 
      border-radius: 24px; 
      padding: 40px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.08);
    }
    .header { 
      text-align: center; 
      border-bottom: 3px solid #2d6a4f; 
      padding-bottom: 30px;
      margin-bottom: 30px;
    }
    .header h1 { 
      font-size: 32px; 
      color: #2d6a4f;
    }
    .header .subtitle { color: #4a6a5a; margin-top: 8px; }
    .section { 
      margin-bottom: 24px; 
      padding: 20px;
      background: #f8fbf9;
      border-radius: 16px;
      border: 1px solid #e8f5ee;
    }
    .section h2 { 
      font-size: 18px; 
      color: #2d6a4f;
      margin-bottom: 16px;
      border-bottom: 2px solid #e8f5ee;
      padding-bottom: 10px;
    }
    .row { 
      display: flex; 
      justify-content: space-between; 
      padding: 8px 0;
      border-bottom: 1px solid #eef4f0;
    }
    .row:last-child { border-bottom: none; }
    .label { color: #4a6a5a; font-weight: 500; }
    .value { color: #1a2a3a; }
    .status-badge {
      display: inline-block;
      padding: 6px 16px;
      border-radius: 20px;
      font-weight: 600;
      background: #e8f5ee;
      color: #2d6a4f;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 2px solid #e8f5ee;
      color: #8aa89a;
      font-size: 12px;
    }
    .doc-item { padding: 6px 0; display: flex; justify-content: space-between; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚛 TruckLink Driver Profile</h1>
      <p class="subtitle">Generated on ${currentDate}</p>
      <p>Status: <span class="status-badge">${getStatusText(profileData.status)}</span></p>
    </div>

    <div class="section">
      <h2>👤 Personal Information</h2>
      <div class="row"><span class="label">Full Name</span><span class="value">${localStorage.getItem('driverName') || 'Not Provided'}</span></div>
      <div class="row"><span class="label">Email</span><span class="value">${localStorage.getItem('driverEmail') || 'Not Provided'}</span></div>
      <div class="row"><span class="label">Phone</span><span class="value">${localStorage.getItem('driverPhone') || 'Not Provided'}</span></div>
      <div class="row"><span class="label">City</span><span class="value">${localStorage.getItem('driverCity') || 'Not Provided'}</span></div>
      <div class="row"><span class="label">State/Region</span><span class="value">${localStorage.getItem('driverRegion') || 'Not Provided'}</span></div>
    </div>

    <div class="section">
      <h2>📜 License & CDL</h2>
      <div class="row"><span class="label">CDL Class</span><span class="value">${localStorage.getItem('driverCDL') || 'Not Provided'}</span></div>
      <div class="row"><span class="label">License Number</span><span class="value">${localStorage.getItem('driverLicenseNumber') || 'Not Provided'}</span></div>
      <div class="row"><span class="label">License Expiry</span><span class="value">${localStorage.getItem('driverLicenseExpiry') || 'Not Provided'}</span></div>
      <div class="row"><span class="label">Endorsements</span><span class="value">${localStorage.getItem('driverEndorsements') || 'None'}</span></div>
    </div>

    <div class="section">
      <h2>💼 Experience</h2>
      <div class="row"><span class="label">Total Experience</span><span class="value">${localStorage.getItem('driverExperience') || '0'} years</span></div>
      <div class="row"><span class="label">Preferred Route</span><span class="value">${localStorage.getItem('driverRoute') || 'Not Specified'}</span></div>
      <div class="row"><span class="label">Equipment</span><span class="value">${localStorage.getItem('driverEquipment') || 'None'}</span></div>
    </div>

    <div class="section">
      <h2>📎 Documents</h2>
      ${Object.entries(profileData.documents).map(([key, doc]) => `
        <div class="doc-item">
          <span>${key.charAt(0).toUpperCase() + key.slice(1)}</span>
          <span>${doc.uploaded ? '✅ Uploaded' : '❌ Not Uploaded'} ${doc.verified ? '✓ Verified' : ''}</span>
        </div>
      `).join('')}
    </div>

    <div class="section">
      <h2>⏱️ Status History</h2>
      ${profileData.statusHistory.map(event => `
        <div class="row">
          <span class="label">${event.label}</span>
          <span class="value">${new Date(event.timestamp).toLocaleString()}</span>
        </div>
      `).join('')}
    </div>

    <div class="footer">
      <p>This is a system-generated profile from TruckLink.</p>
      <p>© ${new Date().getFullYear()} TruckLink. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `;
  };

  // 👁️ View Document
  const handleViewDocument = (docKey) => {
    const doc = profileData.documents[docKey];
    if (!doc || !doc.uploaded) {
      alert("Document not uploaded yet.");
      return;
    }
    setViewingDoc(docKey);
    alert(`📄 Document: ${doc.name}\n📦 Size: ${doc.size}\n✅ Status: ${doc.verified ? 'Verified' : 'Pending Verification'}\n\n(Note: In production, this would open the actual document file)`);
  };

  // 🏆 Apply for Job
  const handleApplyJob = (jobId) => {
    alert(`✅ Application submitted for job #${jobId}!`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Filter opportunities
  const filteredOpportunities = profileData.opportunities.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const isApproved = profileData.status === "approved";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f7f4] via-[#e8f5ee] to-[#d4ede3] p-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4"
        >
          <div>
            <button
              onClick={() => navigate("/driver/dashboard")}
              className="flex items-center gap-2 text-[#4a6a5a] hover:text-[#2d6a4f] transition-colors text-sm mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#1a2a3a] to-[#2d6a4f] bg-clip-text text-transparent">
              Profile Status
            </h1>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-[#4a6a5a] hover:text-[#2d6a4f] shadow-sm hover:shadow transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="text-sm">Refresh</span>
          </button>
        </motion.div>

        {/* Main Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 border-2 ${
            profileData.status === 'approved' ? 'border-green-300' :
            profileData.status === 'rejected' ? 'border-red-300' :
            'border-yellow-300'
          } mb-6`}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Status Icon with Pulse Animation */}
              <div className={`relative w-20 h-20 rounded-full flex items-center justify-center ${
                profileData.status === 'approved' ? 'bg-green-100' :
                profileData.status === 'rejected' ? 'bg-red-100' :
                'bg-yellow-100'
              }`}>
                <StatusIcon className={`w-10 h-10 ${
                  profileData.status === 'approved' ? 'text-green-600' :
                  profileData.status === 'rejected' ? 'text-red-600' :
                  'text-yellow-600'
                }`} />
                {profileData.status === 'pending' && (
                  <span className="absolute inset-0 rounded-full animate-ping bg-yellow-400 opacity-30" />
                )}
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${
                  profileData.status === 'approved' ? 'text-green-700' :
                  profileData.status === 'rejected' ? 'text-red-700' :
                  'text-yellow-700'
                }`}>
                  {getStatusText(profileData.status)}
                </h2>
                <p className="text-sm text-[#4a6a5a]">
                  Last updated: {formatDate(profileData.lastUpdated)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`px-4 py-1.5 rounded-full text-xs font-medium ${statusBg}`}>
                Profile {profileData.completion}% Complete
              </span>
              {profileData.status === 'approved' && (
                <span className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  <Award className="w-3 h-3" />
                  Verified Driver
                </span>
              )}
            </div>
          </div>

          {/* Status Description */}
          <div className={`mt-4 p-4 rounded-xl border ${
            profileData.status === 'approved' ? 'bg-green-50 border-green-200' :
            profileData.status === 'rejected' ? 'bg-red-50 border-red-200' :
            'bg-yellow-50 border-yellow-200'
          }`}>
            <p className={`text-sm flex items-start gap-2 ${
              profileData.status === 'approved' ? 'text-green-700' :
              profileData.status === 'rejected' ? 'text-red-700' :
              'text-yellow-700'
            }`}>
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              {getStatusDescription(profileData.status)}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            {profileData.status === "rejected" && (
              <button className="px-5 py-2.5 bg-[#2d6a4f] text-white rounded-xl font-medium hover:bg-[#1a4a35] transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
            )}
            {profileData.status === "approved" && (
              <button className="px-5 py-2.5 bg-[#2d6a4f] text-white rounded-xl font-medium hover:bg-[#1a4a35] transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                <Eye className="w-4 h-4" />
                View Public Profile
              </button>
            )}
            <button 
              onClick={handleDownloadProfile}
              disabled={downloading}
              className="px-5 py-2.5 border-2 border-[#dce8e2] rounded-xl text-[#4a6a5a] hover:border-[#2d6a4f] hover:text-[#2d6a4f] transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {downloading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#2d6a4f] border-t-transparent" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download Profile
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap border-b border-[#dce8e2] mb-6">
          {['overview', 'history', 'documents', 'opportunities'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium transition-all relative capitalize ${
                activeTab === tab
                  ? "text-[#2d6a4f]"
                  : "text-[#8aa89a] hover:text-[#4a6a5a]"
              }`}
            >
              {tab === 'opportunities' && isApproved ? '💼 Opportunities' : tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="statusTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2d6a4f]"
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* Profile Completion */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/50">
                <h3 className="text-sm font-medium text-[#4a6a5a] mb-4">Profile Completion</h3>
                <div className="relative">
                  <div className="w-full h-3 bg-[#e8f5ee] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${profileData.completion}%` }}
                      transition={{ duration: 1 }}
                      className={`h-full rounded-full ${
                        profileData.completion === 100 ? 'bg-green-500' : 'bg-gradient-to-r from-[#2d6a4f] to-[#409f7a]'
                      }`}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-[#8aa89a]">
                    <span>0%</span>
                    <span className="font-medium text-[#2d6a4f]">{profileData.completion}% Complete</span>
                    <span>100%</span>
                  </div>
                </div>
                <p className="text-sm text-[#4a6a5a] mt-4">
                  {profileData.completion < 100 ? (
                    <>
                      <AlertCircle className="w-4 h-4 inline mr-1 text-yellow-500" />
                      Complete your profile to improve matching chances
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 inline mr-1 text-green-500" />
                      Profile is complete and ready for review
                    </>
                  )}
                </p>
              </div>

              {/* Quick Stats */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/50">
                <h3 className="text-sm font-medium text-[#4a6a5a] mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#4a6a5a]">Profile Status</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBg}`}>
                      {getStatusText(profileData.status)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#4a6a5a]">Submitted On</span>
                    <span className="text-sm text-[#1a2a3a] font-medium">
                      {formatDate(profileData.submittedAt)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#4a6a5a]">Last Updated</span>
                    <span className="text-sm text-[#1a2a3a] font-medium">
                      {formatDate(profileData.lastUpdated)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#4a6a5a]">Documents</span>
                    <span className="text-sm text-[#1a2a3a] font-medium">
                      {Object.values(profileData.documents).filter(d => d.uploaded).length}/3 Uploaded
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/50"
            >
              <h3 className="text-sm font-medium text-[#4a6a5a] mb-4 flex items-center gap-2">
                <History className="w-4 h-4" />
                Status History
              </h3>
              <div className="space-y-4">
                {profileData.statusHistory.map((event, index) => {
                  const Icon = event.icon;
                  const isLast = index === profileData.statusHistory.length - 1;
                  const statusColors = {
                    submitted: 'bg-blue-100 text-blue-600 border-blue-200',
                    in_review: 'bg-yellow-100 text-yellow-600 border-yellow-200',
                    pending: 'bg-yellow-100 text-yellow-600 border-yellow-200',
                    approved: 'bg-green-100 text-green-600 border-green-200',
                    rejected: 'bg-red-100 text-red-600 border-red-200'
                  };
                  const colorClass = statusColors[event.status] || 'bg-gray-100 text-gray-600 border-gray-200';
                  
                  return (
                    <div key={event.id} className="relative pl-8">
                      {!isLast && (
                        <div className="absolute left-3 top-6 bottom-0 w-0.5 bg-[#dce8e2]" />
                      )}
                      <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-2 ${colorClass} flex items-center justify-center`}>
                        <Icon className="w-3 h-3" />
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium text-[#1a2a3a]">
                            {event.label}
                          </p>
                          <p className="text-xs text-[#8aa89a]">
                            {event.description}
                          </p>
                        </div>
                        <span className="text-xs text-[#8aa89a] flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(event.timestamp)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeTab === "documents" && (
            <motion.div
              key="documents"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/50"
            >
              <h3 className="text-sm font-medium text-[#4a6a5a] mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Document Status
              </h3>
              <div className="grid gap-3">
                {Object.entries(profileData.documents).map(([key, value]) => {
                  const label = key.charAt(0).toUpperCase() + key.slice(1);
                  return (
                    <div key={key} className="flex items-center justify-between p-4 bg-[#f8fbf9] rounded-xl border border-[#e8f5ee] hover:border-[#2d6a4f] transition-all">
                      <div className="flex items-center gap-3">
                        {value.uploaded ? (
                          value.verified ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <Clock className="w-5 h-5 text-yellow-500" />
                          )
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-[#1a2a3a]">{label}</p>
                          <p className="text-xs text-[#8aa89a]">
                            {value.uploaded ? `Uploaded ${value.name ? `- ${value.name}` : ''}` : 'Not Uploaded'} 
                            {value.verified && ' ✅ Verified'}
                          </p>
                        </div>
                      </div>
                      {value.uploaded && (
                        <button 
                          onClick={() => handleViewDocument(key)}
                          className="text-xs text-[#2d6a4f] hover:underline flex items-center gap-1 px-3 py-1.5 bg-white rounded-lg border border-[#e8f5ee] hover:border-[#2d6a4f] transition-all"
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeTab === "opportunities" && (
            <motion.div
              key="opportunities"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {isApproved ? (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <h3 className="text-lg font-semibold text-[#1a2a3a] flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-[#2d6a4f]" />
                      Available Opportunities
                    </h3>
                    <span className="text-sm text-[#8aa89a]">{filteredOpportunities.length} jobs found</span>
                  </div>

                  {/* Search and Filter */}
                  <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8aa89a]" />
                      <input
                        type="text"
                        placeholder="Search by job title or company"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border-2 border-[#dce8e2] rounded-xl focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/20 outline-none transition-all"
                      />
                    </div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-4 py-2.5 border-2 border-[#dce8e2] rounded-xl focus:border-[#2d6a4f] outline-none transition-all bg-white"
                    >
                      <option value="all">All Jobs</option>
                      <option value="open">Open</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  {/* Job Listings */}
                  <div className="grid gap-4">
                    {filteredOpportunities.length > 0 ? (
                      filteredOpportunities.map((job) => (
                        <motion.div
                          key={job.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-5 bg-[#f8fbf9] rounded-xl border border-[#e8f5ee] hover:border-[#2d6a4f] hover:shadow-md transition-all"
                        >
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold text-[#1a2a3a]">{job.title}</h4>
                              <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-[#4a6a5a]">
                                <span className="flex items-center gap-1">
                                  <Briefcase className="w-3.5 h-3.5" />
                                  {job.company}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-[#dce8e2]" />
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5" />
                                  {job.location}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-[#dce8e2]" />
                                <span className="flex items-center gap-1 text-[#2d6a4f] font-medium">
                                  <DollarSign className="w-3.5 h-3.5" />
                                  {job.salary}
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-3 mt-2">
                                <span className="text-xs px-2.5 py-1 bg-[#e8f5ee] text-[#2d6a4f] rounded-full">
                                  {job.type}
                                </span>
                                <span className="text-xs text-[#8aa89a]">
                                  Posted {job.posted}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleApplyJob(job.id)}
                              className="px-5 py-2.5 bg-[#2d6a4f] text-white rounded-xl font-medium hover:bg-[#1a4a35] transition-all shadow-md hover:shadow-lg flex items-center gap-2 whitespace-nowrap"
                            >
                              <ThumbsUp className="w-4 h-4" />
                              Apply Now
                            </button>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-[#8aa89a]">
                        <Search className="w-12 h-12 mx-auto mb-3 text-[#dce8e2]" />
                        <p>No jobs found matching your criteria</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-white/50 text-center">
                  <div className="w-20 h-20 bg-[#e8f5ee] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-10 h-10 text-[#2d6a4f]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#1a2a3a] mb-2">Profile Under Review</h3>
                  <p className="text-[#4a6a5a] max-w-md mx-auto">
                    You'll see job opportunities here once your profile is approved by the admin team.
                    <br />
                    <span className="text-sm text-[#8aa89a] mt-2 block">
                      This usually takes 1-2 business days.
                    </span>
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-2 text-sm text-yellow-600">
                    <AlertCircle className="w-4 h-4" />
                    Status: {getStatusText(profileData.status)}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/50"
        >
          <h3 className="text-sm font-medium text-[#4a6a5a] mb-4 flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#2d6a4f]" />
            What Happens Next?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 p-3 bg-[#f8fbf9] rounded-xl">
              <div className="w-8 h-8 rounded-full bg-[#e8f5ee] flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-[#2d6a4f]">1</span>
              </div>
              <div>
                <p className="text-sm font-medium text-[#1a2a3a]">Admin Review</p>
                <p className="text-xs text-[#8aa89a]">Admin team reviews your profile and documents</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-[#f8fbf9] rounded-xl">
              <div className="w-8 h-8 rounded-full bg-[#e8f5ee] flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-[#2d6a4f]">2</span>
              </div>
              <div>
                <p className="text-sm font-medium text-[#1a2a3a]">Get Notified</p>
                <p className="text-xs text-[#8aa89a]">You'll receive notification of the decision</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-[#f8fbf9] rounded-xl">
              <div className="w-8 h-8 rounded-full bg-[#e8f5ee] flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-[#2d6a4f]">3</span>
              </div>
              <div>
                <p className="text-sm font-medium text-[#1a2a3a]">Start Applying</p>
                <p className="text-xs text-[#8aa89a]">Profile becomes visible to recruiters</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Import Edit icon
import { Edit } from "lucide-react";

export default DriverStatusTracking;