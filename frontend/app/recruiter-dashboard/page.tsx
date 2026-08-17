import { Bell } from "lucide-react";
import RecruiterSidebar from "@/components/RecruiterSidebar";

const STATS = [
  { label: "Active Jobs", value: "8" },
  { label: "Total Applic.", value: "156" },
  { label: "Shortlisted", value: "32" },
  { label: "Messages", value: "7" },
];

const RECENT_JOBS = [
  { title: "Flatbed Driver – Texas", applicants: "24 Applicants" },
  { title: "OTR Driver – California", applicants: "31 Applicants" },
  { title: "Reefer Driver – Illinois", applicants: "18 Applicants" },
  { title: "Local Driver – Chicago", applicants: "12 Applicants" },
];

export default function RecruiterDashboardPage() {
  return (
    <div className="flex min-h-screen bg-cream">
      <RecruiterSidebar active="dashboard" />

      <main className="flex-1 px-8 py-8 lg:px-12">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-ink">Welcome, ABC Logistics</h1>
            <p className="mt-1 text-sm text-ink-faint">Here&apos;s your hiring overview</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border-tan bg-card text-ink-soft">
              <Bell className="h-4.5 w-4.5" strokeWidth={2} />
            </span>
            <span className="h-10 w-10 rounded-full bg-forest" />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-border-tan bg-card px-5 py-5"
            >
              <p className="text-xs font-medium text-ink-faint">{stat.label}</p>
              <p className="mt-2 text-3xl font-extrabold text-ink">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-border-tan bg-card px-6 py-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-ink">Recent Jobs</h2>
            <a href="#" className="text-sm font-medium text-sage hover:underline">
              View All Jobs
            </a>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {RECENT_JOBS.map((job) => (
              <div
                key={job.title}
                className="flex items-center justify-between rounded-xl border border-border-tan bg-cream px-5 py-4"
              >
                <div>
                  <p className="text-sm font-semibold text-ink">{job.title}</p>
                  <p className="mt-0.5 text-xs text-ink-faint">{job.applicants}</p>
                </div>
                <span className="rounded-full border border-success-text/30 bg-success-bg px-3 py-1 text-xs font-semibold text-success-text">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
