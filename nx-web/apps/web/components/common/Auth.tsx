"use client";
import { PropsWithChildren } from "react";
import { useIsSignedIn } from "@web/hooks/useIsSignedIn";

export const SignedIn = ({ children }: PropsWithChildren) => {
   const isSignedIn = useIsSignedIn();

   return isSignedIn ? children : null;
};

export const SignedOut = ({ children }: PropsWithChildren) => {
   const isSignedIn = useIsSignedIn();

   return !isSignedIn ? children : null;
};
