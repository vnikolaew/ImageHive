"use server";
import Stripe from "stripe";
import Cors from 'micro-cors';

import { NextResponse, NextRequest } from "next/server";
import { headers } from "next/headers";

const stripe = new Stripe(`sk_test_51PBVa0GMcvfVS8m1RoDohKyioioLEB4Y459J0EOS0GsxzciBlaXSKSehbHC5UMBsQZ2QnP4jZHKfS9RFF34qUU5k00lQwSMySi`);
const secret = process.env.STRIPE_WEBHOOK_SECRET || "";

const cors = Cors({
   allowMethods: ['POST', 'HEAD'],
});

export async function POST(req: NextRequest, res: NextResponse) {

   const payload = await req.text();
   const response = JSON.parse(payload);

   const signature = headers().get("stripe-signature")!;
   try {
      const event = stripe.webhooks.constructEvent(payload, signature, secret);
      console.log(`event`, event.type);

      return NextResponse.json({ status: `Success`, event });
   } catch (error) {
      return NextResponse.json({ status: `Failed`, error });
   }
}

export async function GET(req: NextRequest, res: NextResponse) {
   try {
      return NextResponse.json({ status: `Success`, ok: true });
   } catch (error) {
      return NextResponse.json({ status: `Failed`, error });
   }
}
