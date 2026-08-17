import { Search, ChevronDown } from "lucide-react";
import RecruiterSidebar from "@/components/RecruiterSidebar";

const FILTERS = ["CDL Class", "Endorsements", "Equipment", "More Filters"];

const DRIVERS = [
  {
    name: "Ali Hassan",
    location: "Dallas, TX",
    experience: "5 yrs",
    cdl: "A",
    equipment: "Flatbed",
    hiringLocation: "Texas",
    match: 95,
  },
  {
    name: "Ahmed Khan",
    location: "Houston, TX",
    experience: "4 yrs",
    cdl: "A",
    equipment: "Flatbed",
    hiringLocation: "Texas",
    match: 90,
  },
  {
    name: "Bilal Ahmed",
    location: "Austin, TX",
    experience: "3 yrs",
    cdl: "A",
    equipment: "Flatbed",
    hiringLocation: "Texas",
    match: 85,
  },
  {
    name: "John Smith",
    location: "San Antonio, TX",
    experience: "6 yrs",
    cdl: "A",
    equipment: "Flatbed",
    hiringLocation: "Texas",
    match: 80,
  },
  {
    name: "Mike Johnson",
    location: "Dallas, TX",
    experience: "2 yrs",
    cdl: "B",
    equipment: "Dry Van",
    hiringLocation: "Texas",
    match: 75,
  },
];

export default function DriverMatchingPage() {
  return (
    <div className="flex min-h-screen bg-cream">
      <RecruiterSidebar active="matching-drivers" />

      <main className="flex-1 px-8 py-8 lg:px-12">
        <h1 className="text-2xl font-extrabold text-ink">Matching Drivers</h1>
        <p className="mt-1 text-sm text-ink-faint">
          Drivers matching your job requirements
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
            <select className="appearance-none rounded-full border border-border-tan bg-card py-2 pl-9 pr-8 text-sm font-medium text-ink-soft outline-none">
              <option>Experience</option>
              <option>0 – 2 yrs</option>
              <option>3 – 5 yrs</option>
              <option>6+ yrs</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-faint" />
          </div>

          {FILTERS.map((filter) => (
            <div key={filter} className="relative">
              <select className="appearance-none rounded-full border border-border-tan bg-card py-2 pl-4 pr-8 text-sm font-medium text-ink-soft outline-none">
                <option>{filter}</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-faint" />
            </div>
          ))}
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-border-tan bg-card">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border-tan text-xs font-semibold uppercase tracking-wide text-ink-faint">
                <th className="px-5 py-3.5 font-semibold">Driver</th>
                <th className="px-5 py-3.5 font-semibold">Experience</th>
                <th className="px-5 py-3.5 font-semibold">CDL</th>
                <th className="px-5 py-3.5 font-semibold">Equipment</th>
                <th className="px-5 py-3.5 font-semibold">Location</th>
                <th className="px-5 py-3.5 font-semibold">Match</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {DRIVERS.map((driver, i) => (
                <tr
                  key={driver.name}
                  className={i !== DRIVERS.length - 1 ? "border-b border-border-tan" : ""}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="h-9 w-9 shrink-0 rounded-full bg-forest/80" />
                      <div>
                        <p className="font-semibold text-ink">{driver.name}</p>
                        <p className="text-xs text-ink-faint">{driver.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-ink-soft">{driver.experience}</td>
                  <td className="px-5 py-4 text-ink-soft">{driver.cdl}</td>
                  <td className="px-5 py-4 text-ink-soft">{driver.equipment}</td>
                  <td className="px-5 py-4 text-ink-soft">{driver.hiringLocation}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-success-bg px-3 py-1 text-xs font-semibold text-success-text">
                      {driver.match}%
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      className="rounded-full border border-border-tan px-4 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-cream-soft"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
