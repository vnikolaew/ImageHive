"use server";

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

const stripe = require("stripe")(`sk_test_51PBVa0GMcvfVS8m1RoDohKyioioLEB4Y459J0EOS0GsxzciBlaXSKSehbHC5UMBsQZ2QnP4jZHKfS9RFF34qUU5k00lQwSMySi`);
const secret = process.env.STRIPE_WEBHOOK_SECRET || "";

let REQUEST_COUNT = 0;

const handler = async (req: NextRequest) => {
   REQUEST_COUNT++;

   const body = await req.text();
   if (!body.length) return NextResponse.json({
      ok: false,
      message: `Payload length is ${body.length}`,
      REQUEST_COUNT,
   }, { status: 200 });

   const signature = headers().get("stripe-signature");
   const event = stripe.webhooks.constructEvent(body, signature, secret);

   console.log(`New event of type: ${event.type}`);
   console.log({ event });
   if (event.type === `checkout.session.completed`) {
      console.log({ data: event.data.object });
   }
   return NextResponse.json({ ok: true, event, REQUEST_COUNT }, { status: 200 });
};

export { handler as POST };