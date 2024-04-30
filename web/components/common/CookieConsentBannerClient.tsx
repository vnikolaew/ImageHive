"use client";
import React, { Fragment, useState } from "react";
import CookieConsent from "react-cookie-consent";
import { usePromise } from "@/hooks/usePromise";
import {
   acceptAllCookies,
   declineCookieConsent,
   updateCookiePreferences,
} from "@/components/common/actions";
import { LoadingSpinner } from "@/components/modals/SocialLogins";
import { cn } from "@/lib/utils";
import { APP_NAME, TOASTS } from "@/lib/consts";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Cookie, ExternalLink, SlidersHorizontal } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { toast } from "sonner";


export interface CookieConsentBannerProps {
   cookieConsent: boolean;
   cookiePreferences: Record<string, any>;
}

const BANNER_COPY = `We use cookies to give you the best possible experience with ${APP_NAME.toLowerCase()}.com. Some are essential for this site to function; others help us understand how you use the site, so we can improve it. We may also use cookies for targeting purposes. Click <b>Accept all cookies</b> to proceed as specified, or click <b>Manage my preferences</b> to choose the types of cookies you will accept. Cookie policy.`;
const MANAGE_PREFERENCES = `Manage my preferences`;
const ACCEPT_ALL = `Accept all cookies`;

const CookieConsentBannerClient = ({ cookiePreferences, cookieConsent }: CookieConsentBannerProps) => {
   const { loading: acceptLoading, action: acceptAction } = usePromise(() => acceptAllCookies());
   const { loading, action: declineAction } = usePromise(() => declineCookieConsent());
   const [hideBanner, setHideBanner] = useState(false);
   const [showManagePrefsBanner, setShowManagePrefsBanner] = useState(false);

   return (
      <Fragment>
         <CookieConsent
            visible={hideBanner ? `hidden` : ``}
            acceptOnOverlayClick
            enableDeclineButton
            flipButtons
            location="bottom"
            buttonText={acceptLoading ? <LoadingSpinner text={`Loading ...`} /> : <div className={`flex items-center gap-2 `}>
               <Cookie className={`text-orange-800 group-hover:text-white`} size={16} />
               {ACCEPT_ALL}
            </div>}
            declineButtonText={loading ? <LoadingSpinner text={`Loading ...`} /> : <div className={`flex items-center gap-2`}>
               <SlidersHorizontal size={14} />
               {MANAGE_PREFERENCES}
            </div>}
            buttonStyle={{}}
            cookieName="CookieConsent"
            contentClasses={`!h-fit !text-black !w-full !mx-auto !flex-[1_0_60px] !mb-0`}
            hideOnAccept={false}
            containerClasses={cn(`!bg-white !z-10 !text-black !w-3/5 !max-w-[800px] !bottom-8 !left-[50%] !-translate-x-[50%] !mx-auto !shadow-xl flex flex-col gap-2 p-4 !rounded-xl`)}
            buttonClasses={cn(
               `!bg-white flex items-center gap-2 !text-black !rounded-lg group !px-4 !shadow-md  transitions-colors duration-200`,
               !acceptLoading && `hover:!bg-orange-800 hover:!text-white`,
               acceptLoading && `opacity-50 `,
            )}
            customButtonProps={{ disabled: acceptLoading }}
            customDeclineButtonProps={{ disabled: loading }}
            declineButtonClasses={cn(`!bg-primary flex items-center gap-2 !text-white !rounded-lg !px-4 !shadow-md hover:!opacity-80 transitions-colors duration-200`,
               loading && `opacity-50`,
            )}
            buttonWrapperClasses={`flex w-full items-center gap-2 justify-center`}
            onAccept={_ => {
               acceptAction().then(_ => {
                  setHideBanner(true);
               }).catch(console.error);
            }}
            onDecline={() => {
               setHideBanner(true);
               setShowManagePrefsBanner(true);
            }}
            expires={450}
         >
            <p dangerouslySetInnerHTML={{ __html: BANNER_COPY }}
               className={`text-center w-full leading-tight font-semibold !mb-0 !text-sm`}></p>
         </CookieConsent>
         <CustomizePreferencesModal
            hideBanner={() => setHideBanner(true)}
            cookiePreferences={cookiePreferences}
            onBack={() => {
               setShowManagePrefsBanner(false);
               setHideBanner(false);
            }} open={showManagePrefsBanner} />
      </Fragment>
   );
};

interface CustomizePreferencesModalProps {
   onBack: () => void,
   hideBanner: () => void,
   open: boolean,
   cookiePreferences: Record<string, any>
}

export interface CookiePreferences {
   Necessary: boolean,
   Statistics: boolean,
   Functionality: boolean,
   Marketing: boolean,
}

const CustomizePreferencesModal = ({ open, onBack, cookiePreferences, hideBanner }: CustomizePreferencesModalProps) => {
   const [preferences, setPreferences] = useState<CookiePreferences>({
      Necessary: cookiePreferences[`Necessary`] === true,
      Statistics: cookiePreferences[`Statistics`] === true,
      Functionality: cookiePreferences[`Functionality`] === true,
      Marketing: cookiePreferences[`Marketing`] === true,
   });

   const { loading, action: handleSavePreferencesAction } = usePromise(async () => {
      await updateCookiePreferences(preferences).then(res => {
         onBack?.()
         hideBanner?.()

         const { message, ...rest } = TOASTS.CHANGE_COOKIE_PREFERENCES_SUCCESS;
         toast(message, { ...rest, icon: <Cookie className={`text-orange-800`} size={16} /> });

      }).catch(console.error);
   });

   return (
      <div
         className={cn(`bg-red-500 fixed hidden !z-20 gap-2 items-center justify-between !w-2/5 !mx-auto !bottom-8 !left-[30%] rounded-xl shadow-md`,
            open && `!flex !flex-col`)}>
         <Card className={`w-full p-4`}>
            <CardHeader className={`p-0 flex !flex-row items-center gap-2`}>
               <Button onClick={_ => {
                  onBack?.();
               }} variant={`ghost`} className={`rounded-full !w-fit !h-fit p-2`}>
                  <ArrowLeft size={18} />
               </Button>
               <h2 className={`!mt-0 text-md font-semibold`}>Customize your preferences</h2>
            </CardHeader>
            <Separator className={`w-full mx-auto my-2`} />
            <CardContent className={`mt-4`}>
               <div className={`grid grid-cols-2 gap-4 gap-x-12`}>
                  <div className={`flex items-center justify-between`}>
                     <h2 className={`font-semibold !text-sm`}>Necessary</h2>
                     <Switch
                        checked={preferences.Necessary}
                        onCheckedChange={value => {
                           setPreferences({ ...preferences, Necessary: value });
                        }}
                        className={` h-6`} />
                  </div>
                  <div className={`flex items-center justify-between`}>
                     <h2 className={`font-semibold !text-sm`}>Statistics</h2>
                     <Switch
                        checked={preferences.Statistics}
                        onCheckedChange={value => {
                           setPreferences({ ...preferences, Statistics: value });
                        }}
                        className={` h-6`} />
                  </div>
                  <div className={`flex items-center justify-between`}>
                     <h2 className={`font-semibold text-sm`}>Functionality</h2>
                     <Switch
                        checked={preferences.Functionality}
                        onCheckedChange={value => {
                           setPreferences({ ...preferences, Functionality: value });
                        }}
                        className={` h-6`} />
                  </div>
                  <div className={`flex items-center justify-between`}>
                     <h2 className={`font-semibold text-sm`}>Marketing</h2>
                     <Switch
                        checked={preferences.Marketing}
                        onCheckedChange={value => {
                           setPreferences({ ...preferences, Marketing: value });
                        }}
                        className={` h-6`} />
                  </div>
               </div>
            </CardContent>
            <CardFooter className={`bg-neutral-100 mt-2 p-2 px-4 flex items-center justify-between !-mx-4 !-mb-4`}>
               <Button asChild className={`!text-neutral-400`} variant={`link`}>
                  <Link href={`/service/privacy`}>
                     Learn more <ExternalLink className={`ml-1 text-neutral-400 `} size={12} />
                  </Link>
               </Button>
               <Button
                  disabled={loading}
                  onClick={handleSavePreferencesAction}
                  size={`sm`}
                  className={` rounded-md !px-8 shadow-md`} variant={`default`}>
                  {loading ? (<LoadingSpinner text={`Saving ...`} />) : (
                     `Save and submit`
                  )}
               </Button>
            </CardFooter>
         </Card>
      </div>
   );
};

export default CookieConsentBannerClient;