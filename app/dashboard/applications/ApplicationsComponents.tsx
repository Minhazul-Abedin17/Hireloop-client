
"use client";

import { useState } from "react";
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  BriefcaseBusiness,
  Clock,
  CheckCircle2,
  CalendarDays,
  Eye,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Application Type
export interface Application {
  _id: string;
  jobId: string;
  userId: string;
  email: string;
  status: string;
  appliedAt: string;
  archived?: boolean;

  jobTitle?: string;
  companyName?: string;
  jobType?: string;
  isRemote?: boolean;
}

// Header Component
export function ApplicationsHeader({
  search,
  setSearch,
  activeTab,
  setActiveTab,
}: {
  search: string;
  setSearch: (value: string) => void;
  activeTab: string;
  setActiveTab: (value: string) => void;
}) {
  return (
    <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          My Applications
        </h1>

        <p className="mt-2 text-sm text-neutral-500">
          Track your job applications and interview progress in real-time.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-52">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search applications..."
            className="h-10 w-full rounded-lg border border-white/10 bg-[#111116] pl-9 pr-3 text-sm text-white outline-none placeholder:text-neutral-500 focus:border-violet-500"
          />
        </div>

        {/* Tabs */}
        <div className="flex rounded-lg border border-white/10 bg-[#141419] p-1">
          <button
            onClick={() => setActiveTab("active")}
            className={`rounded-md px-4 py-2 text-xs transition ${
              activeTab === "active"
                ? "bg-[#24242c] text-white"
                : "text-neutral-500 hover:text-white"
            }`}
          >
            Active
          </button>

          <button
            onClick={() => setActiveTab("archived")}
            className={`rounded-md px-4 py-2 text-xs transition ${
              activeTab === "archived"
                ? "bg-[#24242c] text-white"
                : "text-neutral-500 hover:text-white"
            }`}
          >
            Archived
          </button>
        </div>

        {/* Export */}
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-xs font-semibold text-black transition hover:bg-neutral-200"
        >
          <Download size={15} />
          Export PDF
        </button>
      </div>
    </div>
  );
}

// Statistics Component
export function ApplicationsStats({
  applications,
}: {
  applications: Application[];
}) {
  const totalApplied = applications.length;

  const shortlisted = applications.filter(
    (app) => app.status?.toLowerCase() === "shortlisted"
  ).length;

  const interviews = applications.filter((app) =>
    ["interview", "interview scheduled"].includes(
      app.status?.toLowerCase()
    )
  ).length;

  const successful = applications.filter(
    (app) => app.status?.toLowerCase() === "offered"
  ).length;

  const successRate =
    totalApplied > 0
      ? Math.round((successful / totalApplied) * 100)
      : 0;

  const stats = [
    {
      title: "Total Applied",
      value: totalApplied,
      icon: <BriefcaseBusiness size={18} />,
      color: "text-white",
    },
    {
      title: "Shortlisted",
      value: shortlisted,
      icon: <CheckCircle2 size={18} />,
      color: "text-white",
    },
    {
      title: "Interviews",
      value: interviews,
      icon: <CalendarDays size={18} />,
      color: "text-amber-400",
    },
    {
      title: "Success Rate",
      value: `${successRate}%`,
      icon: <BriefcaseBusiness size={18} />,
      color: "text-emerald-400",
    },
  ];

  return (
    <div className="mb-7 grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="rounded-xl border border-white/10 bg-[#121217] p-5 transition hover:border-violet-500/30"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs text-neutral-500">
              {stat.title}
            </p>

            <span className="text-neutral-600">
              {stat.icon}
            </span>
          </div>

          <p className={`mt-2 text-2xl font-bold ${stat.color}`}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}

// Status Color
function getStatusStyle(status: string) {
  switch (status?.toLowerCase()) {
    case "shortlisted":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";

    case "review":
    case "under review":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";

    case "interview":
    case "interview scheduled":
      return "bg-violet-500/10 text-violet-400 border-violet-500/20";

    case "offered":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";

    case "rejected":
      return "bg-red-500/10 text-red-400 border-red-500/20";

    default:
      return "bg-neutral-500/10 text-neutral-400 border-neutral-500/20";
  }
}

// Date Format
function formatDate(date: string) {
  if (!date) return "Recently";

  const appliedDate = new Date(date);

  if (Number.isNaN(appliedDate.getTime())) return "Recently";

  const hours = Math.floor(
    (Date.now() - appliedDate.getTime()) / (1000 * 60 * 60)
  );

  const days = Math.floor(hours / 24);

  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours} hours ago`;
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;

  return appliedDate.toLocaleDateString();
}

// Application List Component
export function ApplicationsList({
  applications,
  loading,
}: {
  applications: Application[];
  loading: boolean;
}) {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const totalPages = Math.ceil(
    applications.length / itemsPerPage
  );

  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentApplications = applications.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#121217]">

      {/* Table Header */}
      <div className="hidden grid-cols-[minmax(200px,1.4fr)_minmax(130px,1fr)_minmax(110px,0.8fr)_minmax(100px,0.7fr)_70px] gap-4 border-b border-white/10 bg-[#17171d] px-5 py-4 text-xs text-neutral-500 md:grid">
        <span>Job Title</span>
        <span>Company</span>
        <span>Applied</span>
        <span>Status</span>
        <span className="text-right">Action</span>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex min-h-64 items-center justify-center text-sm text-violet-400">
          Loading applications...
        </div>
      ) : currentApplications.length === 0 ? (
        <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">
          <BriefcaseBusiness size={35} className="text-violet-400" />

          <h3 className="mt-4 font-semibold text-white">
            No applications found
          </h3>

          <p className="mt-2 text-sm text-neutral-500">
            Your applications will appear here.
          </p>
        </div>
      ) : (
        currentApplications.map((application) => (
          <div
            key={application._id}
            className="grid grid-cols-1 gap-4 border-b border-white/[0.06] px-5 py-5 transition hover:bg-white/[0.02] md:grid-cols-[minmax(200px,1.4fr)_minmax(130px,1fr)_minmax(110px,0.8fr)_minmax(100px,0.7fr)_70px] md:items-center md:gap-4 md:py-4"
          >
            {/* Job Title */}
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[#202027] text-violet-300">
                <BriefcaseBusiness size={18} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">
                  {application.jobTitle || "Untitled Position"}
                </p>

                <p className="mt-1 text-xs text-neutral-500">
                  {application.jobType || "Full-time"}
                  {application.isRemote ? " • Remote" : ""}
                </p>
              </div>
            </div>

            {/* Company */}
            <div className="flex justify-between gap-3 md:block">
              <span className="text-xs text-neutral-500 md:hidden">
                Company
              </span>

              <span className="text-sm text-neutral-400">
                {application.companyName || "Unknown Company"}
              </span>
            </div>

            {/* Applied Date */}
            <div className="flex justify-between gap-3 md:block">
              <span className="text-xs text-neutral-500 md:hidden">
                Applied
              </span>

              <span className="flex items-center gap-1.5 text-xs text-neutral-400">
                <Clock size={13} className="md:hidden" />
                {formatDate(application.appliedAt)}
              </span>
            </div>

            {/* Status */}
            <div className="flex justify-between gap-3 md:block">
              <span className="text-xs text-neutral-500 md:hidden">
                Status
              </span>

              <span
                className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] capitalize ${getStatusStyle(application.status)}`}
              >
                {application.status || "Pending"}
              </span>
            </div>

            {/* Details */}
            <div className="flex justify-end">
              <button
                onClick={() =>
                  router.push(`/browse-jobs/${application.jobId}`)
                }
                className="flex items-center gap-1.5 text-xs text-neutral-400 transition hover:text-violet-400"
              >
                <Eye size={14} />
                Details
              </button>
            </div>
          </div>
        ))
      )}

      {/* Pagination */}
      {!loading && applications.length > 0 && (
        <div className="flex flex-col gap-4 bg-[#17171d] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-neutral-500">
            Showing {startIndex + 1}-
            {Math.min(startIndex + itemsPerPage, applications.length)} of{" "}
            {applications.length} applications
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-neutral-400 disabled:opacity-30"
            >
              <ChevronLeft size={17} />
            </button>

            <span className="text-xs text-neutral-400">
              {currentPage} / {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-neutral-400 disabled:opacity-30"
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
