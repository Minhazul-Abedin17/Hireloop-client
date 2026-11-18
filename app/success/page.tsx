import { redirect } from "next/navigation"
import { CheckCircle2, ShieldCheck, BriefcaseBusiness } from "lucide-react"
import { checkoutVerify } from "@/lib/actions/payments"

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams

  if (!session_id) {
    redirect("/payment")
  }

  // Verify payment from backend
  const result = await checkoutVerify(session_id)

  console.log("Payment verification:", result)

  // Backend response থেকে session নেওয়া
  if (!result.success) {
    redirect("/payment")
  }

  const session = result.session

  if (session.status === "open") {
    redirect("/payment")
  }

  if (session.status !== "complete" || session.payment_status !== "paid") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#09090b] px-4 text-white">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111114] p-8 text-center">
          <h1 className="text-2xl font-bold">Payment not completed</h1>

          <p className="mt-3 text-sm text-gray-400">
            We could not confirm your payment. Please try again.
          </p>

          <a
            href="/payment"
            className="mt-6 inline-block rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold hover:bg-violet-500"
          >
            Back to Payment
          </a>
        </div>
      </main>
    )
  }

  const customerEmail =
    session.customer_details?.email || session.customer_email

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#09090b] px-4 py-10 text-white">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#111114] p-7 text-center shadow-2xl sm:p-10">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
          <CheckCircle2 size={44} className="text-green-400" />
        </div>

        <div className="mt-6">
          <p className="text-sm font-medium text-green-400">
            Payment Successful
          </p>

          <h1 className="mt-2 text-3xl font-bold">Thank You!</h1>

          <p className="mt-3 text-sm leading-6 text-gray-400">
            Your payment has been received successfully. Welcome to HireLoop
            Pro!
          </p>
        </div>

        <div className="mt-8 rounded-xl border border-white/10 bg-[#18181b] p-5 text-left">
          <div className="flex items-center gap-3">
            <BriefcaseBusiness className="text-violet-400" size={23} />

            <div>
              <p className="font-semibold">HireLoop Pro</p>
              <p className="text-xs text-gray-500">Pro membership payment</p>
            </div>
          </div>

          <div className="my-4 border-t border-white/10" />

          <div className="flex justify-between gap-3 text-sm">
            <span className="text-gray-400">Payment status</span>
            <span className="font-medium text-green-400">Paid</span>
          </div>

          <div className="mt-3 flex justify-between gap-3 text-sm">
            <span className="text-gray-400">Amount paid</span>
            <span className="font-semibold">
              {session.currency?.toUpperCase()}{" "}
              {((session.amount_total || 0) / 100).toFixed(2)}
            </span>
          </div>

          {customerEmail && (
            <div className="mt-3 flex justify-between gap-3 text-sm">
              <span className="text-gray-400">Email</span>
              <span className="text-right break-all">{customerEmail}</span>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-xl border border-green-500/10 bg-green-500/5 p-4 text-left">
          <ShieldCheck size={20} className="shrink-0 text-green-400" />

          <p className="text-xs leading-5 text-gray-400">
            Your payment has been verified by Stripe. Thank you for choosing
            HireLoop.
          </p>
        </div>

        <a
          href="/dashboard/seeker"
          className="mt-8 flex w-full items-center justify-center rounded-xl bg-violet-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-500"
        >
          Go to Dashboard
        </a>

        <p className="mt-5 text-xs text-gray-600">
          Thank you for choosing HireLoop.
        </p>
      </div>
    </main>
  )
}
