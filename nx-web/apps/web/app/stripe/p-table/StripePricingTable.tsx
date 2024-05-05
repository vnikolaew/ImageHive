import React from "react";
import Script from "next/script";

export interface StripePricingTableProps {
}

const StripePricingTable = ({}: StripePricingTableProps) => {
   // @ts-ignore
   return (
      <div>
         <Script async src={"https://js.stripe.com/v3/pricing-table.js"} />
         {/*
// @ts-ignore */}
         <stripe-pricing-table
            pricing-table-id="prctbl_1PBfwbGMcvfVS8m1sQjTRmIx"
            publishable-key="pk_test_51PBVa0GMcvfVS8m1Ycncve8QbUxfT155eZlTllL3OrJmIA8mFA8Uko8rmgxrudIyOk11ooy9xXEMejPQu3g81agH00m8D23UPL">
            {/*
// @ts-ignore */}
         </stripe-pricing-table>
      </div>
   );
};

export default StripePricingTable;