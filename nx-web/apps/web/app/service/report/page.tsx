import React from "react";
import ReportForm from "@web/app/service/report/_components/ReportForm";

export interface PageProps {
}

const Page = ({}: PageProps) => {
   return (
      <div className={`w-full flex flex-col items-start gap-6`}>
         <h1 className={`text-2xl font-semibold`}>Report content</h1>
         <ReportForm />
      </div>
   );
};

export default Page;
