import React, { PropsWithChildren } from "react";
import SessionProvider from "@/providers/SessionProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ModalsProvider } from "@/providers/ModalsProvider";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { ToastProvider } from "@/components/ui/toast";

const Providers = ({ children }: PropsWithChildren) => {
   return (
      <ErrorBoundary>
         <SessionProvider>
            <ThemeProvider enableSystem disableTransitionOnChange defaultTheme={`system`} attribute={`class`}>
               <ModalsProvider>
                  <ToastProvider swipeDirection={"right"}>
                     {children}
                  </ToastProvider>
               </ModalsProvider>
            </ThemeProvider>
         </SessionProvider>
      </ErrorBoundary>
   );
};

export default Providers;