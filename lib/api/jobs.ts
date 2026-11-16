
const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL

export const getJob = async (query : string = '') => {
  const res = await fetch(`${BASE_URL}/jobs${query}`, {
    cache: "no-store",
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to fetch jobs");
  }

  return result;
};

export const deleteJob = async (id: string) => {
  const res = await fetch(`${BASE_URL}/jobs/${id}`, {
    method: "DELETE",
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to delete job");
  }

  return result;
};
