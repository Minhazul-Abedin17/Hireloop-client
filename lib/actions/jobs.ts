const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const createJob = async (data: Record<string, unknown>) => {
  const res = await fetch(`${BASE_URL}/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to create job");
  }

  return result;
};