"use client";
import { useSession } from "next-auth/react";
import { useMemo } from "react";

export function useIsSignedIn() {
   const session = useSession();
   const isSignedIn = useMemo(() =>
      session?.status === `authenticated` && !!session?.data, [session]);

   return isSignedIn;
}
