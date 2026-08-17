import Image from "next/image";
import Link from "next/link";
import { Truck, ShieldCheck, Target, FileCheck2, Clock } from "lucide-react";

const NAV_LINKS = ["How it Works", "Features", "Pricing", "Contact"];

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Verified Drivers",
    description: "All drivers are reviewed and verified by our admin team.",
  },
  {
    icon: Target,
    title: "Smart Matching",
    description: "Find the perfect match based on your requirements.",
  },
  {
    icon: FileCheck2,
    title: "Secure Documents",
    description: "Your data and documents are safe with us.",
  },
  {
    icon: Clock,
    title: "Faster Hiring",
    description: "Reduce hiring time and get drivers on the road.",
  },
];

const STATS = [
  { value: "12K+", label: "Verified Drivers" },
  { value: "1.5K+", label: "Active Recruiters" },
  { value: "8K+", label: "Jobs Posted" },
  { value: "98%", label: "Success Rate" },
];

export default function LandingPage() {
  return (
    <div className="bg-cream">
      {/* ── Nav ── */}
      <header className="border-b border-border-tan">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-forest text-cream">
              <Truck className="h-4.5 w-4.5" strokeWidth={2.25} />
            </span>
            <span className="text-lg font-bold text-ink">TruckLink</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link href="/" className="border-b-2 border-forest pb-0.5 text-sm font-medium text-ink">
              Home
            </Link>
            {NAV_LINKS.map((link) => (
              <Link
                key={link}
                href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
              >
                {link}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="#"
              className="rounded-full border border-border-tan px-5 py-2 text-sm font-semibold text-ink transition-colors hover:bg-cream-soft"
            >
              Log In
            </Link>
            <Link
              href="#"
              className="rounded-full bg-forest px-5 py-2 text-sm font-semibold text-cream transition-opacity hover:opacity-90"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section className="mx-auto max-w-7xl px-6 pb-14 pt-14 lg:px-10 lg:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
              The Road to
              <br />
              Better <span className="text-sage">Opportunities</span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-ink-soft">
              Connecting verified drivers with trusted recruiters. Faster
              hiring for a stronger trucking industry.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="#"
                className="rounded-full bg-forest px-6 py-3 text-sm font-semibold text-cream transition-opacity hover:opacity-90"
              >
                I&apos;m a Driver
              </Link>
              <Link
                href="#"
                className="rounded-full border border-border-tan px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-cream-soft"
              >
                I&apos;m a Recruiter
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl lg:aspect-[16/11]">
            <Image
              src="https://images.unsplash.com/photo-1779583074717-e60fa13131ce?auto=format&fit=crop&q=80&w=1400"
              alt="Green semi-truck driving on a highway through the mountains"
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
        </div>

        {/* ── Feature cards ── */}
        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-2xl border border-border-tan bg-card px-5 py-6"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cream-soft text-forest">
                <Icon className="h-5 w-5" strokeWidth={2} />
              </span>
              <h3 className="mt-4 text-sm font-semibold text-ink">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-faint">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="bg-forest-deep">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-10 text-center sm:grid-cols-4 lg:px-10">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl font-extrabold text-cream sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-cream/60 sm:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
