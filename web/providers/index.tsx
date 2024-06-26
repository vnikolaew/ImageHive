import React, { PropsWithChildren } from "react";
import SessionProvider from "@/providers/SessionProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ModalsProvider } from "@/providers/ModalsProvider";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { ToastProvider } from "@/components/ui/toast";
import SwrProvider from "@/providers/SWRProvider";
import { CSPostHogProvider } from "@/providers/PostHogProvider";
import GeoLocationProvider from "@/providers/GeoLocationProvider";

const Providers = ({ children }: PropsWithChildren) => {
   return (
      <CSPostHogProvider>
         <ErrorBoundary>
            <SessionProvider>
               <ThemeProvider
                  enableSystem
                  disableTransitionOnChange
                  defaultTheme={`system`}
                  attribute={`class`}>
                  <GeoLocationProvider>
                     <SwrProvider>
                        <ModalsProvider>
                           <ToastProvider swipeDirection={"right"}>
                              {children}
                           </ToastProvider>
                        </ModalsProvider>
                     </SwrProvider>
                  </GeoLocationProvider>
               </ThemeProvider>
            </SessionProvider>
         </ErrorBoundary>
      </CSPostHogProvider>
   );
};

export default Providers;