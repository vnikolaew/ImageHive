import React from "react";
import { APP_NAME } from "@nx-web/shared";

export interface PageProps {
}

const Page = ({}: PageProps) => {
   return (
      <div className="w-full flex flex-col gap-2 ">
         <h2 className={`text-xl font-semibold`}>
            {APP_NAME} Terms of Service
         </h2>
         <span className={`text-sm`}>
            Last updated: March 4, 2024
         </span>
         <ol className={`ml-4 mt-4 max-w-2xl`} type={`1`} style={{ listStyleType: `decimal` }}>
            <li className={`pl-4`}>
               <h2 className={`text-base font-semibold`}>
                  The basics
               </h2>
               <p className={`text-sm mt-2`}>
                  Welcome to {APP_NAME}! {APP_NAME} is a vibrant community of creatives sharing royalty-free content.
                  These
                  Terms of Service ("Terms") apply to the {APP_NAME}.com website, related websites, software, mobile apps,
                  plug-ins and other {APP_NAME}-operated services (collectively, the "Service(s)").
               </p>
               <p className={`text-sm mt-2`}>
                  These Terms govern the relationship between {APP_NAME}, a Canva Germany GmbH brand ("we", "our" or
                  "{APP_NAME}") and any user of the Service ("you", "your" or "User"), including in certain circumstances,
                  the relationship between Users. By using the Service (including by downloading and using Content from
                  the Service, or contributing Content or Communications to the Service):
               </p>

               <ul className={`list-disc mt-4 text-sm !pl-4`}>
                  <li>
                     you agree that you are entering into these Terms with us which will become a legally binding
                     agreement between you and us; and
                  </li>
                  <li className={`mt-2`}>
                     you represent and warrant that you have the full right, power and authority to agree to and be
                     bound by these Terms and to fully perform all of your obligations listed in these Terms.
                  </li>
               </ul>
               <p className={`text-sm mt-2`}>
                  If you don’t agree to these Terms, please don’t use the Service.
               </p>

               <p className={`text-sm mt-2`}>
                  Children may not access or use the Service unless their use is directly authorized by their parent,
                  guardian or another authorized adult who agrees to be bound by these Terms. For the purposes of these
                  Terms, a child is a person under the age of 13 (or the minimum legal age required to provide consent
                  for processing of personal data in the country where the child is located, noting 16 is the minimum
                  legal age in Germany).
               </p>

               <p className={`text-sm mt-2`}>
                  We reserve the right, at our sole discretion, to change or modify these Terms at any time, including
                  the right to cancel or change the licenses granted by these Terms. If we do this, we will post the
                  most current version of these Terms on this page. We will seek to provide you with reasonable notice
                  of any change to the Terms that, in our sole determination, materially adversely affect your rights or
                  your use of the Service. We may provide you with this notice via the Service and/or by direct message
                  on the Service and/or by posting on {APP_NAME}’s public forum. By continuing to use the Service after any
                  revised Terms become effective, you agree to be bound by the new Terms.
               </p>
            </li>
            <li className={`pl-4 mt-4`}>
               <h2 className={`text-base font-semibold`}>
                  Content.
               </h2>
               <p className={`text-sm mt-2`}>
                  In these Terms when we refer to "Content" we are referring to the content which is available on the
                  Services, but excluding any third party paid advertising or sponsored content (over which {APP_NAME} has
                  no control and we do not grant any license). Content includes, but isn’t limited to the following
                  items:
               </p>
               <ul className={`list-disc mt-4 text-sm !pl-4`}>
                  <li>
                     <b>"Images"</b>, which means photographs, vector graphics, drawings and illustrations.
                  </li>
                  <li className={`mt-2`}>
                     <b>"Videos"</b>, which means moving images, animations, film footage and other audio-visual
                     representations and content.
                  </li>
                  <li className={`mt-2`}>
                     <b>"Audio"</b>, which means music, sounds, sound effects and other audio representations and
                     content.
                  </li>
                  <li className={`mt-2`}>
                     <b>"Other Media"</b>, which means any other media or content which is visual or audio in nature, or
                     a
                     combination of these.
                  </li>
               </ul>
            </li>
            <li className={`pl-4 mt-4`}>
               <h2 className={`text-base font-semibold`}>
                  Communications.
               </h2>
               <p className={`text-sm mt-2`}>
                  {APP_NAME} also makes available various functionality across the Service which allows you to interact and
                  communicate with the Service and with other Users, for example by:
               </p>

               <ul className={`list-disc mt-4 text-sm !pl-4`}>
                  <li>
                     selecting a username, uploading a profile photo and creating a profile page;
                  </li>
                  <li>
                     making contributions in our {APP_NAME} forum and discussion rooms;

                  </li>
                  <li>
                     leaving comments on any Content or blog articles;

                  </li>
                  <li>
                     sending messages to other users via our messaging functionality; and/or
                  </li>
                  <li>
                     any other communications submitted by you through the Service, together, <b>“Communication(s)”</b>.
                  </li>
               </ul>
            </li>
            <li className={`pl-4 mt-4`}>
               <h2 className={`text-base font-semibold`}>
                  CC0 License
               </h2>

               <p className={`text-sm mt-2`}>
                  Some of the Content made available for download on the Service is subject to and licensed under the
                  Creative Commons Zero (CC0) license ("CC0 Content"). CC0 Content on the Service is any content which
                  lists a "Published date" prior to January 9, 2019. This means that to the greatest extent permitted by
                  applicable law, the authors of that work have dedicated the work to the public domain by waiving all
                  of his or her rights to the CC0 Content worldwide under copyright law, including all related and
                  neighboring rights. Subject to the CC0 License Terms, the CC0 Content can be used for all personal and
                  commercial purposes without attributing the author/ content owner of the CC0 Content or {APP_NAME}.
               </p>
            </li>
            <li> ... </li>
         </ol>
      </div>
   );
};

export default Page;
