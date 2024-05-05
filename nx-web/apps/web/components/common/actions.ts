"use server";

import { sleep } from "@nx-web/shared";
import { auth } from "@web/auth";
import { xprisma } from "@nx-web/db";

export interface CookiePreferences {
  Necessary: boolean,
  Statistics: boolean,
  Functionality: boolean,
  Marketing: boolean,
}

export async function acceptAllCookies() {
   await sleep(2000);

   const session = await auth();
   if (!session) return { success: false };

   const account = await xprisma.account.findFirst({
      where: { userId: session.user?.id },
   });
   if (!account) return { success: false };

   await xprisma.account.update({
      where: {
         provider_providerAccountId: {
            providerAccountId: account.providerAccountId,
            provider: account.provider,
         },
      },
      data: {
         metadata: {
            ...account.metadata as Record<string, any>,
            "cookie-consent": true,
            "cookie-preferences": {
               Necessary: true,
               Statistics: true,
               Functionality: true,
               Marketing: true,
            },
         },
      },
   });
   return { success: true };
}

export async function declineCookieConsent() {
   await sleep(2000);
   const session = await auth();
   if (!session) return { success: false };

   const account = await xprisma.account.findFirst({
      where: { userId: session.user?.id },
   });
   if (!account) return { success: false };

   await xprisma.account.update({
      where: {
         provider_providerAccountId: {
            providerAccountId: account.providerAccountId,
            provider: account.provider,
         },
      },
      data: {
         metadata: {
            ...account.metadata as Record<string, any>,
            "cookie-consent": false,
         },
      },
   });
   return { success: true };
}


export async function updateCookiePreferences(cookiePreferences: CookiePreferences) {
   await sleep(2000);
   const session = await auth();
   if (!session) return { success: false };

   const account = await xprisma.account.findFirst({
      where: { userId: session.user?.id },
   });
   if (!account) return { success: false };

   await xprisma.account.update({
      where: {
         provider_providerAccountId: {
            providerAccountId: account.providerAccountId,
            provider: account.provider,
         },
      },
      data: {
         metadata: {
            ...account.metadata as Record<string, any>,
            "cookie-preferences": cookiePreferences,
            "cookie-consent": true,
         },
      },
   });

   return { success: true };
}
