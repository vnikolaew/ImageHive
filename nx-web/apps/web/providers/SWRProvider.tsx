"use client"
import { fetcher } from "@web/lib/utils";
import React, { PropsWithChildren } from "react";
import { SWRConfig } from "swr";

export interface SwrProviderProps extends PropsWithChildren {
}

const SwrProvider = ({children}: SwrProviderProps) => {
   return (
      <SWRConfig value={{
         refreshInterval: 60 * 1000,
         fetcher,
      }}>
         {children}
      </SWRConfig>
   );
};

export default SwrProvider;
