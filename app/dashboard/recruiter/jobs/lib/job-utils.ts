
import type { LucideIcon } from "lucide-react";
import {
  Code2,
  Palette,
  Network,
  Megaphone,
  Users,
  BriefcaseBusiness,
} from "lucide-react";

export type Job = {
  _id: string;

  // New data format
  jobTitle?: string;
  companyName?: string;
  category?: string;
  jobType?: string;
  isRemote?: boolean;
  minimumSalary?: number | null;
  maximumSalary?: number | null;
  salaryFrequency?: string;

  // Old data format
  title?: string;
  dept?: string;
  company?: string;
  type?: string;
  compensation?: string;
  status?: string;

  // Common fields
  location?: string;
  deadline?: string;
  applicants?: number;
};

export type JobStatus = "Active" | "Expired";

export type NormalizedJob = Job & {
  jobTitle: string;
  companyName: string;
  category: string;
  jobType: string;
  location: string;
  applicants: number;
  isRemote: boolean;
};

// Old and new data format handle
export function normalizeJob(job: Job): NormalizedJob {
  return {
    ...job,
    jobTitle: job.jobTitle || job.title || "Untitled Job",
    companyName: job.companyName || job.company || "Unknown Company",
    category: job.category || job.dept || "Other",
    jobType: job.jobType || job.type || "Not specified",
    location: job.location || "Not specified",
    applicants: job.applicants ?? 0,
    isRemote:
      job.isRemote ??
      (job.location?.toLowerCase().includes("remote") || false),
  };
}

// Category icons
export const categoryIcons: Record<string, LucideIcon> = {
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

// Get job status
export function getJobStatus(job: Job): JobStatus {
  if (job.status === "Active" || job.status === "Expired") {
    return job.status;
  }

  if (!job.deadline) return "Active";

  const deadline = new Date(job.deadline);
  deadline.setHours(23, 59, 59, 999);

  return deadline < new Date() ? "Expired" : "Active";
}

// Format salary
export function getJobSalary(job: Job): string {
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
}

// Format deadline
export function formatJobDate(date?: string): string {
  if (!date) return "Not specified";

  const parsedDate = new Date(date);

  if (isNaN(parsedDate.getTime())) return date;

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
