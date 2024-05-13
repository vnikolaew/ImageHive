"use client";
import React from "react";
import { Button, ButtonProps } from "@components/button";
import { LoadingSpinner } from "@web/components/modals/SocialLogins";

export interface LoadingButtonProps extends ButtonProps {
   loading?: boolean;
   loadingText?: string;
}

const LoadingButton = ({ disabled, loading = false, loadingText, children, ...rest }: LoadingButtonProps) => {
   return (
      <Button disabled={loading || disabled} {...rest}>
         {loading ? (
            <LoadingSpinner text={loadingText ?? `Loading ...`} />
         ) : children}
      </Button>
   );
};

export default LoadingButton;
