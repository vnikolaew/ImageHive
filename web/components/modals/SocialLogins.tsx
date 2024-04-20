"use client"
import { signIn, useSession } from "next-auth/react";
import React, { Fragment, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
// @ts-ignore
import { UilFacebook, UilGoogle } from "@iconscout/react-unicons";
import { Loader2 } from "lucide-react";

const LoadingSpinner = ({ text }: { text?: string }) => (
   <Fragment>
      <Loader2 size={16} className={`animate-spin `} />
      {text ?? `Signing in ...`}

   </Fragment>
);

export function SocialLogins() {
   const { status } = useSession();
   const [signInLoading, setSignInLoading] = useState(false);
   const { theme } = useTheme();

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