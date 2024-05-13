import React, { PropsWithChildren } from "react";
import { APP_NAME } from "@nx-web/shared";
import ServiceLinksSection from "@web/app/service/_components/ServiceLinksSection";
import ScrollToTopButton from "@web/app/service/_components/ScrollToTopButton";
import type { Metadata } from "next";
import darkLogo from "@public/ImageHive-logo-dark.png";

export interface LayoutProps extends PropsWithChildren {
}

export const metadata: Metadata = {
   title: `Services - ${APP_NAME}`, description: "A photo and media sharing platform",
   icons: darkLogo.src,
};

const Layout = ({ children }: LayoutProps) => {
   return (
      <section className="w-2/3 mx-auto mt-12 grid grid-cols-7 gap-12">
         <div className={`col-span-2 flex flex-col gap-4`}>
            <h2 className={`text-xl font-semibold mb-2`}>{APP_NAME}</h2>
            <ServiceLinksSection />
         </div>
         <div className={`col-span-5`}>{children}</div>
         <ScrollToTopButton />
      </section>
   );
};

export default Layout;
