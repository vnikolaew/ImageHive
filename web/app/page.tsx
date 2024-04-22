"use client";
import { APP_NAME } from "@/lib/consts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession, signOut, signIn } from "next-auth/react";
import { useIsSignedIn } from "@/hooks/useIsSignedIn";
import { handleEmailSignIn } from "@/app/actions";
// @ts-ignore
import { UilGoogle } from "@iconscout/react-unicons";
import { Label } from "@/components/ui/label";

export default function Home() {
   const { data } = useSession();
   const isSignedIn = useIsSignedIn();

   return (
      <main className="flex min-h-screen flex-col items-center justify-start gap-12 p-24">
         <h1 className={`text-3xl`}>
            Welcome to <span className={`italic`}>{APP_NAME}</span> {isSignedIn && data?.user?.name &&
            <b>{`, ${data?.user?.name ?? ``}`}</b>}
         </h1>
         {!isSignedIn && (
            <div className={`flex flex-col gap-12 items-center`}>
               <form className={`w-full`} action={async () => {
                  await signIn("google");
               }}>
                  <Button
                     size={`lg`} className={`gap-2 rounded-lg !px-8 !py-4 w-full`}
                     type={`submit`}>
                     <UilGoogle className={`text-red-500`} />
                     Sign in with Google
                  </Button>
               </form>
            </div>
         )}

         {isSignedIn ?
            <pre className={`text-sm`}>{JSON.stringify(data!.user, null, 2)}</pre> : "You are not signed in."}
      </main>

   );
}
