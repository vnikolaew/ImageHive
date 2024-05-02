"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createStripeCheckoutSession } from "@/app/stripe/actions";
import Link from "next/link";

export interface PageProps {
}

const productsSchema = z.object({
   products: z.array(z.object({
      name: z.string(),
      price: z.preprocess(a => parseFloat(z.string().parse(a)), z.number({
         invalid_type_error: `Price must be a number`
      }))
   })),
});

export type Products = z.infer<typeof productsSchema>

const Page = ({}: PageProps) => {
   const form = useForm<Products>({
      resolver: zodResolver(productsSchema),
      defaultValues: {
         products: [],
      },
   });
   const { update, append, insert, fields, remove } = useFieldArray({
      control: form.control,
      name: "products",
   });

   async function onSubmit(values: Products) {
      console.log({ values });
      await createStripeCheckoutSession(values.products)
   }

   return (
      <div className={`m-12`}>
         <Button asChild className={`px-8 my-8 shadow-md !w-fit`} variant={`default`} type="submit">
            <Link href={`https://buy.stripe.com/test_fZe2aW7ETfWXaxa3cc`}>
               Checkout with pre-made link
            </Link>
         </Button>
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex flex-col">
               {fields.map((field, index) => (
                  <div key={field.id} className={`!mt-4 flex items-center gap-2`}>
                     <FormField
                        control={form.control}
                        name={`products.${index}.name`}
                        render={({ field }) => (
                           <FormItem className={`!mt-4`}>
                              <FormLabel>Product name</FormLabel>
                              <FormControl className={`!mt-1`}>
                                 <Input type={`text`} required placeholder="e.g. banana" {...field} />
                              </FormControl>
                              <FormDescription>
                                 Enter the name of the product.
                              </FormDescription>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={form.control}
                        name={`products.${index}.price`}
                        render={({ field }) => (
                           <FormItem className={`!mt-4`}>
                              <FormLabel>Product price</FormLabel>
                              <FormControl className={`!mt-1`}>
                                 <Input inputMode={`decimal`} min={`0`} max={`1000`} step={`0.01`} type={`number`} required placeholder="e.g. $0.00" {...field} />
                              </FormControl>
                              <FormDescription>
                                 Enter the price of the product.
                              </FormDescription>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>
               ))}
               <Button
                  onClick={_ => append({ name: ``, price: 0.00 })}
                  className={`px-8 shadow-md !w-fit`} variant={`default`}
                  type="submit">Add a new product</Button>
               <Button className={`px-8 shadow-md !w-fit`} variant={`default`} type="submit">Checkout</Button>
            </form>
         </Form>
      </div>
   );
};

export default Page;