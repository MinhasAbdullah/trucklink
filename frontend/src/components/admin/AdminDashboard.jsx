import React, { useState, useEffect } from "react";
import { useNavigate, Outlet, NavLink, useLocation } from "react-router-dom";
import { 
  Truck, LayoutDashboard, Users, FileText, 
  Settings, LogOut, Shield, BarChart3, 
  Database, Clock, Menu, X, ChevronDown, 
  Bell, Search, UserCircle, Sparkles, 
  Zap, Activity, HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [adminName] = useState("Admin");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { 
      path: "/admin/analytics", 
      icon: BarChart3, 
      label: "Analytics",
      description: "Platform statistics"
    },
    { 
      path: "/admin/recruiters",
      icon: Users,
      label: "Recruiters",
      description: "Manage accounts"
    },
    { 
      path: "/admin/moderation", 
      icon: FileText, 
      label: "Moderation",
      description: "Review profiles"
    },
    { 
      path: "/admin/master-data", 
      icon: Database, 
      label: "Master Data",
      description: "Manage data"
    }
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth");
  };

  const getPageTitle = () => {
    const current = menuItems.find(item => location.pathname.includes(item.path));
    return current ? current.label : "Dashboard";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f7f4] via-[#e8f5ee] to-[#d4ede3] flex">
      
      {/* ============================================
           SIDEBAR - Green Theme Glass Effect
           ========================================== */}
      <motion.aside 
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed lg:relative z-50 w-[280px] h-screen bg-white/90 backdrop-blur-xl border-r border-[#e8f5ee] shadow-2xl flex flex-col ${
          sidebarOpen ? 'left-0' : '-left-[280px] lg:left-0'
        }`}
      >
        {/* Animated Gradient Border */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2d6a4f]/5 via-transparent to-[#409f7a]/5 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2d6a4f] via-[#409f7a] to-[#2d6a4f]" />

        {/* Logo */}
        <div className="relative p-6 border-b border-[#e8f5ee]/50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#2d6a4f] to-[#409f7a] rounded-xl blur-lg opacity-60" />
              <div className="relative w-10 h-10 bg-gradient-to-br from-[#2d6a4f] to-[#409f7a] rounded-xl flex items-center justify-center shadow-lg shadow-[#2d6a4f]/20">
                <Truck className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#1a2a3a]">
                Truck<span className="text-[#2d6a4f]">Link</span>
              </h1>
              <p className="text-xs text-[#8aa89a] font-medium tracking-wider uppercase">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Admin Profile */}
        <div className="relative px-4 py-4 mx-3 mt-3 bg-gradient-to-r from-[#e8f5ee]/80 to-[#d4ede3]/80 rounded-2xl border border-[#e8f5ee] shadow-sm">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#2d6a4f] to-[#409f7a] flex items-center justify-center shadow-lg shadow-[#2d6a4f]/20">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#2d6a4f] border-2 border-white rounded-full" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#1a2a3a]">{adminName}</p>
              <p className="text-xs text-[#8aa89a]">Administrator</p>
            </div>
            
          </div>
        </div>

        {/* Navigation */}
        <nav className="relative flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="text-[10px] font-bold text-[#8aa89a] uppercase tracking-wider px-3 py-2">Main Menu</p>
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname.includes(item.path);
            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                      isActive
                        ? "bg-[#e8f5ee] text-[#2d6a4f] shadow-sm"
                        : "text-[#4a6a5a] hover:bg-[#e8f5ee]/50 hover:text-[#2d6a4f]"
                    }`
                  }
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-xl bg-[#e8f5ee]"
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}
                  <div className={`relative z-10 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                    isActive 
                      ? 'bg-[#2d6a4f] text-white shadow-md shadow-[#2d6a4f]/20' 
                      : 'bg-[#e8f5ee] text-[#8aa89a] group-hover:bg-[#d4ede3] group-hover:text-[#2d6a4f]'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="relative z-10 flex-1">
                    <p className={`text-sm font-medium transition-colors ${
                      isActive ? 'text-[#2d6a4f]' : 'group-hover:text-[#2d6a4f]'
                    }`}>
                      {item.label}
                    </p>
                    <p className="text-[10px] text-[#8aa89a]">{item.description}</p>
                  </div>
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="relative z-10 w-1 h-8 bg-[#2d6a4f] rounded-full"
                    />
                  )}
                </NavLink>
              </motion.div>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="relative p-4 border-t border-[#e8f5ee]/50">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-all">
              <LogOut className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">Logout</span>
          </motion.button>
        </div>
      </motion.aside>

      {/* ============================================
           MAIN CONTENT
           ========================================== */}
      <div className="flex-1 min-h-screen">
        {/* Top Bar - Search Removed */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#e8f5ee] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-[#e8f5ee] transition-all"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
            <div>
              <h2 className="text-lg font-semibold text-[#1a2a3a]">{getPageTitle()}</h2>
              <p className="text-xs text-[#8aa89a]">Admin Dashboard</p>
            </div>
          </div>
          
       
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#e8f5ee] flex items-center justify-center">
              <Shield className="w-4 h-4 text-[#2d6a4f]" />
            </div>
            <span className="text-sm text-[#4a6a5a] hidden sm:block">Admin</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;