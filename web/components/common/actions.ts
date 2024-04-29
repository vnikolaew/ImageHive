"use server";
import { auth } from "@/auth";
import { xprisma } from "@/lib/prisma";
import { sleep } from "@/lib/utils";
import { CookiePreferences } from "@/components/common/CookieConsentBannerClient";

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
         },
      },
   });

   return { success: true };
}
