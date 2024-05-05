import React from "react";
import StripePricingTable from "./StripePricingTable";

export interface PageProps {
}

const Page = ({}: PageProps) => {
   return (
      <div className="mt-12">
         <StripePricingTable />
      </div>
   );
};

export default Page;
