
import { getJob } from "@/lib/api/jobs";
import BrowseJobsClient from "./browse-jobs-client";


export default async function BrowseJobsPage() {
  const data = await getJob("");

  const jobs = Array.isArray(data) ? data : [];

  return <BrowseJobsClient jobs={jobs} />;
}
