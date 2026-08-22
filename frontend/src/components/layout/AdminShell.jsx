import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  FileText,
  RadioTower,
  LayoutDashboard,
  LogOut,
  Menu,
  Shield,
  Truck,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const menuItems = [
  {
    path: "/admin/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    description: "Platform overview",
  },
  {
    path: "/admin/moderation",
    icon: FileText,
    label: "Moderation Queue",
    description: "Review driver profiles",
  },
  {
    path: "/admin/analytics",
    icon: BarChart3,
    label: "Analytics",
    description: "Platform statistics",
  },
  {
    path: "/admin/recruiters",
    icon: Users,
    label: "Recruiter Accounts",
    description: "Manage accounts",
  },
  {
    path: "/admin/operations",
    icon: RadioTower,
    label: "Freight Operations",
    description: "Loads, trucks & matches",
  },
];

const AdminShell = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const currentPage = useMemo(
    () => menuItems.find((item) => location.pathname.startsWith(item.path)) || menuItems[0],
    [location.pathname]
  );

  const handleLogout = () => {
    logout();
    navigate("/auth?role=admin", { replace: true });
  };

  const closeOnMobile = () => {
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#f7f4ea] via-[#f0f7f4] to-[#dceee5] text-[#1a2a3a]">
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed z-50 flex h-screen w-[280px] flex-col border-r border-[#e8f5ee] bg-white/95 shadow-2xl backdrop-blur-xl lg:relative ${
          sidebarOpen ? "left-0" : "-left-[280px] lg:left-0"
        }`}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#2d6a4f]/5 via-transparent to-[#409f7a]/5" />
        <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-[#2d6a4f] via-[#409f7a] to-[#2d6a4f]" />

        <div className="relative border-b border-[#e8f5ee]/70 p-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#2d6a4f] to-[#409f7a] opacity-50 blur-lg" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#2d6a4f] to-[#409f7a] shadow-lg shadow-[#2d6a4f]/20">
                <Truck className="h-5 w-5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#1a2a3a]">
                Truck<span className="text-[#2d6a4f]">Link</span>
              </h1>
              <p className="text-xs font-medium uppercase tracking-wider text-[#8aa89a]">Admin Panel</p>
            </div>
          </div>
        </div>

        <div className="relative mx-3 mt-3 rounded-2xl border border-[#e8f5ee] bg-gradient-to-r from-[#e8f5ee]/80 to-[#fff6df]/70 px-4 py-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#2d6a4f] to-[#409f7a] shadow-lg shadow-[#2d6a4f]/20">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#2d6a4f]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#1a2a3a]">{user?.username || "Admin"}</p>
              <p className="text-xs text-[#8aa89a]">Platform Administrator</p>
            </div>
          </div>
        </div>

        <nav className="relative flex-1 space-y-1 overflow-y-auto p-4" aria-label="Admin navigation">
          <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#8aa89a]">Main Menu</p>
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04 }}
              >
                <NavLink
                  to={item.path}
                  onClick={closeOnMobile}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 ${
                      isActive
                        ? "bg-[#e8f5ee] text-[#2d6a4f] shadow-sm"
                        : "text-[#4a6a5a] hover:bg-[#fff6df] hover:text-[#2d6a4f]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div
                        className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                          isActive
                            ? "bg-[#2d6a4f] text-white shadow-md shadow-[#2d6a4f]/20"
                            : "bg-[#e8f5ee] text-[#8aa89a] group-hover:bg-[#f5edd8] group-hover:text-[#2d6a4f]"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="relative z-10 min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{item.label}</p>
                        <p className="truncate text-[10px] text-[#8aa89a]">{item.description}</p>
                      </div>
                      {isActive && <div className="relative z-10 h-8 w-1 rounded-full bg-[#2d6a4f]" />}
                    </>
                  )}
                </NavLink>
              </motion.div>
            );
          })}
        </nav>

        <div className="relative border-t border-[#e8f5ee]/70 p-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-xl bg-red-50 px-4 py-3 text-red-600 transition-all hover:bg-red-100"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 transition-all group-hover:bg-red-200">
              <LogOut className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium">Logout</span>
          </motion.button>
        </div>
      </motion.aside>

      <div className="min-h-screen flex-1 lg:min-w-0">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[#e8f5ee] bg-white/85 px-4 py-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSidebarOpen((value) => !value)}
              className="rounded-xl p-2 transition-all hover:bg-[#e8f5ee] lg:hidden"
              aria-label="Toggle admin navigation"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.button>
            <div>
              <h2 className="text-lg font-semibold text-[#1a2a3a]">{currentPage.label}</h2>
              <p className="text-xs text-[#8aa89a]">{currentPage.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e8f5ee]">
              <Shield className="h-4 w-4 text-[#2d6a4f]" />
            </div>
            <span className="hidden text-sm text-[#4a6a5a] sm:block">{user?.username || "Admin"}</span>
          </div>
        </header>

        <main className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      <AnimatePresence>
        {sidebarOpen && isMobile && (
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close admin navigation"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminShell;
