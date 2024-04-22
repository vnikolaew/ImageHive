"use client";
import React, { PropsWithChildren } from "react";
import { ErrorBoundary as RErrorBoundary  } from "react-error-boundary";
import { Button } from "@/components/ui/button";

const ErrorBoundary = ({ children }: PropsWithChildren) => {
   return (
      <RErrorBoundary fallbackRender={({ error, resetErrorBoundary }) => (
         <div className={`w-full h-full flex flex-col items-center mt-12 justify-center`}>
            <div>{error.message}</div>
            <Button onClick={_ => resetErrorBoundary()} variant={`default`}>Reset Error Boundary</Button>
         </div>
      )}>
         {children}
      </RErrorBoundary>
   );
};

export default ErrorBoundary;