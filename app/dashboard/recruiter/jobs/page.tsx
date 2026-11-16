
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  BriefcaseBusiness,
  CheckCircle2,
  Users,
  Search,
  Filter,
  Loader2,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

import { getJob, deleteJob } from "@/lib/api/jobs";

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


import { getJobStatus, Job, NormalizedJob, normalizeJob } from "./lib/job-utils";
import { JobMobileCards, JobTable, StatCard } from "./components/job-components";


export default function JobsPage() {
  const [jobs, setJobs] = useState<NormalizedJob[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const [selectedJob, setSelectedJob] =
    useState<NormalizedJob | null>(null);

  // Load jobs
  useEffect(() => {
    getJob()
      .then((data: Job[]) => {
        setJobs(Array.isArray(data) ? data.map(normalizeJob) : []);
      })
      .catch((error: Error) => {
        setError(error.message || "Failed to load jobs.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Delete job
  const handleDeleteJob = async () => {
    if (!selectedJob) return;

    setDeleting(true);

    try {
      await deleteJob(selectedJob._id);

      setJobs((previousJobs) =>
        previousJobs.filter((job) => job._id !== selectedJob._id)
      );

      toast.success("Job deleted successfully!");
      setSelectedJob(null);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete job."
      );
    } finally {
      setDeleting(false);
    }
  };

  // Search and filter
  const filteredJobs = jobs.filter((job) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      job.jobTitle.toLowerCase().includes(searchText) ||
      job.companyName.toLowerCase().includes(searchText) ||
      job.category.toLowerCase().includes(searchText) ||
      job.location.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "All" ||
      getJobStatus(job) === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Statistics
  const activeJobs = jobs.filter(
    (job) => getJobStatus(job) === "Active"
  );

  const totalApplicants = jobs.reduce(
    (total, job) => total + job.applicants,
    0
  );

  return (
    <div className="min-h-screen bg-[#08080d] px-2 py-4 text-white sm:px-6 lg:px-8 lg:py-9">
      <ToastContainer position="top-right" theme="dark" />

      <div className="mx-auto max-w-6xl space-y-7">

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
              <Loader2
                className="animate-spin text-violet-400"
                size={30}
              />
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

          {/* Job Table */}
          {!loading && !error && filteredJobs.length > 0 && (
            <>
              <JobTable
                jobs={filteredJobs}
                onDelete={setSelectedJob}
              />

              <JobMobileCards
                jobs={filteredJobs}
                onDelete={setSelectedJob}
              />
            </>
          )}

          {/* Empty State */}
          {!loading && !error && filteredJobs.length === 0 && (
            <div className="px-5 py-14 text-center">
              <BriefcaseBusiness
                size={30}
                className="mx-auto text-violet-400"
              />

              <h3 className="mt-4 font-semibold">
                No jobs found
              </h3>

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

      {/* Delete Confirmation */}
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
                {selectedJob?.jobTitle}
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
              disabled={deleting}
              onClick={(e) => {
                e.preventDefault();
                handleDeleteJob();
              }}
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
