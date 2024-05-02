"use client";
import React from "react";
import { z } from "zod";
import { Form, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModalType, useModals } from "../../providers/ModalsProvider";
import {
  API_ROUTES,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger, FormControl, FormField, FormItem, FormMessage,
  HTTP, Input,
} from "@nx-web/shared";

const formSchema = z.object({
   email: z.string().email({ message: `Please enter valid e-mail address.` }),
});

type FormValues = z.infer<typeof formSchema>

const ForgotPasswordModal = () => {
   const { modal, toggleModal } = useModals();
   const form = useForm<FormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         email: ``,
      },
   });

   async function onSubmit(values: FormValues) {
      fetch(API_ROUTES.FORGOT_PASSWORD, {
         method: "POST",
         body: JSON.stringify(values),
         headers: {
            "Content-Type": HTTP.MEDIA_TYPES.APPLICATION_JSON,
            "Accept": HTTP.MEDIA_TYPES.APPLICATION_JSON,
         },
      }).then(res => res.json()).then(console.log).catch(console.error);

   }

   if (modal !== ModalType.FORGOT_PASSWORD) return null;

   return (
      <Dialog onOpenChange={_ => toggleModal(ModalType.FORGOT_PASSWORD)} open>
         <DialogTrigger></DialogTrigger>
         <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
               <DialogTitle className={`text-center text-2xl`}>Forgot your password?</DialogTitle>
               <DialogDescription className={`!mt-8 text-slate-500 text-sm`}>
                  Do not worry! Fill in your email below and we&apos;ll send you a link to reset your password:
               </DialogDescription>
            </DialogHeader>
            <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex flex-col w-full items-center">
                  <FormField
                     control={form.control}
                     name="email"
                     render={({ field }) => (
                        <FormItem className={`!mt-4 w-3/4`}>
                           {/*<FormLabel>Username</FormLabel>*/}
                           <FormControl className={`!mt-1`}>
                              <Input type={`email`} required placeholder="e.g. jack123@example.com" {...field} />
                           </FormControl>
                           <FormMessage className={`text-xs font-normal !mt-1`} />
                        </FormItem>
                     )}
                  />
                  <Button
                     variant={`secondary`}
                     className={`!px-6 rounded-full mt-2 shadow-md w-3/4 `}
                     type="submit">Reset your password</Button>
               </form>
            </Form>

         </DialogContent>
      </Dialog>
   );
};

export default ForgotPasswordModal;
