import React from "react";
import { auth } from "@/auth";
import { xprisma } from "@/lib/prisma";
import CookieConsentBannerClient from "@/components/common/CookieConsentBannerClient";
import cookieConsent from "react-cookie-consent/src/CookieConsent";

export interface CookieConsentBannerProps {
}

const CookieConsentBanner = async ({}: CookieConsentBannerProps) => {
   const session = await auth();
   if (!session) return null;

   const metadata = (await xprisma.account.findFirst({
      where: { userId: session.user?.id },
      select: { metadata: true },
   }))?.metadata;

   const cookieConsentGranted = (metadata as any)?.[`cookie-consent`] ?? false;
   const cookiePreferences = (metadata as any)?.[`cookie-preferences`] ?? {};

   if (cookieConsentGranted) return null;
   return <CookieConsentBannerClient cookieConsent={cookieConsentGranted} cookiePreferences={cookiePreferences} />;
};

export default CookieConsentBanner;