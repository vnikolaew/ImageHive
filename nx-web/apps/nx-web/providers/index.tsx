import React, { PropsWithChildren } from "react";
import { CSPostHogProvider } from "./PostHogProvider";
import SessionProvider from "./SessionProvider";
import { ThemeProvider } from "./ThemeProvider";
import GeoLocationProvider from "./GeoLocationProvider";
import SwrProvider from "./SWRProvider";
import { ModalsProvider } from "./ModalsProvider";
import { ToastProvider } from "@radix-ui/react-toast";
import ErrorBoundary from "./ErrorBoundary";


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
