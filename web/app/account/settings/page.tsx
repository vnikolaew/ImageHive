import React from "react";
import { Separator } from "@/components/ui/separator";
import PersonalDataSection from "@/app/account/settings/_components/PersonalDataSection";

const Page = () => {
   return (
      <div className={`my-12 min-h-[70vh]`}>
         <div className={`grid gap-8 grid-cols-2 w-full `}>
            <div>
               <h2 className={`text-xl`}>Edit Profile</h2>
               <Separator className={`w-full my-4 h-[1px]`} />
               <div>
                  <PersonalDataSection />
               </div>
            </div>
            <div>
               <div className={`flex flex-col`}>
                  <h2 className={`text-xl`}>Online Profiles
                  </h2>
                  <Separator className={`w-full my-4 h-[1px]`} />
                  <div>
                     <PersonalDataSection />
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Page;