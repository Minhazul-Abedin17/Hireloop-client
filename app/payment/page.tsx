
"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  LockKeyhole,
  ArrowRight,
  BriefcaseBusiness,
  Sparkles,
} from "lucide-react";

export default function PaymentPage() {
  const [paymentCanceled, setPaymentCanceled] = useState(false);

  // Check if payment was canceled
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("canceled") === "true") {
      setPaymentCanceled(true);
    }
  }, []);

  const features = [
    "Access to all Pro features",
    "Enhanced job application experience",
    "Manage your applications easily",
    "A better job search experience",
  ];

  return (
    <div className="min-h-screen bg-[#09090b] px-4 py-10 text-white sm:px-6 lg:py-16">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8 text-center sm:mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
            <LockKeyhole size={15} />
            Secure Checkout
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Complete Your{" "}
            <span className="text-violet-400">Payment</span>
          </h1>

          <p className="mt-3 text-sm text-gray-400 sm:text-base">
            Upgrade your HireLoop experience with our Pro Plan.
          </p>
        </div>

        {/* Payment Canceled Message */}
        {paymentCanceled && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            Your payment was canceled. You can try again whenever you're ready.
          </div>
        )}

        {/* Main Payment Card */}
        <div className="grid overflow-hidden rounded-2xl border border-white/10 bg-[#111114] shadow-2xl lg:grid-cols-2">

          {/* Left Side - Plan Details */}
          <div className="border-b border-white/10 bg-gradient-to-br from-violet-950/60 to-[#111114] p-6 sm:p-8 lg:border-r lg:border-b-0">

            {/* Plan Header */}
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600/20 text-violet-400">
                <BriefcaseBusiness size={25} />
              </div>

              <div>
                <p className="text-sm text-gray-400">
                  Your selected plan
                </p>
                <h2 className="text-xl font-bold">
                  HireLoop Pro
                </h2>
              </div>
            </div>

            {/* Price */}
            <div className="mt-10">
              <p className="text-sm text-gray-400">
                Total amount
              </p>

              <div className="mt-2 flex items-end gap-2">
                <h3 className="text-4xl font-bold tracking-tight sm:text-5xl">
                  $20.00
                </h3>

                <span className="mb-1 text-sm text-gray-500">
                  USD
                </span>
              </div>

              <p className="mt-3 text-sm text-gray-400">
                Amount payable at checkout
              </p>
            </div>

            <div className="my-8 border-t border-white/10" />

            {/* Features */}
            <div>
              <h3 className="mb-5 flex items-center gap-2 font-semibold">
                <Sparkles size={18} className="text-violet-400" />
                What&apos;s included
              </h3>

              <div className="space-y-4">
                {features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-start gap-3 text-sm text-gray-300"
                  >
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-violet-400"
                    />

                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Plan Note */}
            <div className="mt-10 rounded-xl border border-violet-500/20 bg-violet-500/10 p-4">
              <p className="text-sm leading-6 text-gray-300">
                <span className="font-semibold text-violet-300">
                  Upgrade your career journey.
                </span>{" "}
                Get access to the tools you need to make your job search easier.
              </p>
            </div>
          </div>

          {/* Right Side - Checkout */}
          <div className="p-6 sm:p-8">

            <div className="mb-8">
              <h2 className="text-xl font-bold">
                Payment Information
              </h2>

              <p className="mt-2 text-sm text-gray-400">
                Review your order and continue to secure checkout.
              </p>
            </div>

            {/* Payment Method */}
            <div className="rounded-xl border border-violet-500/30 bg-violet-500/10 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/20 text-violet-300">
                  <CreditCard size={21} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-medium text-white">
                    Secure Online Payment
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Pay securely through Stripe Checkout
                  </p>
                </div>

                <CheckCircle2
                  size={20}
                  className="shrink-0 text-violet-400"
                />
              </div>
            </div>

            {/* Order Summary */}
            <div className="mt-8">
              <p className="mb-3 text-sm text-gray-400">
                Order Summary
              </p>

              <div className="rounded-xl border border-white/10 bg-[#18181b] p-4">

                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">
                      HireLoop Pro Plan
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Pro membership
                    </p>
                  </div>

                  <p className="font-semibold">
                    $20.00
                  </p>
                </div>

                <div className="my-4 border-t border-white/10" />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    Total
                  </span>

                  <span className="text-xl font-bold text-violet-400">
                    $20.00
                  </span>
                </div>
              </div>
            </div>

            {/* Security Information */}
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-white/10 p-4">
              <ShieldCheck
                size={22}
                className="shrink-0 text-green-400"
              />

              <div>
                <p className="text-sm font-medium">
                  Your payment is secure
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-400">
                  Your payment will be processed through Stripe&apos;s secure
                  checkout. Your card details will not be stored on HireLoop.
                </p>
              </div>
            </div>

            {/* Stripe Checkout Button */}
            <form
              action="/api/checkout_sessions"
              method="POST"
              className="mt-6"
            >
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-500 active:scale-[0.98]"
              >
                Continue to Payment
                <ArrowRight size={18} />
              </button>
            </form>

            {/* Security Footer */}
            <p className="mt-4 text-center text-xs text-gray-500">
              <LockKeyhole size={12} className="mr-1 inline" />
              Secure checkout powered by Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
