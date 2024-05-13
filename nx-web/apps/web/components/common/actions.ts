"use server";

import { sleep } from "@nx-web/shared";
import { xprisma } from "@nx-web/db";
import { authorizedAction } from "@web/lib/actions";
import { z } from "zod";

export interface CookiePreferences {
   Necessary: boolean,
   Statistics: boolean,
   Functionality: boolean,
   Marketing: boolean,
}

export const acceptAllCookies = authorizedAction(z.any(), async (_, { userId }) => {
   await sleep(2000);

   const account = await xprisma.account.findFirst({
      where: { userId },
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
});

export const declineCookieConsent = authorizedAction(z.any(), async (_, { userId }) => {
   await sleep(2000);
   const account = await xprisma.account.findFirst({
      where: { userId },
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
});


const cookiePreferencesSchema = z.object({
   Necessary: z.boolean(),
   Statistics: z.boolean(),
   Functionality: z.boolean(),
   Marketing: z.boolean(),
});

export const updateCookiePreferences = authorizedAction(cookiePreferencesSchema, async (cookiePreferences: CookiePreferences, { userId }) => {
   await sleep(2000);
   const account = await xprisma.account.findFirst({
      where: { userId },
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
});

const changeThemeSchema = z.union([z.literal(`light`), z.literal(`dark`), z.literal(`system`)]);

export const changeUserTheme = authorizedAction(changeThemeSchema, async (theme, { userId }) => {
   await sleep(2000);

   const user = await xprisma.user.findFirst({
      where: { id: userId },
   });
   if (!user) return { success: false };

   await xprisma.user.update({
      where: {
         id: userId
      },
      data: {
         metadata: {
            ...user.metadata as Record<string, any>,
            "theme": theme,
         },
      },
   });

   return { success: true };
});
