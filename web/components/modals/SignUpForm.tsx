"use client";
import React, { useMemo, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { EyeIcon, EyeOffIcon, Loader, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
//@ts-ignore
import { UilGoogle, UilFacebook } from "@iconscout/react-unicons";
import { signIn, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}|:"<>?[\]\\';,./]).{6,}$/;

const formSchema = z.object({
   username: z.string().min(2).max(50),
   email: z.string().email(),
   password: z.string().min(6).max(50).regex(PASSWORD_REGEX),
});

type FormValues = z.infer<typeof formSchema>

const LoadingSpinner = ({ text }: { text?: string }) => (
   <>
      <Loader2 size={16} className={`animate-spin `} />
      {text ?? `Signing in ...`}

   </>
);

export function SocialLogins() {
   const { status } = useSession();
   const [signInLoading, setSignInLoading] = useState(false);

   const handleGoogleLogin = async (e) => {
      e.preventDefault();
      setSignInLoading(true);
      await signIn(`google`, { redirect: true }).finally(() => setSignInLoading(false));
   };

   const handleFacebookLogin = async (e) => {
      e.preventDefault();
      setSignInLoading(true);
      // await signIn(`facebook`, { redirect: true }).finally(() => setSignInLoading(false));
   };

   return (
      <div className={`w-full items-center flex flex-col gap-4`}>
         <Button
            disabled={signInLoading}
            onClick={handleGoogleLogin}
            className={cn(`gap-2 w-full rounded-full items-center text-xs`, signInLoading ? `justify-center` : `justify-between`)}
            variant={`outline`}>
            {signInLoading ? <LoadingSpinner /> : (
               <>
                  <UilGoogle size={16} className={`text-red-500`} />
                  Continue with Google
                  <span />
               </>

            )}
         </Button>
         <Button onClick={handleFacebookLogin} disabled={signInLoading}
                 className={cn(`gap-2 w-full rounded-full items-center text-xs`, signInLoading ? `justify-center` : `justify-between`)}
                 variant={`outline`}>
            {signInLoading ? (
               <LoadingSpinner />
            ) : (
               <>
                  <UilFacebook size={16} className={`text-blue-500`} />
                  Continue with Facebook
                  <span />
               </>
            )}
         </Button>
      </div>
   );
}

const SignUpForm = () => {
   const form = useForm<FormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         username: "",
         email: ``,
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
               name="username"
               render={({ field }) => (
                  <FormItem className={`!mt-4`}>
                     <FormLabel>Username</FormLabel>
                     <FormControl className={`!mt-1`}>
                        <Input type={`text`} required placeholder="e.g. jack123" {...field} />
                     </FormControl>
                     <FormDescription>
                        This is going to be your public display name.
                     </FormDescription>
                     <FormMessage />
                  </FormItem>
               )}
            />

            <FormField
               control={form.control}
               name="email"
               render={({ field }) => (
                  <FormItem className={`!mt-6`}>
                     <FormLabel>E-mail</FormLabel>
                     <FormControl className={`!mt-1`}>
                        <Input required placeholder="e.g. jack@example.com" {...field} />
                     </FormControl>
                     <FormDescription>
                        This is going to be your e-mail.
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
                        This is going to be your password.
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
            <Button className={`self-end !px-6 rounded-full mt-4 shadow-md`} type="submit">Create an account</Button>
         </form>
      </Form>
   );
};

export default SignUpForm;