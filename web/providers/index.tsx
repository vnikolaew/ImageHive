import React, { PropsWithChildren } from "react";
import SessionProvider from "@/providers/SessionProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";

const Providers = ({ children }: PropsWithChildren) => {
   return (
      <SessionProvider>
         <ThemeProvider enableSystem disableTransitionOnChange defaultTheme={`system`} attribute={`class`}>
            {children}
         </ThemeProvider>
      </SessionProvider>
   );
};

export default Providers;