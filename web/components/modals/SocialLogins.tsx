"use client";
import { signIn } from "next-auth/react";
import React, { Fragment, useState } from "react";
import { useTheme } from "next-themes";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
// @ts-ignore
import { UilFacebook, UilGoogle } from "@iconscout/react-unicons";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export const LoadingSpinner = ({ text }: { text?: string }) => (
   <Fragment>
      <Loader2 size={16} className={`animate-spin mr-2`} />
      {text ?? `Signing in ...`}
   </Fragment>
);

export function SocialLogins() {
   const [signInLoading, setSignInLoading] = useState(false);
   const { theme } = useTheme();

   const handleGoogleLogin = async (e: any) => {
      e.preventDefault();
      setSignInLoading(true);
      await signIn(`google`, { redirect: true }).finally(() => setSignInLoading(false));
   };

   const handleFacebookLogin = async (e: any) => {
      e.preventDefault();
      setSignInLoading(true);
   };

   return (
      <div className={`w-full items-center flex flex-col gap-4`}>
         <Button
            disabled={signInLoading}
            onClick={handleGoogleLogin}
            className={cn(`gap-2 w-full rounded-full items-center text-sm text-white`, signInLoading ? `justify-center` : `justify-between`)}
            variant={theme === `dark` ? `default` : `outline`}>
            {signInLoading ? <LoadingSpinner /> : (
               <>
                  <UilGoogle size={16} className={`text-red-500`} />
                  Continue with Google
                  <span />
               </>

            )}
         </Button>
         <Button onClick={handleFacebookLogin} disabled={signInLoading}
                 className={cn(`gap-2 w-full rounded-full items-center text-sm`, signInLoading ? `justify-center` : `justify-between`)}
                 variant={`outline`}>
            {signInLoading ? <LoadingSpinner /> : <Fragment>
               <UilFacebook size={16} className={`text-blue-500`} />
               Continue with Facebook
               <span />
            </Fragment>}
         </Button>
         <p className="px-0 text-center text-sm text-muted-foreground !w-full leading-tight">
            By clicking continue, you agree to our{" "}
            <Link
               href="/service/terms"
               className={cn(`underline-offset-4 hover:text-primary`, buttonVariants({ variant: `link` }), `!m-0 !py-0 !px-2`)}
            >
               Terms of Service
            </Link>
            and{" "}
            <Link
               href="/service/privacy"
               className={cn(`underline-offset-4 hover:text-primary`, buttonVariants({ variant: `link` }), `!m-0 !py-0 !px-2`)}
            >
               Privacy Policy
            </Link>
            .
         </p>
      </div>
   );
}