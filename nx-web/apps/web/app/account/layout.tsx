import React, { PropsWithChildren } from "react";
import AccountsTabsList from "./AccountsTabsList";

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
