
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Trash2,
  Globe,
  MapPin,
  Users,
  Code2,
  Palette,
  Network,
  Megaphone,
  CheckCircle2,
  BriefcaseBusiness,
  CalendarDays,
  Search,
  Filter,
  Loader2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { deleteJob, getJob } from "@/lib/api/jobs";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "react-toastify";

type Job = {
  _id: string;

  // New data
  jobTitle?: string;
  companyName?: string;
  category?: string;
  jobType?: string;
  isRemote?: boolean;
  minimumSalary?: number | null;
  maximumSalary?: number | null;
  salaryFrequency?: string;

  // Old data
  title?: string;
  dept?: string;
  icon?: string;
  company?: string;
  type?: string;
  compensation?: string;
  status?: string;

  // Common data
  location?: string;
  deadline?: string;
  applicants?: number;
};

type JobStatus = "Active" | "Expired";

const categoryIcons: Record<string, LucideIcon> = {
  "engineering-tech": Code2,
  engineering: Code2,
  "design-creative": Palette,
  design: Palette,
  marketing: Megaphone,
  "business-management": Network,
  "finance-accounting": BriefcaseBusiness,
  sales: BriefcaseBusiness,
  "customer-support": Users,
  hr: Users,
  education: BriefcaseBusiness,
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Load jobs from database
  useEffect(() => { 
    getJob()
      .then((data) => {
        setJobs(Array.isArray(data) ? data : []);
      })
      .catch((error: Error) => {
        setError(error.message || "Failed to load jobs.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Delete selected job after confirmation
  const handleDeleteJob = async () => {
    if (!selectedJob) return;

    setDeleting(true);

    try {
      await deleteJob(selectedJob._id);

      setJobs((previousJobs) =>
        previousJobs.filter((job) => job._id !== selectedJob._id)
      );

      setSelectedJob(null);
    } catch (error) {
      window.alert(
        error instanceof Error ? error.message : "Failed to delete job."
      );
    } finally {
      toast.success('Deleted Successfully')
    }
  };

  // Get job status
  const getStatus = (job: Job): JobStatus => {
    if (job.status === "Active" || job.status === "Expired") {
      return job.status;
    }

    if (!job.deadline) return "Active";

    const deadline = new Date(job.deadline);
    deadline.setHours(23, 59, 59, 999);

    return deadline < new Date() ? "Expired" : "Active";
  };

  // Format salary
  const getSalary = (job: Job) => {
    if (job.compensation) return job.compensation;

    if (job.salaryFrequency === "negotiable") return "Negotiable";

    if (job.minimumSalary == null && job.maximumSalary == null) {
      return "Not disclosed";
    }

    const min = job.minimumSalary?.toLocaleString() || "";
    const max = job.maximumSalary?.toLocaleString() || "";

    const amount = min && max ? `${min} - ${max}` : min || max;

    const frequency: Record<string, string> = {
      hourly: "/hr",
      daily: "/day",
      weekly: "/week",
      monthly: "/month",
      yearly: "/year",
    };

    return `${amount} ${frequency[job.salaryFrequency || ""] || ""}`;
  };

  // Format deadline
  const formatDate = (date?: string) => {
    if (!date) return "Not specified";

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) return date;

    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Filter jobs
  const filteredJobs = jobs.filter((job) => {
    const title = job.jobTitle || job.title || "";
    const company = job.companyName || job.company || "";
    const category = job.category || job.dept || "";
    const location = job.location || "";

    const searchText = search.toLowerCase();

    const matchesSearch =
      title.toLowerCase().includes(searchText) ||
      company.toLowerCase().includes(searchText) ||
      category.toLowerCase().includes(searchText) ||
      location.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "All" || getStatus(job) === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const activeJobs = jobs.filter(
    (job) => getStatus(job) === "Active"
  );

  const totalApplicants = jobs.reduce(
    (total, job) => total + (job.applicants || 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#08080d] px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-9">
      <div className="mx-auto max-w-7xl space-y-7">

        {/* Header */}
        <div className="flex flex-col justify-between gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-center">
          <div>
            <p className="mb-3 text-xs text-neutral-500">
              Dashboard / Manage Jobs
            </p>

            <h1 className="text-2xl font-bold sm:text-3xl">
              Manage Job Posts
            </h1>

            <p className="mt-2 text-sm text-neutral-400">
              Manage your job listings and track applicants.
            </p>
          </div>

          <Link
            href="/dashboard/recruiter/jobs/new"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-violet-600 px-5 text-sm font-semibold transition hover:bg-violet-500"
          >
            <Plus size={18} />
            New Job Post
          </Link>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            title="Total Job Posts"
            value={jobs.length}
            description="All job listings"
            icon={BriefcaseBusiness}
          />

          <StatCard
            title="Active Listings"
            value={activeJobs.length}
            description="Currently accepting applications"
            icon={CheckCircle2}
          />

          <StatCard
            title="Total Applicants"
            value={totalApplicants}
            description="Across all job listings"
            icon={Users}
          />
        </div>

        {/* Job Listings */}
        <section className="overflow-hidden rounded-xl border border-white/10 bg-[#111118]">

          {/* Search and Filter */}
          <div className="flex flex-col gap-4 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                All Job Listings
              </h2>

              <p className="mt-1 text-xs text-neutral-500">
                View and manage your published jobs.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
                />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search jobs..."
                  className="h-10 w-full rounded-lg border border-white/10 bg-[#09090f] pl-9 pr-3 text-sm outline-none focus:border-violet-500 sm:w-56"
                />
              </div>

              <div className="relative">
                <Filter
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
                />

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-10 w-full appearance-none rounded-lg border border-white/10 bg-[#09090f] pl-9 pr-8 text-sm outline-none focus:border-violet-500 sm:w-36"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center py-16">
              <Loader2 className="animate-spin text-violet-400" size={30} />
              <p className="mt-4 text-sm text-neutral-400">
                Loading jobs...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="py-16 text-center text-sm text-red-400">
              {error}
              <button
                onClick={() => window.location.reload()}
                className="ml-3 text-violet-400 underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Desktop Table */}
          {!loading && !error && filteredJobs.length > 0 && (
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[900px] text-left">
                <thead className="bg-white/[0.025]">
                  <tr className="border-b border-white/10 text-xs text-neutral-500">
                    <th className="px-6 py-4">Job Information</th>
                    <th className="px-5 py-4">Company & Location</th>
                    <th className="px-5 py-4">Job Type</th>
                    <th className="px-5 py-4">Salary</th>
                    <th className="px-5 py-4">Applicants</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/[0.06]">
                  {filteredJobs.map((job) => {
                    const category = job.category || job.dept || "";
                    const JobIcon =
                      categoryIcons[category] || BriefcaseBusiness;

                    return (
                      <tr key={job._id} className="hover:bg-white/[0.025]">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                              <JobIcon size={19} />
                            </div>

                            <div>
                              <p className="max-w-48 truncate text-sm font-semibold">
                                {job.jobTitle || job.title}
                              </p>
                              <p className="mt-1 text-xs text-neutral-500">
                                {category}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-5">
                          <p className="text-sm text-neutral-200">
                            {job.companyName || job.company}
                          </p>

                          <div className="mt-1 flex items-center gap-1.5 text-xs text-neutral-500">
                            {job.isRemote ||
                            job.location?.toLowerCase().includes("remote") ? (
                              <Globe size={13} />
                            ) : (
                              <MapPin size={13} />
                            )}
                            {job.location || "Not specified"}
                          </div>
                        </td>

                        <td className="px-5 py-5">
                          <span className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-neutral-300">
                            {job.jobType || job.type || "Not specified"}
                          </span>
                        </td>

                        <td className="px-5 py-5 text-sm">
                          {getSalary(job)}
                        </td>

                        <td className="px-5 py-5 text-sm">
                          <div className="flex items-center gap-2">
                            <Users size={15} className="text-violet-400" />
                            {job.applicants ?? 0}
                          </div>
                        </td>

                        <td className="px-5 py-5">
                          <StatusBadge status={getStatus(job)} />
                        </td>

                        <td className="px-5 py-5 text-right">
                          <button
                            onClick={() => setSelectedJob(job)}
                            title="Delete job"
                            className="rounded-lg border border-white/10 p-2 text-neutral-400 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Mobile Cards */}
          {!loading && !error && filteredJobs.length > 0 && (
            <div className="grid gap-3 p-4 md:hidden">
              {filteredJobs.map((job) => {
                const category = job.category || job.dept || "";
                const JobIcon =
                  categoryIcons[category] || BriefcaseBusiness;

                return (
                  <div
                    key={job._id}
                    className="rounded-xl border border-white/10 bg-[#0c0c13] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                          <JobIcon size={19} />
                        </div>

                        <div>
                          <h3 className="text-sm font-semibold">
                            {job.jobTitle || job.title}
                          </h3>
                          <p className="mt-1 text-xs text-neutral-500">
                            {category}
                          </p>
                        </div>
                      </div>

                      <StatusBadge status={getStatus(job)} />
                    </div>

                    <div className="mt-4 space-y-3 border-t border-white/[0.07] pt-4 text-xs text-neutral-400">
                      <p className="flex items-center gap-2">
                        <BriefcaseBusiness size={14} />
                        {job.companyName || job.company}
                      </p>

                      <p className="flex items-center gap-2">
                        {job.isRemote ||
                        job.location?.toLowerCase().includes("remote") ? (
                          <Globe size={14} />
                        ) : (
                          <MapPin size={14} />
                        )}
                        {job.location || "Not specified"}
                      </p>

                      <p className="flex items-center gap-2">
                        <Users size={14} />
                        {job.applicants ?? 0} Applicants
                      </p>

                      <p className="flex items-center gap-2">
                        <CalendarDays size={14} />
                        Deadline: {formatDate(job.deadline)}
                      </p>

                      <p>
                        Salary: <span className="font-semibold text-white">{getSalary(job)}</span>
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedJob(job)}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/20 py-2 text-xs text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 size={14} />
                      Delete Job
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredJobs.length === 0 && (
            <div className="px-5 py-14 text-center">
              <BriefcaseBusiness
                size={30}
                className="mx-auto text-violet-400"
              />

              <h3 className="mt-4 font-semibold">No jobs found</h3>

              <p className="mt-2 text-sm text-neutral-500">
                {jobs.length === 0
                  ? "You haven't created any jobs yet."
                  : "Try changing your search or filter."}
              </p>
            </div>
          )}

          {/* Footer */}
          {!loading && !error && filteredJobs.length > 0 && (
            <div className="border-t border-white/10 px-5 py-4">
              <p className="text-xs text-neutral-500">
                Showing {filteredJobs.length} of {jobs.length} jobs
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!selectedJob}
        onOpenChange={(open) => {
          if (!open && !deleting) setSelectedJob(null);
        }}
      >
        <AlertDialogContent className="border border-white/10 bg-[#15151d] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete this job post?
            </AlertDialogTitle>

            <AlertDialogDescription className="text-neutral-400">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-white">
                {selectedJob?.jobTitle || selectedJob?.title}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleting}
              className="border-white/10 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteJob();
              }}
              disabled={deleting}
              className="bg-red-600 text-white hover:bg-red-500"
            >
              {deleting ? (
                <>
                  <Loader2 size={15} className="mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Yes, Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Statistics Card
function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#111118] p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-400">{title}</p>

        <div className="rounded-lg bg-violet-500/10 p-2 text-violet-400">
          <Icon size={19} />
        </div>
      </div>

      <p className="mt-4 text-3xl font-bold">{value}</p>

      <p className="mt-1 text-xs text-neutral-500">{description}</p>
    </div>
  );
}

// Job Status
function StatusBadge({ status }: { status: JobStatus }) {
  const isActive = status === "Active";

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-medium ${
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
