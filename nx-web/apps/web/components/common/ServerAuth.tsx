import { PropsWithChildren } from "react";
import { auth } from "@web/auth";


export const ServerSignedIn = async ({ children }: PropsWithChildren) => {
   const isSignedIn = await auth();

   return isSignedIn ? children : null;
};

export const ServerSignedOut = async ({ children }: PropsWithChildren) => {
   const isSignedIn = await auth();

   return !isSignedIn ? children : null;
};
