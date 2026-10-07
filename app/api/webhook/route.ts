import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { getDb } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import { createDefaultBoardsForNewOrganization } from "@/lib/create-default-boards-for-new-org";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    return new NextResponse("Webhook error", { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const subscription = await getStripe().subscriptions.retrieve(
      session.subscription as string
    );

    if (!session?.metadata?.orgId) {
      return new NextResponse("Org ID is required", { status: 400 });
    }

    await getDb().orgSubscription.create({
      data: {
        orgId: session?.metadata?.orgId,
        stripeSupscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    });
  }
  if (event.type === "invoice.payment_succeeded") {
    const subscription = await getStripe().subscriptions.retrieve(
      session.subscription as string
    );

    await getDb().orgSubscription.update({
      where: {
        stripeSupscriptionId: subscription.id,
      },
      data: {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    });
  }
  return new NextResponse(null, { status: 200 });
}
