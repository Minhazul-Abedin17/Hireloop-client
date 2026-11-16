
import {
  Trash2,
  Globe,
  MapPin,
  Users,
  CalendarDays,
  BriefcaseBusiness,
} from "lucide-react";

import type { ElementType } from "react";
import { categoryIcons, formatJobDate, getJobSalary, getJobStatus, JobStatus, NormalizedJob } from "../lib/job-utils";

// import {
//   categoryIcons,
//   formatJobDate,
//   getJobSalary,
//   getJobStatus,
//   type JobStatus,
//   type NormalizedJob,
// } from "../_lib/job-utils";

// Statistics Card
export function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: number;
  description: string;
  icon: ElementType;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#111118] p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-neutral-400">{title}</p>

        <div className="rounded-lg bg-violet-500/10 p-2 text-violet-400">
          <Icon size={18} />
        </div>
      </div>

      <p className="mt-3 text-2xl font-bold">{value}</p>
      <p className="mt-1 text-xs text-neutral-500">{description}</p>
    </div>
  );
}

// Job Status Badge
export function StatusBadge({ status }: { status: JobStatus }) {
  const isActive = status === "Active";

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-1 text-[10px] font-medium ${
        isActive
          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
          : "border-neutral-700 bg-neutral-800/60 text-neutral-400"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isActive ? "bg-emerald-400" : "bg-neutral-500"
        }`}
      />
      {status}
    </span>
  );
}

// Job Icon
function JobIcon({ category }: { category: string }) {
  const Icon =
    categoryIcons[category.toLowerCase()] || BriefcaseBusiness;

  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
      <Icon size={17} />
    </div>
  );
}

// Location Icon
function LocationIcon({ job }: { job: NormalizedJob }) {
  return job.isRemote ? (
    <Globe size={13} />
  ) : (
    <MapPin size={13} />
  );
}

// Desktop Job Table
export function JobTable({
  jobs,
  onDelete,
}: {
  jobs: NormalizedJob[];
  onDelete: (job: NormalizedJob) => void;
}) {
  return (
    <div className="hidden w-full md:block">
      <table className="w-full table-fixed text-left">
        <thead className="bg-white/[0.025]">
          <tr className="border-b border-white/10 text-[11px] text-neutral-500">
            <th className="w-[25%] px-3 py-3 font-medium">
              Job Information
            </th>

            <th className="w-[19%] px-2 py-3 font-medium">
              Company
            </th>

            <th className="w-[13%] px-2 py-3 font-medium">
              Job Type
            </th>

            <th className="w-[17%] px-2 py-3 font-medium">
              Salary
            </th>

            <th className="w-[11%] px-2 py-3 font-medium">
              Applicants
            </th>

            <th className="w-[10%] px-1 py-1 font-medium">
              Status
            </th>

            <th className="w-[5%] px-1 py-1 text-center font-medium">
              Action
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-white/[0.06]">
          {jobs.map((job) => (
            <tr
              key={job._id}
              className="transition hover:bg-white/[0.025]"
            >
              {/* Job Information */}
              <td className="px-3 py-3">
                <div className="flex min-w-0 items-center gap-2">
                  <JobIcon category={job.category} />

                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-white">
                      {job.jobTitle}
                    </p>

                    <p className="mt-1 truncate text-[10px] text-neutral-500">
                      {job.category}
                    </p>
                  </div>
                </div>
              </td>

              {/* Company */}
              <td className="px-2 py-3">
                <p className="truncate text-xs text-neutral-300">
                  {job.companyName}
                </p>

                <p className="mt-1 flex items-center gap-1 truncate text-[10px] text-neutral-500">
                  <LocationIcon job={job} />
                  {job.location}
                </p>
              </td>

              {/* Job Type */}
              <td className="px-2 py-3">
                <span className="inline-block max-w-full truncate rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] text-neutral-300">
                  {job.jobType}
                </span>
              </td>

              {/* Salary */}
              <td className="px-2 py-3">
                <p className="truncate text-[11px] text-neutral-300">
                  {getJobSalary(job)}
                </p>
              </td>

              {/* Applicants */}
              <td className="px-2 py-3">
                <div className="flex items-center gap-1.5 text-xs text-neutral-300">
                  <Users
                    size={13}
                    className="shrink-0 text-violet-400"
                  />
                  {job.applicants}
                </div>
              </td>

              {/* Status */}
              <td className="px-2 py-3">
                <StatusBadge status={getJobStatus(job)} />
              </td>

              {/* Action */}
              <td className="px-2 py-3 text-center">
                <button
                  onClick={() => onDelete(job)}
                  title="Delete job"
                  className="rounded-md border border-white/10 p-1.5 text-neutral-400 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Mobile and Tablet Job Cards
export function JobMobileCards({
  jobs,
  onDelete,
}: {
  jobs: NormalizedJob[];
  onDelete: (job: NormalizedJob) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 p-3 md:grid-cols-2 md:p-4 lg:hidden">
      {jobs.map((job) => (
        <div
          key={job._id}
          className="min-w-0 rounded-xl border border-white/10 bg-[#0c0c13] p-4"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 items-center gap-3">
              <JobIcon category={job.category} />

              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold">
                  {job.jobTitle}
                </h3>

                <p className="mt-1 truncate text-xs text-neutral-500">
                  {job.category}
                </p>
              </div>
            </div>

            <StatusBadge status={getJobStatus(job)} />
          </div>

          <div className="mt-3 space-y-2 border-t border-white/[0.07] pt-2 text-xs text-neutral-400">
            <p className="flex items-center gap-1">
              <BriefcaseBusiness size={13} />
              {job.companyName}
            </p>

            <p className="flex items-center gap-1">
              <LocationIcon job={job} />
              {job.location}
            </p>

            <p className="flex items-center gap-1">
              <Users size={10} />
              {job.applicants} Applicants
            </p>

            <p className="flex items-center gap-1">
              <CalendarDays size={13} />
              Deadline: {formatJobDate(job.deadline)}
            </p>

            <p>
              Salary:{" "}
              <span className="font-semibold text-white">
                {getJobSalary(job)}
              </span>
            </p>
          </div>

          <button
            onClick={() => onDelete(job)}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/20 py-2 text-xs text-red-400 transition hover:bg-red-500/10"
          >
            <Trash2 size={14} />
            Delete Job
          </button>
        </div>
      ))}
    </div>
  );
}
