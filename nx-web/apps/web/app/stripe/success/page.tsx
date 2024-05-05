import React from "react";
import { stripeService } from "@web/lib/stripe";
import { Card, CardContent, CardDescription, CardHeader } from "@components/card";

export interface PageProps {
   searchParams: { session_id: string };
}


const Page = async (props: PageProps) => {
   const [session, products, prices] = await Promise.all([
      stripeService.getCheckoutSession(props.searchParams.session_id),
      stripeService.listProducts(),
      stripeService.listPrices(),
   ]);

   if (typeof session.invoice === `string`) {
      const invoice = await stripeService.listInvoice(session.invoice);
      console.log({ invoice });
   }
   console.log({ session, products: products.data, prices: prices.data });

   return (
      <div className={`m-12`}>
         <h2>Back from Stripe Checkout!</h2>
         <div>Session:
            <pre className={`text-xs`}>
               {JSON.stringify(session ?? {}, null, 2)}
            </pre>
         </div>
         <div className={`mt-4`}>Products:
            {products.data.map((product, i) => (
               <div key={i}>
                  <Card className={`w-[300px] mt-4`}>
                     <CardHeader className={`py-3`}>
                        {product.name}
                     </CardHeader>
                     <CardDescription className={`mx-6`}>{product.description}</CardDescription>
                     <CardContent className={`mt-4 text-neutral-700`}>
                        {new Intl.NumberFormat(`bg`, { style: `decimal` }).format(prices.data.find(p => p.product === product.id)?.unit_amount! / 100)}
                        {` `}
                        {prices.data.find(p => p.product === product.id)?.currency.toUpperCase()}
                     </CardContent>
                  </Card>
               </div>
            ))}
         </div>
      </div>
   );
};

export default Page;
