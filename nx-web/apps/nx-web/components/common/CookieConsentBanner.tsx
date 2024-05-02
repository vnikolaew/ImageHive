import React from "react";
import { auth } from "../../auth";
import { xprisma } from "@nx-web/db";
import CookieConsentBannerClient from "./CookieConsentBannerClient";

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
