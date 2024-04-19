"use client";
import { APP_NAME, APP_VERSION } from "@/lib/consts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession, signOut, signIn   } from "next-auth/react";
import { useIsSignedIn } from "@/hooks/useIsSignedIn";
import { handleEmailSignIn } from "@/app/actions";

export default function Home() {
   const { data } = useSession();
   const isSignedIn = useIsSignedIn();

   return (
      <main className="flex min-h-screen flex-col items-center justify-start gap-12 p-24">
         <h1 className={`text-2xl`}>
            Welcome to <span className={`italic`}>{APP_NAME}</span> <b>{APP_VERSION}</b> {isSignedIn && data?.user?.name &&
            <b>{`, ${data?.user?.name ?? ``}`}</b>}
         </h1>
         {!isSignedIn ? (
            <div className={`flex flex-col gap-4`}>
               <form action={async () => {
                  await signIn("google");
               }}>
                  <Button type={`submit`}>Sign in with Google</Button>
               </form>
               <form className={`flex flex-col gap-2`} action={handleEmailSignIn}>
                  <Input type={`text`} name={`email`} className={`w-[300px]`} />
                  <Button className={`self-end`} variant={`ghost`} type={`submit`}>Sign in with E-mail</Button>
               </form>
            </div>
         ) : (
            <form action={() => signOut()}>
               <Button variant={`destructive`} className={`!px-8 shadow-md`} type={`submit`}>Sign out</Button>
            </form>
         )}

         {isSignedIn ?
            <pre className={`text-sm`}>{JSON.stringify(data!.user, null, 2)}</pre> : "Not signed in."}
      </main>

   );
}
