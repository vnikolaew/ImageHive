import React from "react";

export interface PageProps {
}

const Page = ({}: PageProps) => {
   return (
      <div>
         <h1 className={`text-2xl font-semibold`}>Report content</h1>
      </div>
   );
};

export default Page;
