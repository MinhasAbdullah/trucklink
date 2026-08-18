import React from "react";
import { LogOut, ShieldCheck, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AppHeader = ({ title, subtitle, actions }) => {
  const { role, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[#e8dfc5] bg-[#fffdf8]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#2d6a4f] shadow-sm">
            <Truck className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate text-lg font-bold text-[#1c3429]">{title}</p>
              {role === "admin" && (
                <span className="hidden items-center gap-1 rounded-full bg-[#e4f1e9] px-2 py-1 text-[11px] font-semibold text-[#2d6a4f] sm:inline-flex">
                  <ShieldCheck className="h-3 w-3" /> Admin
                </span>
              )}
            </div>
            {subtitle && <p className="truncate text-xs text-[#6f7f76] sm:text-sm">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {actions}
          <div className="hidden text-right sm:block">
            <p className="text-xs font-semibold text-[#355648]">{user?.username || "User"}</p>
            <p className="text-[11px] capitalize text-[#89978f]">{role}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#dce7df] bg-white px-3 text-sm font-semibold text-[#436657] transition hover:border-[#2d6a4f] hover:text-[#2d6a4f]"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
