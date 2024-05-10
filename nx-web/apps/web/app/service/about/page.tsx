import React from "react";
import { APP_NAME } from "@nx-web/shared";
import Link from "next/link";

export interface PageProps {
}

const Page = ({}: PageProps) => {
   return (
      <div className="w-full flex flex-col gap-2">
         <h2 className={`text-xl font-semibold`}>
            About us
         </h2>

         <h2 className={`text-base font-semibold mt-4`}>
            Company
         </h2>
         <h2 className={`text-base font-semibold mt-4`}>
            Address:
         </h2>
         <p className={`text-sm mt-2 max-w-2xl`}>
            {APP_NAME}, a Bulgarian brand
            <br />
            Kesten 14
            <br />
            9000 Varna
            <br />
            Bulgaria
         </p>

         <h2 className={`text-base font-semibold mt-4`}>
            Contact
         </h2>
         <p className={`text-sm mt-2 max-w-2xl`}>
            Phone: +1 844-204-1750
            <br />
            Email address: <a href={`mailto:info@${APP_NAME.toLowerCase()}.com`}>
            info@{APP_NAME.toLowerCase()}.com
         </a>
            <br />
            <Link className={`text-blue-500`} href={`contact`}>Contact form</Link>
         </p>

         <h2 className={`text-base font-semibold mt-4`}>
            Managing Director:
         </h2>
         <p className={`text-sm mt-2 max-w-2xl`}>
            Victorio Nikolaev
         </p>

         <h2 className={`text-base font-semibold mt-4`}>
            Dispute resolution:
         </h2>
         <p className={`text-sm mt-2 max-w-2xl`}>
            <Link className={`text-primary`} href={`https://ec.europa.eu/consumers/odr/`}>
               https://ec.europa.eu/consumers/odr/
            </Link>
            {` `} {APP_NAME} is not obligated or willing to participate in arbitration
            proceedings within the meaning of the VSBG. {APP_NAME} endeavors to settle any disagreements amicably. Our
            email address: <a href={`mailto:info@${APP_NAME.toLowerCase()}.com`}>
            info@{APP_NAME.toLowerCase()}.com
         </a>
         </p>
      </div>
   );
};

export default Page;
