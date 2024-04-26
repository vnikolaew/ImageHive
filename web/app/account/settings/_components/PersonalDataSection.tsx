"use client";
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField, Form, FormItem, FormControl, FormDescription, FormLabel, FormMessage } from "@/components/ui/form";
import { useSession } from "next-auth/react";
import { getSessionImageSrc } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export interface PersonalDataSectionProps {
}

const formSchema = z.object({
   username: z.string(),
   profileImage: z.instanceof(File).nullable(),
   gender: z.union([
      z.literal(`Male`), z.literal(`Female`),
      z.literal(`Unspecified`),
   ]),
   firstName: z.string(),
   lastName: z.string(),
   city: z.string(),
   country: z.string(),
   dob: z.date().nullable(),
   aboutMe: z.string(),
});

type FormValues = z.infer<typeof formSchema>

const PersonalDataSection = ({}: PersonalDataSectionProps) => {
   const session = useSession();
   const form = useForm<FormValues>({
      resolver: zodResolver(formSchema),
      reValidateMode: `onChange`,
      defaultValues: {
         username: session.data?.user?.name!,
         profileImage: getSessionImageSrc(session.data?.user?.image!),
         firstName: ``,
         lastName: ``,
         city: ``,
         country: ``,
         dob: null,
         aboutMe: ``,
         gender: `Unspecified`,
      },
   });

   function onSubmit() {

   }

   return (
      <div>
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 !h-full">
               <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                     <FormItem className={`!mt-8 w-2/3 mx-auto flex items-center gap-4`}>
                        <FormLabel className={`min-w-[100px] text-right`}>Username</FormLabel>
                        <FormControl className={`!mt-0`}>
                           <Input placeholder="" {...field} />
                        </FormControl>
                        <FormDescription>
                        </FormDescription>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="profileImage"
                  render={({ field }) => (
                     <FormItem className={`!mt-8 w-2/3 mx-auto flex items-center gap-4`}>
                        <FormLabel  className={`min-w-[100px] text-right`}>Profile image</FormLabel>
                        <FormControl className={`!mt-0`}>
                           <input hidden type={`fil`} placeholder="" />
                        </FormControl>
                        <FormDescription>
                        </FormDescription>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                     <FormItem className={`!mt-8 w-2/3 mx-auto flex items-center gap-4`}>
                        <FormLabel className={`min-w-[100px] text-nowrap text-right`} >First name</FormLabel>
                        <FormControl className={`!mt-0`}>
                           <Input placeholder="" {...field} />
                        </FormControl>
                        <FormDescription>
                        </FormDescription>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                     <FormItem className={`!mt-8 w-2/3 mx-auto flex items-center gap-4`}>
                        <FormLabel className={`min-w-[100px] text-nowrap text-right`}>Last name</FormLabel>
                        <FormControl className={`!mt-0`}>
                           <Input placeholder="" {...field} />
                        </FormControl>
                        <FormDescription>
                        </FormDescription>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                     <FormItem className={`!mt-8 w-2/3 mx-auto flex items-center gap-4`}>
                        <FormLabel className={`min-w-[100px] text-nowrap text-right`}>City</FormLabel>
                        <FormControl className={`!mt-0`}>
                           <Input placeholder="" {...field} />
                        </FormControl>
                        <FormDescription>
                        </FormDescription>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                     <FormItem className={`!mt-8 w-2/3 mx-auto flex items-center gap-4`}>
                        <FormLabel className={`min-w-[100px] text-nowrap text-right`}>Country</FormLabel>
                        <FormControl className={`!mt-0`}>
                           <Input placeholder="" {...field} />
                        </FormControl>
                        <FormDescription>
                        </FormDescription>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="aboutMe"
                  render={({ field }) => (
                     <FormItem className={`!mt-8 w-2/3 mx-auto flex items-center gap-4`}>
                        <FormLabel className={`min-w-[100px] text-nowrap text-right`}>About</FormLabel>
                        <FormControl className={`!mt-0`}>
                           <Textarea placeholder="" {...field} />
                        </FormControl>
                        <FormDescription>
                        </FormDescription>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <div className={`w-full flex flex-1 justify-end gap-2 justify-self-end`}>
               </div>
            </form>
         </Form>
      </div>
   );
};

export default PersonalDataSection;