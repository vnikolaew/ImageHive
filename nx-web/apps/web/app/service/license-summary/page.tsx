import React from "react";
import { APP_NAME } from "@nx-web/shared";
import { Check, X } from "lucide-react";

export interface PageProps {
}

const Page = ({}: PageProps) => {
   return (
      <div className="w-full flex flex-col gap-2 ">
         <h2 className={`text-xl font-semibold`}>
            Content License Summary
         </h2>
         <p className="max-w-xl text-sm mt-2">
            Welcome to {APP_NAME}! {APP_NAME} is a vibrant community of authors,
            artists and creators sharing royalty-free images, video, audio and other media.
            We refer to this collectively as "Content". By accessing and using Content, or by contributing Content, you
            agree to comply with our Content License.
         </p>
         <p className="max-w-xl text-sm mt-2">
            At {APP_NAME}, we like to keep things as simple as possible.
            For this reason, we have created this short summary of our Content License which is available in full here.
            Please keep in mind that only the full Content License is legally binding.
         </p>
         <h3 className={`text-lg font-semibold mt-4`}>
            What are you allowed to do with Content?
         </h3>
         <p className="max-w-xl text-sm mt-2">
            Subject to the Prohibited Uses (see below), the Content License allows users to:
         </p>
         <ul className={`text-sm mt-2 flex flex-col gap-2`}>
            <li className={`flex items-center gap-4`}>
               <Check className={`text-green-600`} size={18} />
               Use Content for free
            </li>
            <li className={`flex items-center gap-4`}>
               <Check className={`text-green-600`} size={18} />
               Use Content without having to attribute the author (although giving credit is always appreciated by our
               community!)
            </li>
            <li className={`flex items-center gap-4`}>
               <Check className={`text-green-600`} size={18} />
               Modify or adapt Content into new works
            </li>
         </ul>


         <h3 className={`text-lg font-semibold mt-4`}>
            What are you not allowed to do with Content?
         </h3>
         <p className="max-w-xl text-sm mt-2">
            We refer to these as Prohibited Uses which include:
         </p>
         <ul className={`text-sm mt-2 flex flex-col gap-2`}>
            <li className={`flex items-center gap-4 `}>
               <X className={`text-red-600`} size={18} />
               <p className="max-w-xl text-sm">
                  You cannot sell or distribute Content (either in digital or physical form) on a Standalone basis.
                  Standalone means where no creative effort has been applied to the Content and it remains in
                  substantially
                  the same form as it exists on our website.
               </p>
            </li>
            <li className={`flex items-center gap-4`}>
               <X className={`text-red-600`} size={18} />
               <p className="max-w-xl text-sm">
                  If Content contains any recognisable trademarks, logos or brands, you cannot use that Content for
                  commercial purposes in relation to goods and services. In particular, you cannot print that Content on
                  merchandise or other physical products for sale.
               </p>
            </li>
            <li className={`flex items-center gap-4`}>
               <X className={`text-red-600`} size={18} />
               <p className="max-w-xl text-sm">
                  You cannot use Content in any immoral or illegal way, especially Content which features recognisable
                  people.
               </p>
            </li>
            <li className={`flex items-center gap-4`}>
               <X className={`text-red-600`} size={18} />
               <p className="max-w-xl text-sm">
                  You cannot use Content in a misleading or deceptive way.
               </p>
            </li>

            <li className={`flex items-center gap-4`}>
               <X className={`text-red-600`} size={18} />
               <p className="max-w-xl text-sm">
                  You cannot use any of the Content as part of a trade-mark, design-mark, trade-name, business name or
                  service mark.
               </p>
            </li>
         </ul>

         <p className="max-w-xl text-sm mt-8">
            Please be aware that certain Content may be subject to additional intellectual property rights (such as
            copyrights, trademarks, design rights), moral rights, proprietary rights, property rights, privacy rights or
            similar. It is your responsibility to check whether you require the consent of a third party or a license to
            use Content.
         </p>
      </div>
   );
};

export default Page;
