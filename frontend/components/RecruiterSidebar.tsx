"use client";

import Link from "next/link";
import {
  Truck,
  LayoutDashboard,
  Building2,
  PlusCircle,
  Briefcase,
  Users,
  Star,
  MessageSquare,
  Settings,
  LogOut,
} from "lucide-react";

export type RecruiterNavKey =
  | "dashboard"
  | "company-profile"
  | "post-a-job"
  | "jobs"
  | "matching-drivers"
  | "shortlisted"
  | "messages"
  | "settings";

const NAV_ITEMS: {
  key: RecruiterNavKey;
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  badge?: number;
}[] = [
  { key: "dashboard", label: "Dashboard", href: "/recruiter-dashboard", icon: LayoutDashboard },
  { key: "company-profile", label: "Company Profile", href: "#", icon: Building2 },
  { key: "post-a-job", label: "Post a Job", href: "/post-job", icon: PlusCircle },
  { key: "jobs", label: "Jobs", href: "#", icon: Briefcase },
  { key: "matching-drivers", label: "Matching Drivers", href: "/driver-matching", icon: Users },
  { key: "shortlisted", label: "Shortlisted", href: "#", icon: Star },
  { key: "messages", label: "Messages", href: "#", icon: MessageSquare, badge: 7 },
  { key: "settings", label: "Settings", href: "#", icon: Settings },
];

export default function RecruiterSidebar({ active }: { active: RecruiterNavKey }) {
  return (
    <aside className="flex w-60 shrink-0 flex-col justify-between bg-forest-deep px-4 py-6">
      <div>
        <Link href="/" className="mb-8 flex items-center gap-2 px-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-forest text-cream">
            <Truck className="h-4.5 w-4.5" strokeWidth={2.25} />
          </span>
          <span className="text-base font-bold text-cream">TruckLink</span>
        </Link>

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ key, label, href, icon: Icon, badge }) => {
            const isActive = key === active;
            return (
              <Link
                key={key}
                href={href}
                className={[
                  "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-forest text-cream"
                    : "text-cream/60 hover:bg-white/5 hover:text-cream",
                ].join(" ")}
              >
                <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
                <span className="flex-1">{label}</span>
                {badge ? (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange px-1 text-[11px] font-semibold text-cream">
                    {badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </div>

      <Link
        href="/"
        className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-cream/60 transition-colors hover:bg-white/5 hover:text-cream"
      >
        <LogOut className="h-4 w-4 shrink-0" strokeWidth={2} />
        Logout
      </Link>
    </aside>
  );
}
