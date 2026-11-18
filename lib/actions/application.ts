
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Apply for a Job
export const applyToAJob = async (application: {
  jobId: string;
  userId: string;
  email: string;
}) => {
  const res = await fetch(`${BASE_URL}/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(application),
  });

  return res.json();
};

// Get Applications Count
export const getApplicationsCount = async (userId: string) => {
  const res = await fetch(
    `${BASE_URL}/applications/count?userId=${userId}`,
    { cache: "no-store" }
  );

  return res.json();
};

// Check if Already Applied
export const checkApplication = async (
  jobId: string,
  userId: string
) => {
  const res = await fetch(
    `${BASE_URL}/applications/check?jobId=${jobId}&userId=${userId}`,
    { cache: "no-store" }
  );

  return res.json();
};

// Get My Applications
export const getMyApplications = async (userId: string) => {
  const res = await fetch(
    `${BASE_URL}/applications?userId=${userId}`,
    { cache: "no-store" }
  );

  return res.json();
};
