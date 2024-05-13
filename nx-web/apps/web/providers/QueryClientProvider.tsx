"use client";
import React, { PropsWithChildren } from "react";
import {
   QueryClient,
   QueryCache,
   QueryClientProvider,
} from "@tanstack/react-query";
import { __IS_DEV__ } from "@nx-web/shared";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export interface QueryClientProviderProps extends PropsWithChildren {
}

const queryClient = new QueryClient({
   queryCache: new QueryCache(),
   defaultOptions: {
      queries: {
         queryFn: ({ queryKey }) => fetch(queryKey.join("/")).then((result) => result.json()),
         refetchInterval: 60 * 1_000,
      },
   },
});

const QueryClientProvider_ = ({ children }: QueryClientProviderProps) => {
   return (
      <QueryClientProvider client={queryClient}>
         {children}
         {__IS_DEV__ && (<ReactQueryDevtools initialIsOpen={false} />)}
      </QueryClientProvider>
   );
};

export default QueryClientProvider_;
