import { Application } from "@/app/dashboard/applications/ApplicationsComponents";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:8000";

interface ApplicationData {
  jobId: string;
  userId: string;
  email: string;
}

// Apply for a Job
export async function applyToAJob(data: ApplicationData) {
  const res = await fetch(`${BASE_URL}/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to submit application");
  }

  return result;
}

// Get My Applications
export async function getMyApplications(userId: string) {
  const res = await fetch(
    `${BASE_URL}/applications?userId=${encodeURIComponent(userId)}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const result = await res.json();
    throw new Error(result.message || "Failed to fetch applications");
  }

  const applications: Application[] = await res.json();

  // Get Job Details
  const updatedApplications = await Promise.all(
    applications.map(async (application) => {
      const jobRes = await fetch(
        `${BASE_URL}/jobs/${application.jobId}`,
        {
          cache: "no-store",
        }
      );

      if (!jobRes.ok) {
        return application;
      }

      const job = await jobRes.json();

      return {
        ...application,
        jobTitle: job.jobTitle || job.title || "Untitled Position",
        companyName: job.companyName || job.company || "Unknown Company",
        jobType: job.jobType || job.type || "Full-time",
        isRemote: job.isRemote || false,
      };
    })
  );

  return updatedApplications;
}

// Get Applications Count
export async function getApplicationsCount(
  userId: string
): Promise<{ count: number }> {
  const res = await fetch(
    `${BASE_URL}/applications/count?userId=${encodeURIComponent(userId)}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to get application count");
  }

  return res.json();
}
