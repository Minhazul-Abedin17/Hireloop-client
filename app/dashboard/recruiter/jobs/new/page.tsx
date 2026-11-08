
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  MapPin,
  CalendarDays,
  DollarSign,
  FileText,
  ListChecks,
  Plus,
  Send,
  Loader2,
  Globe,
} from "lucide-react";

export default function NewPage() {
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const jobData = Object.fromEntries(formData.entries());

    console.log("New Job Details:", jobData);

    // এখানে পরবর্তীতে তোমার Backend API connect করবে।
  };

  return (
    <div className="mx-auto max-w-6xl space-y-7 pb-10">

      {/* Top Navigation */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <div className="mb-2 flex items-center gap-2 text-sm">
            <Link
              href="/dashboard/recruiter/jobs"
              className="text-neutral-400 transition hover:text-violet-400"
            >
              Manage Jobs
            </Link>

            <span className="text-neutral-600">/</span>

            <span className="font-medium text-white">
              Create New Listing
            </span>
          </div>

          <p className="text-xs text-neutral-500">
            Create and publish a new job opportunity.
          </p>
        </div>

        <Link
          href="/dashboard/recruiter/jobs"
          className="inline-flex items-center gap-2 text-sm text-neutral-400 transition hover:text-white sm:hidden"
        >
          <ArrowLeft size={16} />
          Back to Manage Jobs
        </Link>

        <button
          type="submit"
          form="create-job-form"
          disabled={isPublishing}
          className="hidden items-center justify-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60 sm:inline-flex"
        >
          {isPublishing ? (
            <Loader2 size={17} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}
          Publish Job
        </button>
      </div>

      {/* Page Heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Create New Job Listing
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-400">
          Fill in the position specifications to attract qualified talent
          across our network.
        </p>
      </div>

      {/* Job Form */}
      <form
        id="create-job-form"
        onSubmit={handlePublish}
        className="space-y-6"
      >

        {/* 01. Basic Information */}
        <section className="rounded-xl border border-white/10 bg-neutral-900/70 p-5 sm:p-7">

          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
              <BriefcaseBusiness size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-white">
                01. Basic Information
              </h2>
              <p className="mt-1 text-xs text-neutral-500">
                Provide the essential details about this position.
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">

            {/* Job Title */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-neutral-300">
                Job Title <span className="text-red-400">*</span>
              </label>

              <input
                type="text"
                name="jobTitle"
                required
                placeholder="e.g. Frontend Developer, Backend Developer"
                className="h-11 w-full rounded-lg border border-white/10 bg-[#111116] px-4 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-violet-500"
              />
            </div>

            {/* Company Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">
                Company Name <span className="text-red-400">*</span>
              </label>

              <div className="relative">
                <Building2 className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />

                <input
                  type="text"
                  name="companyName"
                  required
                  placeholder="Enter company name"
                  className="h-11 w-full rounded-lg border border-white/10 bg-[#111116] pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-violet-500"
                />
              </div>
            </div>

            {/* Job Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">
                Job Category <span className="text-red-400">*</span>
              </label>

              <select
                name="category"
                required
                defaultValue=""
                className="h-11 w-full rounded-lg border border-white/10 bg-[#111116] px-4 text-sm text-neutral-300 outline-none focus:border-violet-500"
              >
                <option value="" disabled>
                  Select a category
                </option>
                <option value="engineering-tech">Engineering & Technology</option>
                <option value="design-creative">Design & Creative</option>
                <option value="marketing">Marketing</option>
                <option value="business-management">Business & Management</option>
                <option value="finance-accounting">Finance & Accounting</option>
                <option value="sales">Sales</option>
                <option value="customer-support">Customer Support</option>
                <option value="hr">Human Resources</option>
                <option value="education">Education</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Job Type */}
            <div className="space-y-3 md:col-span-2">
              <label className="text-sm font-medium text-neutral-300">
                Job Type <span className="text-red-400">*</span>
              </label>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  "Full-time",
                  "Part-time",
                  "Contract",
                  "Internship",
                ].map((type) => (
                  <label key={type} className="cursor-pointer">
                    <input
                      type="radio"
                      name="jobType"
                      value={type}
                      required
                      className="peer sr-only"
                    />

                    <div className="flex min-h-12 items-center justify-center rounded-lg border border-white/10 bg-[#111116] px-3 text-center text-sm text-neutral-400 transition hover:border-violet-500/50 peer-checked:border-violet-500 peer-checked:bg-violet-500/10 peer-checked:font-semibold peer-checked:text-violet-400">
                      {type}
                    </div>
                  </label>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* 02. Location & Work Mode */}
        <section className="rounded-xl border border-white/10 bg-neutral-900/70 p-5 sm:p-7">

          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
              <MapPin size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-white">
                02. Location & Work Mode
              </h2>
              <p className="mt-1 text-xs text-neutral-500">
                Where will the selected candidate work?
              </p>
            </div>
          </div>

          <div className="space-y-5">

            {/* Location */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">
                Job Location <span className="text-red-400">*</span>
              </label>

              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />

                <input
                  type="text"
                  name="location"
                  required
                  placeholder="e.g. Dhaka, Bangladesh"
                  className="h-11 w-full rounded-lg border border-white/10 bg-[#111116] pl-10 pr-4 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-violet-500"
                />
              </div>
            </div>

            {/* Remote Work */}
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-white/10 bg-[#111116] p-4">
              <input
                type="checkbox"
                name="isRemote"
                value="true"
                className="mt-1 h-4 w-4 accent-violet-600"
              />

              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <Globe size={16} className="text-violet-400" />
                  Remote Work Allowed
                </div>

                <p className="mt-1 text-xs leading-5 text-neutral-500">
                  Allow candidates to work remotely from their preferred location.
                </p>
              </div>
            </label>

          </div>
        </section>

        {/* 03. Compensation & Timeline */}
        <section className="rounded-xl border border-white/10 bg-neutral-900/70 p-5 sm:p-7">

          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
              <DollarSign size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-white">
                03. Compensation & Timeline
              </h2>
              <p className="mt-1 text-xs text-neutral-500">
                Set the salary range and application deadline.
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">

            {/* Minimum Salary */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">
                Minimum Salary
              </label>

              <input
                type="number"
                name="minimumSalary"
                min="0"
                placeholder="e.g. 30000"
                className="h-11 w-full rounded-lg border border-white/10 bg-[#111116] px-4 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-violet-500"
              />
            </div>

            {/* Maximum Salary */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">
                Maximum Salary
              </label>

              <input
                type="number"
                name="maximumSalary"
                min="0"
                placeholder="e.g. 60000"
                className="h-11 w-full rounded-lg border border-white/10 bg-[#111116] px-4 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-violet-500"
              />
            </div>

            {/* Salary Frequency */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">
                Salary Frequency
              </label>

              <select
                name="salaryFrequency"
                defaultValue="monthly"
                className="h-11 w-full rounded-lg border border-white/10 bg-[#111116] px-4 text-sm text-neutral-300 outline-none focus:border-violet-500"
              >
                <option value="hourly">Per Hour</option>
                <option value="daily">Per Day</option>
                <option value="weekly">Per Week</option>
                <option value="monthly">Per Month</option>
                <option value="yearly">Per Year</option>
                <option value="negotiable">Negotiable</option>
              </select>
            </div>

            {/* Deadline */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">
                Application Deadline <span className="text-red-400">*</span>
              </label>

              <div className="relative">
                <CalendarDays className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />

                <input
                  type="date"
                  name="deadline"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="h-11 w-full rounded-lg border border-white/10 bg-[#111116] pl-10 pr-3 text-sm text-neutral-300 outline-none focus:border-violet-500"
                />
              </div>
            </div>

          </div>

          <p className="mt-4 text-xs text-neutral-500">
            Leave the salary fields empty if the compensation is not disclosed.
          </p>
        </section>

        {/* 04. Job Description */}
        <section className="rounded-xl border border-white/10 bg-neutral-900/70 p-5 sm:p-7">

          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
              <FileText size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-white">
                04. Job Description
              </h2>
              <p className="mt-1 text-xs text-neutral-500">
                Tell candidates about the position and what they will do.
              </p>
            </div>
          </div>

          <div className="space-y-5">

            {/* Overview */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">
                Job Overview <span className="text-red-400">*</span>
              </label>

              <textarea
                name="description"
                required
                rows={5}
                placeholder="Describe the role, your company, and what makes this opportunity exciting..."
                className="w-full resize-y rounded-lg border border-white/10 bg-[#111116] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-neutral-600 focus:border-violet-500"
              />
            </div>

            {/* Responsibilities */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">
                Key Responsibilities <span className="text-red-400">*</span>
              </label>

              <textarea
                name="responsibilities"
                required
                rows={5}
                placeholder={"Describe the main responsibilities of this position...\nExample:\n• Build responsive and user-friendly interfaces.\n• Collaborate with designers and backend engineers.\n• Optimize application performance."}
                className="w-full resize-y rounded-lg border border-white/10 bg-[#111116] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-neutral-600 focus:border-violet-500"
              />
            </div>

            {/* Requirements */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">
                Requirements & Qualifications <span className="text-red-400">*</span>
              </label>

              <textarea
                name="requirements"
                required
                rows={5}
                placeholder={"List the skills, qualifications, and experience required...\nExample:\n• 3+ years of experience with React and TypeScript.\n• Strong understanding of DOM performance.\n• Experience working with product teams and UI/UX designers."}
                className="w-full resize-y rounded-lg border border-white/10 bg-[#111116] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-neutral-600 focus:border-violet-500"
              />
            </div>

          </div>
        </section>

        {/* Bottom Actions */}
        <div className="flex flex-col-reverse justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center">

          <Link
            href="/dashboard/recruiter/jobs"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/10 px-5 text-sm font-medium text-neutral-300 transition hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Manage Jobs
          </Link>

          <button
            type="submit"
            disabled={isPublishing}
            // onClick={() => setIsPublishing(true)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-violet-600 px-6 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:opacity-60"
          >
            {isPublishing ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
            Publish Job
          </button>
        </div>

      </form>
    </div>
  );
}
