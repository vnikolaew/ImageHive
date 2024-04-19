import React, { PropsWithChildren } from "react";
import SessionProvider from "@/providers/SessionProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ModalsProvider } from "@/providers/ModalsProvider";

const Providers = ({ children }: PropsWithChildren) => {
   return (
      <SessionProvider>
         <ThemeProvider enableSystem disableTransitionOnChange defaultTheme={`system`} attribute={`class`}>
            <ModalsProvider>
               {children}
            </ModalsProvider>
         </ThemeProvider>
      </SessionProvider>
   );
};

export default Providers;