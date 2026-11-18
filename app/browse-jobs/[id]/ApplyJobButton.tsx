
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { ArrowUpRight, Loader2, Check } from "lucide-react";
import {
  applyToAJob,
  getApplicationsCount,
  checkApplication,
} from "@/lib/actions/application";
import { toast } from "react-toastify";
import { getUserPremiumById } from "@/lib/api/user";

export default function ApplyJobButton({
  jobId,
}: {
  jobId: string;
}) {
  const router = useRouter();
  const { data: session } = useSession();

  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [applied, setApplied] = useState(false);

  const user = session?.user;

  // Check if already applied
  useEffect(() => {
    if (!user?.id) {
      setChecking(false);
      return;
    }

    const checkStatus = async () => {
      const result = await checkApplication(jobId, user.id);

      setApplied(result.applied);
      setChecking(false);
    };

    checkStatus();
  }, [jobId, user?.id]);

  const handleApply = async () => {
    if (!user) {
      router.push("/signIn");
      return;
    }

    if (user.role !== "seeker") {
      toast.error("Only job seekers can apply for jobs.");
      return;
    }

    if (!user.email) {
      toast.error("Your email address is missing.");
      return;
    }

    if (applied) {
      toast.info("You have already applied for this job.");
      return;
    }

    setLoading(true);

    // Check application count
    const countResult = await getApplicationsCount(user.id);

    // Check premium membership
    const premiumResult = await getUserPremiumById(user.id);

    // Free application limit: 2
    if (!premiumResult.premium && countResult.count >= 2) {
      setLoading(false);
      router.push("/payment");
      return;
    }

    // Submit application
    const result = await applyToAJob({
      jobId,
      userId: user.id,
      email: user.email,
    });

    if (result.success && result.insertedId) {
      setApplied(true);
      toast.success("Application submitted successfully!");
      router.push("/dashboard/seeker/applications");
    } else {
      if (result.message?.includes("already applied")) {
        setApplied(true);
      }

      toast.error(result.message || "Failed to submit application.");
    }

    setLoading(false);
  };

  const isDisabled = loading || checking || applied;

  return (
    <button
      type="button"
      onClick={handleApply}
      disabled={isDisabled}
      className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {checking ? (
        <>
          <Loader2 size={17} className="animate-spin" />
          Checking...
        </>
      ) : loading ? (
        <>
          <Loader2 size={17} className="animate-spin" />
          Applying...
        </>
      ) : applied ? (
        <>
          <Check size={17} />
          Already Applied
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
