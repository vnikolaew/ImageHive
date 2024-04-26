"use client";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { PropsWithChildren } from "react";

const ENABLED = process.env.NEXT_PUBLIC_POSTHOG_ENABLED === `true`;

if (typeof window !== "undefined" && ENABLED) {
   posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      capture_pageview: false,
      autocapture: {
         dom_event_allowlist: [],
         css_selector_allowlist: [],
         element_allowlist: [],
      },
   });
}

export function CSPostHogProvider({ children }: PropsWithChildren) {
   if (ENABLED) {
      return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
   }
   return children;
}