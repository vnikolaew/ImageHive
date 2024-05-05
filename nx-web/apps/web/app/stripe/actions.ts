"use server";

import Stripe from "stripe";
import { redirect } from "next/navigation";

type Product = { name: string, price: number }

export async function createStripeCheckoutSession(products: Product[]) {
   const stripe = new Stripe(`sk_test_51PBVa0GMcvfVS8m1RoDohKyioioLEB4Y459J0EOS0GsxzciBlaXSKSehbHC5UMBsQZ2QnP4jZHKfS9RFF34qUU5k00lQwSMySi`);

   const session = await stripe.checkout.sessions.create({
      // line_items: [
      //    {
      //       price_data: {
      //          currency: "bgn",
      //          product: `prod_Q1YrwrG2r0fqqu`,
      //          recurring: {
      //             interval: `month`,
      //          },
      //          unit_amount: 199,
      //       },
      //       quantity: 1,
      //    },
      // ],
      line_items: products.map((product: Product) => ({
         quantity: 1,
         price_data: {
            unit_amount: new Intl.NumberFormat("en-US", {}).format(product.price * 100) ,
            product_data:{
               name: product.name,
            },
            currency: `bgn`,
         },
      })),
      mode: "payment",
      success_url: `${process.env.BASE_URL}/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/stripe/cancel?session_id={CHECKOUT_SESSION_ID}`,
   });
   console.log({ session });

   if (session.url) {
      redirect(session.url);
   } else return { ok: true };
}
