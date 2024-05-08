import React, { PropsWithChildren } from "react";
import { CSPostHogProvider } from "./PostHogProvider";
import SessionProvider from "./SessionProvider";
import { ThemeProvider } from "./ThemeProvider";
import GeoLocationProvider from "./GeoLocationProvider";
import SwrProvider from "./SWRProvider";
import { ModalsProvider } from "./ModalsProvider";
import ErrorBoundary from "./ErrorBoundary";
import QueryClientProvider from "./QueryClientProvider";
import GoogleReCaptchaProvider from "./GoogleReCaptchaProvider";

const Providers = ({ children }: PropsWithChildren) => {
   return (
      <CSPostHogProvider>
         <ErrorBoundary>
            <GoogleReCaptchaProvider>
               <QueryClientProvider>
                  <SessionProvider>
                     <ThemeProvider
                        enableSystem
                        disableTransitionOnChange
                        defaultTheme={`system`}
                        attribute={`class`}>
                        <GeoLocationProvider>
                           <SwrProvider>
                              <ModalsProvider>
                                 {children}
                              </ModalsProvider>
                           </SwrProvider>
                        </GeoLocationProvider>
                     </ThemeProvider>
                  </SessionProvider>
               </QueryClientProvider>
            </GoogleReCaptchaProvider>
         </ErrorBoundary>
      </CSPostHogProvider>
   );
};

export default Providers;
