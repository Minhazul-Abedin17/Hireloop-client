
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { ArrowUpRight, Loader2 } from "lucide-react";
import {
  applyToAJob,
  getApplicationsCount,
} from "@/lib/actions/application";
import { toast } from "react-toastify";

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
      toast.error("Only job seekers can apply for jobs.");
      return;
    }

    if (!user.email) {
      toast.error("Your email address is missing.");
      return;
    }

    try {
      setLoading(true);
      // Check application count before applying
      const countResult = await getApplicationsCount(user.id);

      // Free application limit: 8
      if (countResult.count >= 8) {
        router.push("/payment");
        return;
      }

      // Submit application
      const result = await applyToAJob({
        jobId,
        userId: user.id,
        email: user.email,
      });

      if (result.insertedId) {
        toast.success("Application submitted successfully!");
        router.push("/dashboard/seeker/applications");
      } else {
        alert(result.message || "Failed to submit application.");
      }
    } catch (error) {
      toast.error("Application Error:");
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
