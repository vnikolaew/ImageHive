import React from "react";
import Image from "next/image";
import Link from "next/link";
import { stripeService } from "@web/lib/stripe";
import { Card, CardContent, CardFooter, CardHeader } from "@components/card";
import { Button } from "@components/button";

export interface PageProps {
}

const Page = async ({}: PageProps) => {
   const links = await stripeService.listPaymentLinks();
   const products = await stripeService.listProducts();
   const prices = await stripeService.listPrices();

   console.log({ links: links.data });

   return (
      <div className={`m-12 grid grid-cols-2 w-full`}>
         <div className={`flex flex-col gap-8`}>
            {products.data.map((product, i) => (
               <Card key={i} className={`min-w-[500px] !w-fit bg-muted`}>
                  <CardHeader className={`!pb-1 !pt-4 text-xl font-semibold`}>{product.name}</CardHeader>
                  <CardContent className={` !w-fit flex items-center gap-4 mt-4`}>
                     <Image alt={product.name} className={`rounded-lg`} height={100} width={100}
                            src={product.images[0]} />
                     <div className={`flex flex-col gap-2 items-start`}>
                        <p className={`text-sm text-neutral-500`}>
                           {product.description}
                        </p>
                        <span className={`text-sm text-neutral-500 font-semibold`}>
                           {prices.data.find(p => p.id === product.default_price)?.currency.toUpperCase()}
                           {` `}
                           {(prices.data.find(p => p.id === product.default_price)?.unit_amount as number) / 100}
                        </span>
                     </div>
                  </CardContent>
                  <CardFooter className={`w-full flex items-center justify-end border-t-[1px] border-neutral-200 py-2`}>
                     <Button className={`!px-8 justify-self-end shadow-md`} asChild variant={`default`}>
                        <Link  href={links.data.find(l => l.id === product.metadata.p_link as string)?.url!}>
                           Subscribe
                        </Link>
                     </Button>
                  </CardFooter>
               </Card>
            ))}
         </div>
      </div>
   );
};

export default Page;
