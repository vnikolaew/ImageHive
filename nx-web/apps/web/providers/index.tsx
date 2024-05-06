import React, { PropsWithChildren } from "react";
import { CSPostHogProvider } from "./PostHogProvider";
import SessionProvider from "./SessionProvider";
import { ThemeProvider } from "./ThemeProvider";
import GeoLocationProvider from "./GeoLocationProvider";
import SwrProvider from "./SWRProvider";
import { ModalsProvider } from "./ModalsProvider";
import ErrorBoundary from "./ErrorBoundary";
import QueryClientProvider from "./QueryClientProvider";

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
                 <QueryClientProvider>
                    <ModalsProvider>
                       {children}
                    </ModalsProvider>
                 </QueryClientProvider>
              </SwrProvider>
            </GeoLocationProvider>
          </ThemeProvider>
        </SessionProvider>
      </ErrorBoundary>
    </CSPostHogProvider>
  );
};

export default Providers;
