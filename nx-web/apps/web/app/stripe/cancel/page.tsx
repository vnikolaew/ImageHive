import React from "react";
import Stripe from "stripe";

export interface PageProps {
   searchParams: { session_id: string };
}

const Page = async (props: PageProps) => {
   const stripe = new Stripe(process.env.STRIPE_API_KEY!);
   const session = await stripe.checkout.sessions.retrieve(props.searchParams.session_id);

   return (
      <div className={`m-12`}>
         <h2>Back from Stripe Checkout!</h2>
         <span>The payment for session {session.id} was cancelled.</span>
      </div>
   );
};

export default Page;
