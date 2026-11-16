
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import {
  ArrowLeft,
  MapPin,
  BriefcaseBusiness,
  Clock,
  DollarSign,
  Building2,
  CalendarDays,
  Globe,
  CheckCircle2,
  GraduationCap,
  Mail,
  Users,
} from "lucide-react";

import ApplyJobButton from "./ApplyJobButton";

interface Job {
  _id: string;
  jobTitle?: string;
  title?: string;
  companyName?: string;
  company?: string;
  category?: string;
  jobType?: string;
  type?: string;
  location?: string;
  isRemote?: boolean;
  minimumSalary?: number;
  maximumSalary?: number;
  salaryFrequency?: string;
  compensation?: string;
  description?: string;
  requirements?: string[];
  responsibilities?: string[];
  experienceLevel?: string;
  education?: string;
  applicationDeadline?: string;
  deadline?: string;
  postedAt?: string;
  companyLogo?: string;
  image?: string;
  email?: string;
}

// Overview Item
function OverviewItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-400">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs text-neutral-500">{label}</p>

        <p className="mt-1 break-words text-sm font-medium text-neutral-200">
          {value}
        </p>
      </div>
    </div>
  );
}

// Reusable Section
function JobSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#111118] p-5 sm:p-7">
      <h2 className="text-lg font-bold text-white sm:text-xl">
        {title}
      </h2>

      <div className="mt-5">{children}</div>
    </section>
  );
}

// Main Page
export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:8000";

  const res = await fetch(`${baseUrl}/jobs/${id}`, {
    cache: "no-store",
  });

  if (res.status === 404) {
    notFound();
  }

  if (!res.ok) {
    throw new Error("Failed to fetch job details");
  }

  const job: Job = await res.json();

  if (!job || !job._id) {
    notFound();
  }

  const jobTitle = job.jobTitle || job.title || "Untitled Position";
  const companyName = job.companyName || job.company || "Company";
  const jobType = job.jobType || job.type || "Not specified";
  const salary =
    job.compensation ||
    (job.minimumSalary != null || job.maximumSalary != null
      ? `${job.minimumSalary?.toLocaleString() || ""} ${
          job.minimumSalary != null && job.maximumSalary != null ? "-" : ""
        } ${job.maximumSalary?.toLocaleString() || ""}`
      : "Negotiable");

  const requirements = Array.isArray(job.requirements)
    ? job.requirements
    : [];

  const responsibilities = Array.isArray(job.responsibilities)
    ? job.responsibilities
    : [];

  const deadline =
    job.applicationDeadline || job.deadline || "Not specified";

  return (
    <main className="min-h-screen bg-[#08080d] px-4 py-6 text-white sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Back Button */}
        <Link
          href="/browse-jobs"
          className="mb-6 inline-flex items-center gap-2 text-sm text-neutral-400 transition hover:text-violet-400"
        >
          <ArrowLeft size={17} />
          Back to Jobs
        </Link>

        {/* Main Layout */}
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-3 lg:gap-6">

          {/* Left Content */}
          <div className="min-w-0 space-y-5 lg:col-span-2">

            {/* Job Header */}
            <section className="rounded-2xl border border-white/10 bg-[#111118] p-5 sm:p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">

                {/* Company Icon */}
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10 text-violet-400">
                  <Building2 size={30} />
                </div>

                {/* Job Information */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-[11px] font-medium text-violet-400">
                      {job.category || "Career Opportunity"}
                    </span>

                    {job.isRemote && (
                      <span className="flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] text-emerald-400">
                        <Globe size={12} />
                        Remote
                      </span>
                    )}
                  </div>

                  <h1 className="mt-4 break-words text-2xl font-bold leading-tight text-white sm:text-3xl">
                    {jobTitle}
                  </h1>

                  <p className="mt-2 break-words font-medium text-neutral-400">
                    {companyName}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-xs text-neutral-500">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} />
                      {job.location || "Location not specified"}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <BriefcaseBusiness size={14} />
                      {jobType}
                    </span>
                  </div>
                </div>
              </div>

              {/* Job Tags */}
              <div className="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-5">
                <span className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-neutral-300">
                  {jobType}
                </span>

                {job.experienceLevel && (
                  <span className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-neutral-300">
                    {job.experienceLevel}
                  </span>
                )}

                {job.education && (
                  <span className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-neutral-300">
                    {job.education}
                  </span>
                )}
              </div>
            </section>

            {/* Job Overview */}
            <JobSection title="Job Overview">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <OverviewItem
                  icon={<DollarSign size={19} />}
                  label="Salary"
                  value={`${salary}${job.salaryFrequency ? ` / ${job.salaryFrequency}` : ""}`}
                />

                <OverviewItem
                  icon={<BriefcaseBusiness size={19} />}
                  label="Job Type"
                  value={jobType}
                />

                <OverviewItem
                  icon={<MapPin size={19} />}
                  label="Location"
                  value={job.location || "Not specified"}
                />

                <OverviewItem
                  icon={<Clock size={19} />}
                  label="Experience"
                  value={job.experienceLevel || "Not specified"}
                />

                <OverviewItem
                  icon={<GraduationCap size={19} />}
                  label="Education"
                  value={job.education || "Not specified"}
                />

                <OverviewItem
                  icon={<CalendarDays size={19} />}
                  label="Application Deadline"
                  value={deadline}
                />
              </div>
            </JobSection>

            {/* Job Description */}
            <JobSection title="Job Description">
              <p className="whitespace-pre-line text-sm leading-7 text-neutral-400">
                {job.description || "No job description available."}
              </p>
            </JobSection>

            {/* Responsibilities */}
            {responsibilities.length > 0 && (
              <JobSection title="Responsibilities">
                <ul className="space-y-4">
                  {responsibilities.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-sm leading-6 text-neutral-400"
                    >
                      <CheckCircle2
                        size={18}
                        className="mt-1 shrink-0 text-violet-400"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </JobSection>
            )}

            {/* Requirements */}
            {requirements.length > 0 && (
              <JobSection title="Requirements">
                <ul className="space-y-4">
                  {requirements.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-sm leading-6 text-neutral-400"
                    >
                      <CheckCircle2
                        size={18}
                        className="mt-1 shrink-0 text-violet-400"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </JobSection>
            )}
          </div>

          {/* Right Sidebar */}
          <aside className="min-w-0 space-y-5 lg:sticky lg:top-6">

            {/* Apply Job Card */}
            <section className="rounded-2xl border border-violet-500/20 bg-[#111118] p-5 sm:p-6">
              <p className="text-sm text-neutral-500">
                Offered Salary
              </p>

              <h2 className="mt-2 break-words text-2xl font-bold text-violet-400">
                {salary}
              </h2>

              {job.salaryFrequency && (
                <p className="mt-1 text-xs text-neutral-500">
                  Per {job.salaryFrequency}
                </p>
              )}

              <ApplyJobButton jobId={job._id} />

              <p className="mt-4 text-center text-xs leading-5 text-neutral-500">
                Make sure your profile is up to date before applying.
              </p>
            </section>

            {/* Company Information */}
            <section className="rounded-2xl border border-white/10 bg-[#111118] p-5 sm:p-6">
              <h2 className="text-lg font-bold text-white">
                About the Company
              </h2>

              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-400">
                  <Building2 size={23} />
                </div>

                <div className="min-w-0">
                  <h3 className="break-words text-sm font-semibold text-white">
                    {companyName}
                  </h3>

                  <p className="mt-1 text-xs text-neutral-500">
                    Hiring Company
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4 border-t border-white/10 pt-5">
                <div className="flex items-start gap-3 text-sm text-neutral-400">
                  <MapPin size={17} className="mt-0.5 shrink-0 text-violet-400" />
                  <span className="break-words">
                    {job.location || "Location not specified"}
                  </span>
                </div>

                {job.email && (
                  <div className="flex items-start gap-3 text-sm text-neutral-400">
                    <Mail size={17} className="mt-0.5 shrink-0 text-violet-400" />

                    <a
                      href={`mailto:${job.email}`}
                      className="break-all transition hover:text-violet-400"
                    >
                      {job.email}
                    </a>
                  </div>
                )}
              </div>
            </section>

            {/* Job Seeker Tips */}
            <section className="rounded-2xl border border-violet-500/20 bg-violet-500/[0.06] p-5 sm:p-6">
              <div className="flex items-center gap-2 text-violet-400">
                <Users size={19} />

                <h2 className="text-sm font-bold">
                  Job Seeker Tips
                </h2>
              </div>

              <p className="mt-3 text-sm leading-6 text-neutral-400">
                Review the job requirements carefully and prepare your CV
                according to the position before applying.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
