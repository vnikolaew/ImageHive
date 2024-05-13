import React, { PropsWithChildren } from "react";
import AccountsTabsList from "./AccountsTabsList";
import type { Metadata } from "next";
import { APP_NAME } from "@nx-web/shared";
import darkLogo from "@public/ImageHive-logo-dark.png";

export const metadata: Metadata = {
   title: `Account - ${APP_NAME}`,
   description: "A photo and media sharing platform",
   icons: darkLogo.src
};

const Layout = ({ children }: PropsWithChildren) => {
   return (
      <div className={`mt-0 min-h-[70vh] flex flex-col gap-2 w-4/5 !mx-auto`}>
         <AccountsTabsList />
         <div className={`w-full mx-auto`}>
            {children}
         </div>
      </div>
   );
};

export default Layout;
