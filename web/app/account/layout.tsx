import React, { PropsWithChildren } from "react";
import AccountsTabsList from "@/app/account/AccountsTabsList";


const Layout = ({ children }: PropsWithChildren) => {
   return (
      <div className={`mt-0 min-h-[70vh] flex flex-col gap-2`}>
         <AccountsTabsList />
         <div className={`w-2/3 mx-auto`}>
            {children}
         </div>
      </div>
   );
};

export default Layout;