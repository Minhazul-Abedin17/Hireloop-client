
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { applyToAJob } from "@/lib/actions/application";

export default function ApplyJobButton({
  jobId,
}: {
  jobId: string;
}) {
  const router = useRouter();
  const { data: session } = useSession();

  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    const user = session?.user;

    // Check login
    if (!user) {
      router.push("/signIn");
      return;
    }

    // Check user role
    if (user.role !== "seeker") {
      alert("Only job seekers can apply for jobs.");
      return;
    }

    try {
      setLoading(true);

      const application = {
        jobId: jobId,
        userId: user.id,
        email: user.email,
      };

      const result = await applyToAJob(application);

      if (result.insertedId) {
        alert("Application submitted successfully!");
        router.push("/dashboard/seeker/applications");
      } else {
        alert(result.message || "Failed to submit application.");
      }
    } catch (error) {
      console.error("Application Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleApply}
      disabled={loading}
      className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? (
        <>
          <Loader2 size={17} className="animate-spin" />
          Applying...
        </>
      ) : (
        <>
          Apply for this Job
          <ArrowUpRight size={17} />
        </>
      )}
    </button>
  );
}
