"use client";
import React, { PropsWithChildren } from "react";
import { GoogleReCaptchaProvider as GProvider } from "react-google-recaptcha-v3";

export interface GoogleReCaptchaProviderProps extends PropsWithChildren {
}

const GoogleReCaptchaProvider = ({ children }: GoogleReCaptchaProviderProps) => {
   return (
      <GProvider
         scriptProps={{
            async: false,
            defer: false,
            appendTo: "head",
            nonce: undefined,
         }} reCaptchaKey={process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY!}
      >
         {children}

      </GProvider>
   );
};

export default GoogleReCaptchaProvider;
