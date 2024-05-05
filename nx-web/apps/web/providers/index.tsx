import React, { PropsWithChildren } from "react";
import { CSPostHogProvider } from "./PostHogProvider";
import SessionProvider from "./SessionProvider";
import { ThemeProvider } from "./ThemeProvider";
import GeoLocationProvider from "./GeoLocationProvider";
import SwrProvider from "./SWRProvider";
import { ModalsProvider } from "./ModalsProvider";
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
                  {children}
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
