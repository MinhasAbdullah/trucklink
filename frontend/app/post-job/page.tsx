"use client";

import { useState } from "react";
import RecruiterSidebar from "@/components/RecruiterSidebar";

const FIELD_CLASS =
  "w-full rounded-xl border border-border-tan bg-cream px-4 py-2.5 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-forest";
const LABEL_CLASS = "mb-1.5 block text-xs font-semibold text-ink-soft";

export default function PostJobPage() {
  const [form, setForm] = useState({
    jobTitle: "",
    experience: "",
    cdlClass: "",
    endorsements: "",
    equipmentType: "",
    routeType: "",
    location: "",
    payMin: "",
    payMax: "",
    description: "",
  });

  const update =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="flex min-h-screen bg-cream">
      <RecruiterSidebar active="post-a-job" />

      <main className="flex-1 px-8 py-8 lg:px-12">
        <h1 className="text-2xl font-extrabold text-ink">Post a Job</h1>
        <p className="mt-1 text-sm text-ink-faint">
          Fill in the details below to publish a new driver listing.
        </p>

        <form className="mt-6 max-w-3xl rounded-2xl border border-border-tan bg-card px-8 py-8">
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            <div>
              <label className={LABEL_CLASS}>Job Title</label>
              <input
                type="text"
                placeholder="Flatbed Driver"
                value={form.jobTitle}
                onChange={update("jobTitle")}
                className={FIELD_CLASS}
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>Experience Required</label>
              <input
                type="text"
                placeholder="3 - 5 Years"
                value={form.experience}
                onChange={update("experience")}
                className={FIELD_CLASS}
              />
            </div>

            <div>
              <label className={LABEL_CLASS}>CDL Class</label>
              <input
                type="text"
                placeholder="A"
                value={form.cdlClass}
                onChange={update("cdlClass")}
                className={FIELD_CLASS}
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>Endorsements</label>
              <input
                type="text"
                placeholder="Tanker, Hazmat"
                value={form.endorsements}
                onChange={update("endorsements")}
                className={FIELD_CLASS}
              />
            </div>

            <div>
              <label className={LABEL_CLASS}>Equipment Type</label>
              <input
                type="text"
                placeholder="Flatbed"
                value={form.equipmentType}
                onChange={update("equipmentType")}
                className={FIELD_CLASS}
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>Route Type</label>
              <input
                type="text"
                placeholder="OTR"
                value={form.routeType}
                onChange={update("routeType")}
                className={FIELD_CLASS}
              />
            </div>

            <div>
              <label className={LABEL_CLASS}>Location</label>
              <input
                type="text"
                placeholder="Dallas, Texas, USA"
                value={form.location}
                onChange={update("location")}
                className={FIELD_CLASS}
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>Pay Range (per week)</label>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-ink-faint">
                    $
                  </span>
                  <input
                    type="text"
                    placeholder="1,500"
                    value={form.payMin}
                    onChange={update("payMin")}
                    className={`${FIELD_CLASS} pl-7`}
                  />
                </div>
                <span className="text-ink-faint">–</span>
                <div className="relative flex-1">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-ink-faint">
                    $
                  </span>
                  <input
                    type="text"
                    placeholder="2,000"
                    value={form.payMax}
                    onChange={update("payMax")}
                    className={`${FIELD_CLASS} pl-7`}
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className={LABEL_CLASS}>Job Description</label>
              <textarea
                rows={4}
                placeholder="Looking for experienced flatbed drivers for long term OTR runs. Good pay and benefits."
                value={form.description}
                onChange={update("description")}
                className={`${FIELD_CLASS} resize-none`}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="rounded-xl bg-orange px-6 py-2.5 text-sm font-semibold text-cream transition-opacity hover:opacity-90"
            >
              Publish Job
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
