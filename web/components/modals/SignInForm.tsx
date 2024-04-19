"use client";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PASSWORD_REGEX, SocialLogins } from "@/components/modals/SignUpForm";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ModalType } from "@/providers/ModalsProvider";

const formSchema = z.object({
   usernameOrEmail: z.string().min(2).max(50),
   password: z.string().min(6).max(50).regex(PASSWORD_REGEX),
});

type FormValues = z.infer<typeof formSchema>

const SignInForm = () => {
   const form = useForm<FormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         usernameOrEmail: "",
         password: ``,
      },
   });
   const [showPassword, setShowPassword] = useState(false);
   const PasswordIcon = useMemo(() => {
      return showPassword ? EyeOffIcon : EyeIcon;
   }, [showPassword]);

   // 2. Define a submit handler.
   function onSubmit(values: FormValues) {
      // ✅ This will be type-safe and validated.
      console.log(values);
   }

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex flex-col">
            <FormField
               control={form.control}
               name="usernameOrEmail"
               render={({ field }) => (
                  <FormItem className={`!mt-4`}>
                     <FormLabel>Username or E-mail</FormLabel>
                     <FormControl className={`!mt-1`}>
                        <Input type={`text`} required placeholder="e.g. jack123 or jack123@example.com" {...field} />
                     </FormControl>
                     <FormDescription>
                     </FormDescription>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <FormField
               control={form.control}
               name="password"
               render={({ field }) => (
                  <FormItem className={`!mt-6`}>
                     <FormLabel>Password</FormLabel>
                     <FormControl className={`!mt-1`}>
                        <div className={`relative`}>
                           <Input required type={showPassword ? `text` : `password`}
                                  placeholder="e.g. jack@example.com" {...field} />
                           <PasswordIcon
                              onClick={_ => setShowPassword(!showPassword)}
                              className={`w-4 h-4 absolute right-3 top-3 cursor-pointer`} />
                        </div>
                     </FormControl>
                     <FormDescription>
                        <Button size={`sm`} className={`text-xs !mx-0 !px-0`} variant={`link`} asChild>
                           <Link href={`/?modal=${ModalType.FORGOT_PASSWORD}`}>
                              Forgot your password?
                           </Link>
                        </Button>
                     </FormDescription>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <div className={`flex items-center gap-3`}>
               <Separator className={`w-full flex-1`} />
               <span className={`text-sm text-neutral-500`}>OR</span>
               <Separator className={`w-full flex-1`} />
            </div>
            <SocialLogins />
            <Button className={`self-end !px-8 rounded-full mt-4 shadow-md`} type="submit">Sign in</Button>
         </form>
      </Form>
   );
};

export default SignInForm;