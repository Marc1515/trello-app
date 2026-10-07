import Stripe from "stripe";

let stripe: Stripe | undefined;

export const getStripe = () => {
  if (!stripe) {
    const apiKey = process.env.STRIPE_API_KEY;
    if (!apiKey) throw new Error("STRIPE_API_KEY is required to initialize Stripe");
    stripe = new Stripe(apiKey, {
      apiVersion: "2023-10-16",
      typescript: true,
    });
  }
  return stripe;
};
