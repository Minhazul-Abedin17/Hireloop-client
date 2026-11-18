
import { NextResponse } from "next/server";

import { getSession } from "@/lib/core/server";
import { stripe } from "@/app/dashboard/recruiter/jobs/lib/stripe";

export async function POST() {
  const userSession = await getSession();

  if (!userSession?.user?.email) {
    return NextResponse.redirect(
      new URL("/signIn", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000")
    );
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: "price_1UcgFpRhffgCdYAGpEQ46c2m",
        quantity: 1,
      },
    ],
    mode: "payment",
    customer_email: userSession.user.email,

    success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/payment?canceled=true`,
  });

  if (!session.url) {
    return NextResponse.json(
      { message: "Unable to create Stripe checkout session." },
      { status: 500 }
    );
  }

  return NextResponse.redirect(session.url, 303);
}
