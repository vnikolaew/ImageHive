"use client"
import React, { PropsWithChildren } from "react";
import { SWRConfig } from "swr";
import { fetcher } from "@/lib/utils";

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