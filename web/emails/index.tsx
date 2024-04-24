import { Button, Html, Tailwind } from "@react-email/components";
import * as React from "react";

export default function Email() {
   return (
      <Html>
         <Tailwind
            config={{
               theme: {
                  extend: {
                     colors: {
                        brand: "#007291",
                     },
                  },
               },
            }}
         >
            <Button
               href="https://example.com"
               className={`rounded-full shadow-md bg-brand`}
               style={{ background: "#000", color: "#fff", padding: "12px 20px" }}
            >
               Click me
            </Button>
         </Tailwind>
      </Html>
   );
}
