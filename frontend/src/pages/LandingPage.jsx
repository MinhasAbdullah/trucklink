import React from "react";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Briefcase,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Truck,
  UserCheck,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const roles = [
  {
    title: "Drivers",
    description: "Build a verified driver profile, track moderation status, register truck availability, and review freight matches.",
    icon: Truck,
    to: "/auth?role=driver",
    bullets: ["Create a structured profile", "Register truck availability", "Review calculated matches"],
  },
  {
    title: "Recruiters",
    description: "Create a company profile, post driving jobs and freight loads, and connect with suitable drivers and trucks.",
    icon: Briefcase,
    to: "/auth?role=recruiter",
    bullets: ["Post driving positions", "Create freight loads", "Run truck/load matching"],
  },
  {
    title: "Platform Admins",
    description: "Moderate driver profiles, manage recruiter accounts, monitor analytics, and oversee freight operations.",
    icon: ShieldCheck,
    to: "/auth?role=admin",
    bullets: ["Moderation queue", "Recruiter controls", "Freight operations"],
  },
];

const steps = [
  { icon: Users, title: "Create an account", text: "Join as a driver or recruiter with role-based access." },
  { icon: BadgeCheck, title: "Complete verification", text: "Drivers submit profile details for admin moderation." },
  { icon: UserCheck, title: "Get approved", text: "Admins approve, reject, or request profile changes." },
  { icon: BarChart3, title: "Move hiring forward", text: "Recruiters work with approved candidates and job data." },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen overflow-hidden bg-[#f7f4ea] text-[#1a2a3a]">
      <header className="sticky top-0 z-40 border-b border-[#e6dfca]/80 bg-[#fffdf8]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2d6a4f] to-[#409f7a] shadow-lg shadow-[#2d6a4f]/20">
              <Truck className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xl font-black tracking-tight text-[#1a2a3a]">Truck<span className="text-[#2d6a4f]">Link</span></p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8aa89a]">Driver Hiring Portal</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-semibold text-[#5c7165] md:flex">
            <a href="#how-it-works" className="transition hover:text-[#2d6a4f]">How it works</a>
            <a href="#roles" className="transition hover:text-[#2d6a4f]">Roles</a>
            <Link to="/roles" className="transition hover:text-[#2d6a4f]">Choose role</Link>
          </nav>

          <Link
            to="/auth?role=driver"
            className="inline-flex items-center gap-2 rounded-xl bg-[#2d6a4f] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#23573f]"
          >
            Sign in <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <main>
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0 -z-20 bg-gradient-to-br from-[#fff8e7] via-[#f0f7f4] to-[#dceee5]" />
          <div
            className="absolute inset-0 -z-10 opacity-[0.08]"
            style={{
              backgroundImage: 'url("/images/truck-bg.png")',
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute -left-24 top-24 -z-10 h-72 w-72 rounded-full bg-[#409f7a]/15 blur-3xl" />
          <div className="absolute -right-20 bottom-0 -z-10 h-80 w-80 rounded-full bg-[#f1d99a]/30 blur-3xl" />

          <div className="mx-auto grid min-h-[680px] max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#dce8e2] bg-white/80 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#2d6a4f] shadow-sm backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" /> Verified hiring, clearer workflows
              </div>
              <h1 className="max-w-3xl text-4xl font-black leading-[1.08] tracking-tight text-[#1b3429] sm:text-5xl lg:text-6xl">
                Connect qualified drivers with the recruiters who need them.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-[#5d7468] sm:text-lg">
                TruckLink brings driver onboarding, profile review, recruiter management, freight planning, document uploads, and smart matching into one secure platform.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/roles"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2d6a4f] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#2d6a4f]/20 transition hover:-translate-y-0.5 hover:bg-[#23573f]"
                >
                  Get started <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/auth?role=recruiter"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#d9e5de] bg-white/90 px-6 py-3.5 text-sm font-bold text-[#2d6a4f] shadow-sm transition hover:-translate-y-0.5 hover:border-[#2d6a4f]"
                >
                  Recruiter login
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#61786c]">
                {["Secure role access", "Document uploads", "Live freight matching"].map((item) => (
                  <span key={item} className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#2d6a4f]" /> {item}</span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative"
            >
              <div className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-[#2d6a4f]/15 to-[#f1d99a]/30 blur-2xl" />
              <div className="relative rounded-[2rem] border border-white/80 bg-white/90 p-5 shadow-2xl backdrop-blur-xl sm:p-7">
                <div className="flex items-center justify-between border-b border-[#edf2ee] pb-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8aa89a]">Platform workflow</p>
                    <h2 className="mt-1 text-xl font-bold text-[#1a2a3a]">From signup to verified hiring</h2>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff6df] text-[#85692e]"><ShieldCheck className="h-5 w-5" /></div>
                </div>
                <div className="mt-5 space-y-3">
                  {[
                    ["Driver profile submitted", "Pending", "bg-amber-50 text-amber-700"],
                    ["Admin review completed", "Approved", "bg-emerald-50 text-emerald-700"],
                    ["Recruiter account", "Active", "bg-[#e8f5ee] text-[#2d6a4f]"],
                    ["Job matching pipeline", "Ready", "bg-[#fff6df] text-[#7c622b]"],
                  ].map(([label, status, classes], index) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, x: 18 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 + index * 0.08 }}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-[#edf2ee] bg-[#fbfdfb] p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8f5ee] text-[#2d6a4f]">{index + 1}</div>
                        <span className="text-sm font-semibold text-[#405d4f]">{label}</span>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${classes}`}>{status}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2d6a4f]">How it works</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#1b3429]">A clear workflow for every role</h2>
            <p className="mt-3 text-[#718078]">Each user sees only the tools and data relevant to their role.</p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {steps.map(({ icon: Icon, title, text }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-3xl border border-[#e7dfca] bg-[#fffdf8] p-6 shadow-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e8f5ee] text-[#2d6a4f]"><Icon className="h-5 w-5" /></div>
                <p className="mt-5 text-xs font-bold uppercase tracking-wider text-[#9a8d6d]">Step {index + 1}</p>
                <h3 className="mt-1 text-lg font-bold text-[#1a2a3a]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#6f8077]">{text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="roles" className="border-y border-[#e7dfca] bg-[#fffdf8]">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2d6a4f]">Choose your role</p>
                <h2 className="mt-3 text-3xl font-black tracking-tight text-[#1b3429]">One platform, three focused experiences</h2>
              </div>
              <Link to="/roles" className="inline-flex items-center gap-2 text-sm font-bold text-[#2d6a4f] hover:underline">View role selection <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {roles.map(({ title, description, icon: Icon, to, bullets }) => (
                <div key={title} className="group rounded-3xl border border-[#e7dfca] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f5ee] text-[#2d6a4f] transition group-hover:bg-[#2d6a4f] group-hover:text-white"><Icon className="h-5 w-5" /></div>
                  <h3 className="mt-5 text-xl font-bold text-[#1a2a3a]">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#6f8077]">{description}</p>
                  <div className="mt-5 space-y-2">
                    {bullets.map((bullet) => <div key={bullet} className="flex items-center gap-2 text-sm text-[#52695d]"><CheckCircle2 className="h-4 w-4 text-[#2d6a4f]" /> {bullet}</div>)}
                  </div>
                  <Link to={to} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#2d6a4f]">Continue <ArrowRight className="h-4 w-4" /></Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#214f3a] to-[#2d6a4f] px-6 py-10 text-white shadow-2xl sm:px-10 lg:flex lg:items-center lg:justify-between lg:gap-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#dceee5]">Ready to use TruckLink?</p>
              <h2 className="mt-3 text-3xl font-black">Start with the role that matches your work.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#dceee5]">Drivers, recruiters, and administrators each get a secure experience tailored to their role.</p>
            </div>
            <Link to="/roles" className="mt-6 inline-flex shrink-0 items-center gap-2 rounded-2xl bg-[#fff6df] px-6 py-3.5 text-sm font-bold text-[#29483a] shadow-lg transition hover:-translate-y-0.5 lg:mt-0">Choose a role <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#e7dfca] bg-[#fffdf8]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-7 text-sm text-[#7c8a82] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 font-semibold text-[#4e675a]"><Truck className="h-4 w-4 text-[#2d6a4f]" /> TruckLink</div>
          <p>Driver Hiring & Onboarding Portal</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
