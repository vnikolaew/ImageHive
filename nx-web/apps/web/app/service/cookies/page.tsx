import { Button } from "@components/button";
import React from "react";
import Link from "next/link";
import { APP_NAME } from "@nx-web/shared";

export interface PageProps {
}

const Page = ({}: PageProps) => {
   return (
      <div className="w-full flex flex-col gap-2">
         <h2 className={`text-xl font-semibold`}>
            Cookies Policy
         </h2>
         <p className={`text-sm mt-2 max-w-2xl`}>
            We are {APP_NAME}, a Bulgarian brand (&quot;{APP_NAME}&quot;). This cookies policy applies to {APP_NAME}’s
            website at
            {APP_NAME.toLowerCase()}.com and all related websites, software, mobile apps, plug-ins and other services
            that we provide
            (together, the &quot;Service&quot;).
         </p>
         <p className={`text-sm mt-2 max-w-2xl`}>
            To provide a great product experience and for certain functions, we use so-called cookies. Cookies are small
            text files that are stored on your device. You can find an overview of all cookies we use, their purpose,
            retention period and usage class below.
         </p>
         <p className={`text-sm mt-2 max-w-2xl`}>
            Any information that we collect through cookies will be used in accordance with our
            <Link target={`_blank`}
                  className={`!text-blue-500`}
                  href={`privacy`}>
               privacy policy
            </Link>. If you
            do not accept the use of these cookies, you can disable them by following the instructions under the heading
            &quot;Cookie Settings&quot; below.
         </p>

         <h2 className={`text-lg font-semibold mt-4`}>
            What are cookies and similar technologies?
         </h2>
         <p className={`text-sm mt-2 max-w-2xl`}>
            Cookies are small text files that uniquely identify your browser or device. The cookie file is stored on
            your browser. When you return to that website (or visit websites that use the same cookies) these websites
            recognize the cookies and your browsing device.
         </p>
         <p className={`text-sm mt-2 max-w-2xl`}>
            Cookies do many different jobs, like letting you navigate between pages efficiently, remembering your
            preferences, and generally improving your experience. Cookies can tell us, for example, whether you have
            visited our websites before.
         </p>
         <p className={`text-sm mt-2 max-w-2xl`}>
            Cookies are not the only way to recognize or track visitors to a website:
         </p>

         <ul className={`list-disc mt-4 text-sm !pl-4`}>
            <li>
               Software development kits. Software development kits (SDK) are third-party software development kits that
               may be installed in our mobile applications. SDKs collect certain information about the device and
               network you use to access the application and help us understand how you interact with our applications.
            </li>
            <li className={`mt-2`}>
               Log information. Certain information is automatically reported by your browser or mobile device each time
               you access the website. This includes information such as your web request, browser type, country, IP
               address, user_agent, referring / exit pages and URLs, and how you interact with links on the website. We
               may use this information to improve the website experience and to measure the performance of advertising.
            </li>
         </ul>
         <h2 className={`text-lg font-semibold mt-4`}>
            Are there different types of cookies?
         </h2>
         <p className={`text-sm mt-2 max-w-2xl`}>
            There are different types of cookies, including <b>first party cookies</b> (which are served directly by us
            to your
            computer or device) and <b>third-party cookies</b> (which are served by a third-party on our behalf).
            Third-party
            cookies enable third party features or functionality to be provided on or through the website (e.g.
            advertising, interactive content and analytics). The parties that set these third-party cookies can
            recognise your computer both when it visits the website in question and also when it visits certain other
            websites.
         </p>
         <p className={`text-sm mt-2 max-w-2xl`}>
            Cookies can remain on your device for different periods of time. Some cookies are <b>session cookies</b> ,
            meaning
            that they exist only while your browser is open and are deleted automatically once you close your browser.
            Other cookies are <b>
            permanent cookies
         </b> , meaning that they survive after your browser is closed. They can be
            used to recognise your computer when you open your browser and browse the Internet again.
         </p>
         <h2 className={`text-lg font-semibold mt-4`}>
            What are cookies used for?
         </h2>
         <p className={`text-sm mt-2 max-w-2xl`}>
            Cookies are used for different purposes.
         </p>
         <ul className={`list-disc mt-4 text-sm !pl-4`}>
            <li>
               <b className={`mr-1`}>
                  Essential cookies
               </b>
               are needed to provide you with the website and to use some of its features, such as
               access to secure areas. Without these cookies, we would not be able to provide you with the website and
               services that you have asked for.
            </li>
            <li className={`mt-2`}>
               <b className={`mr-1`}>
                  Functionality cookies
               </b>
               record information about choices you have made and allow us to provide relevant
               content and tailor our websites for you.
            </li>
            <li className={`mt-2`}>
               <b className={`mr-1`}>
                  Performance cookies
               </b>
               help us to measure traffic and usage data and to analyze how our websites are used in
               order to provide you with a better user experience and maintain, operate and improve our Services.
            </li>
            <li className={`mt-2`}>
               <b className={`mr-1`}>
                  Targeting cookies
               </b>
               are used to make advertising messages more relevant to you. They perform functions like
               preventing the same advertisement from continuously reappearing, ensuring that advertisements are
               properly displayed and, in some cases, selecting advertisements that are based on your interests.

            </li>
         </ul>
         <h2 className={`text-lg font-semibold mt-4`}>
            What cookies do we use?
         </h2>
         <p className={`text-sm mt-2 max-w-2xl`}>
            We use first party and third party cookies for several reasons. The specific types of first and third-party
            cookies served through our websites and the purposes they perform are described in the table below. Please
            be aware that the cookies we use may depend on the features you are using and the device, browser or
            operating system you are using.
         </p>


         <h2 className={`text-lg font-semibold mt-4`}>
            Targeted advertising
         </h2>
         <p className={`text-sm mt-2 max-w-2xl`}>
            Third parties may serve cookies on your computer or mobile device to serve advertising through our Services.
            These companies may use information about your visits to this and other sites in order to provide relevant
            advertisements about goods and services that you may be interested in. They may also employ technology that
            is used to measure the effectiveness of advertisements. This can be accomplished by them using cookies or
            web beacons to collect information about your visits to this and other sites in order to provide relevant
            advertisements about goods and services of potential interest to you. The information collected through this
            process does not enable us or them to identify your name, contact details or other personally identifying
            details unless you choose to provide these.
         </p>
         <h2 className={`text-lg font-semibold mt-4`}>
            How to control cookies and similar technologies
         </h2>
         <p className={`text-sm mt-2 max-w-2xl`}>
            Some of these cookies are essential and we cannot provide our service to you without them, but there are
            others that can be turned off. Note that, depending on the type of device you have, it may not be possible
            to delete or disable tracking mechanisms. However, in many instances these technologies are reliant on
            cookies to function properly so declining cookies will impair the functionality of these technologies.
            Please also note that turning off certain cookies will disable some of the features available to you through
            our websites. We cannot guarantee that your experience on our websites will be as good as it could otherwise
            be.
         </p>

         <h2 className={`text-lg font-semibold mt-4`}>
            How to change your cookie preferences
         </h2>
         <p className={`text-sm mt-2 max-w-2xl`}>
            To change your cookie preferences, please click the button below.
         </p>
         <Button size={`default`} variant={`default`} className={`rounded-full !w-fit mt-2 shadow-md !px-6`}>
            Manage cookie
            settings</Button>

         <h2 className={`text-lg font-semibold mt-4`}>
            How to change your browser settings
         </h2>
         <p className={`text-sm mt-2 max-w-2xl`}>
            You can also change your preferences by changing the settings in your browser. For more information on how
            to manage the most popular browsers, please see below:
         </p>

         <ul className={`list-disc mt-4 text-sm !pl-4`}>
            <li>
               <Link target={`_blank`} className={`!text-blue-500`}
                     href={`https://support.google.com/chrome/answer/95647?hl=en`}>
                  Google Chrome
               </Link>
            </li>
            <li className={`mt-2`}>
               <Link target={`_blank`} className={`!text-blue-500`}
                     href={`https://support.google.com/chrome/answer/95647?hl=en`}>
                  Internet Explorer
               </Link>
            </li>
            <li className={`mt-2`}>
               <Link target={`_blank`} className={`!text-blue-500`}
                     href={`https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer?`}>
                  Firefox
               </Link>
            </li>
            <li className={`mt-2`}>
               <Link target={`_blank`} className={`!text-blue-500`}
                     href={`https://support.apple.com/en-au/guide/safari/sfri11471/`}>
                  Safari
               </Link>
            </li>
         </ul>
         <p className={`text-sm mt-2 max-w-2xl`}>
            If you want to change your settings at any time (for example, if you accept all cookies but later decide you
            do not want a certain type of cookie), you’ll need to use your browser settings to remove any third party
            cookies dropped on your previous visit.
         </p>
         <h2 className={`text-lg font-semibold mt-4`}>
            How to opt-out of online ads
         </h2>
         <p className={`text-sm mt-2 max-w-2xl`}>
            Some users will have the option to opt- out of seeing targeted online ads from participating companies by
            visiting <Link target={`_blank`} className={`!text-blue-500`}
                           href={`https://www.aboutads.info/choices/`}>https://www.aboutads.info/choices/</Link>,
            <Link target={`_blank`} className={`!text-blue-500 mx-1`}
                  href={`https://www.youronlinechoices.com`}>https://www.youronlinechoices.com</Link>
            or similar websites in your
            jurisdiction. Please note that this list will contain more networks than those used on our site. To learn
            more about the advertising companies we work with and the choices they offer, please take a look at the
            following resources:
         </p>
         <ul className={`list-disc mt-4 text-sm !pl-4`}>
            <li>
               <Link target={`_blank`} className={`!text-blue-500`} href={`https://digitaladvertisingalliance.org/`}>
                  Digital Advertising Alliance
               </Link>
            </li>
            <li className={`mt-2`}>
               <Link target={`_blank`} className={`!text-blue-500`} href={`https://edaa.eu/`}>
                  European Interactive Digital Advertising Alliance
               </Link>
            </li>
         </ul>

         <h2 className={`text-lg font-semibold mt-4`}>
            How to opt-out of mobile advertising
         </h2>
         <p className={`text-sm mt-2 max-w-2xl`}>
            If you are using a mobile device, you can opt-out of having your mobile advertising identifiers used for
            certain types of targeted advertising, including those performed by us, by accessing the settings in your
            Apple or Android mobile device and following the most recent published instructions. If you opt-out, the
            random ID we (or our third-party partners) had previously assigned to you will also be removed. This means
            that if at a later stage, you decide to opt-in, we will not be able to continue and track you using the same
            ID as before, and you will effectively be a new user to our system.
         </p>

         <h2 className={`text-lg font-semibold mt-4`}>
            How to opt-out of third party cookies
         </h2>
         <p className={`text-sm mt-2 max-w-2xl`}>
            In addition to managing cookies in your browser settings, you can also opt-out of certain third-party
            cookies. For example, we use Google Analytics to help us understand how users engage with our websites,
            compile reports and improve our services. The reports disclose website trends without identifying individual
            users. You can opt-out of these cookies without affecting how you visit our websites.
         </p>

         <h2 className={`text-lg font-semibold mt-4`}>
            Google Analytics
         </h2>
         <p className={`text-sm mt-2 max-w-2xl`}>
            This website uses Google Analytics, a web analytics service provided by Google, Inc. (Google). Google
            Analytics uses &quot;cookies&quot;, which are text files placed on your computer, to help the website analyze how
            users use the site. The information generated by the cookie about your use of the website (including your IP
            address) will be transmitted to and stored by Google on servers in the United States. In case of activation
            of the IP anonymization, Google will truncate/anonymize the last octet of the IP address for Member States
            of the European Union as well as for other parties to the Agreement on the European Economic Area. Only in
            exceptional cases, the full IP address is sent to and shortened by Google servers in the USA. On behalf of
            the website provider Google will use this information for the purpose of evaluating your use of the website,
            compiling reports on website activity for website operators and providing other services relating to website
            activity and internet usage to the website provider. Google will not associate your IP address with any
            other data held by Google. You may refuse the use of cookies by selecting the appropriate settings on your
            browser. However, please note that if you do this, you may not be able to use the full functionality of this
            website. Furthermore you can prevent Google&apos;s collection and use of data (cookies and IP address) by
            downloading and installing the browser plug-in available under
            <Link target={`_blank`} className={`!text-blue-500 ml-1`} href={`https://tools.google.com/dlpage/gaoptout`}>
               https://tools.google.com/dlpage/gaoptout
            </Link>.
         </p>

         <p className={`text-sm mt-2 max-w-2xl`}>
            For more information on Google Analytics, see <Link target={`_blank`} className={`!text-blue-500`}
                                                                href={`https://policies.google.com/technologies/partner-sites`}>
            here
         </Link>, and to opt-out from being tracked by Google Analytics,
            see <Link target={`_blank`} className={`!text-blue-500`} href={`https://allaboutdnt.com/`}>
            here
         </Link>.
         </p>
         <h2 className={`text-lg font-semibold mt-4`}>
            Do Not Track
         </h2>
         <p className={`text-sm mt-2 max-w-2xl`}>
            Some browsers include the ability to transmit “Do Not Track” or “DNT” signals. Our website does not
            currently respond to “DNT” signals. We will continue to monitor developments around DNT browser technology
            and the implementation of standard signals. To learn more about “DNT”, see <Link target={`_blank`}
                                                                                             className={`!text-blue-500`}
                                                                                             href={`https://allaboutdnt.com/`}>
            here
         </Link>.
         </p>

         <h2 className={`text-lg font-semibold mt-4`}>
            Changes to this policy
         </h2>
         <p className={`text-sm mt-2 max-w-2xl`}>
            We may update this policy from time to time to reflect our current practice and ensure compliance with
            applicable laws. When we post changes to this policy, we will revise the “Last Updated” date at the top of
            this policy. If we make any material changes to the way we use cookies, we will take appropriate measures to
            notify you. We recommend that you check this page from time to time to inform yourself of any changes.
         </p>
         <h2 className={`text-lg font-semibold mt-4`}>
            How to contact us

         </h2>
         <p className={`text-sm mt-2 max-w-2xl`}>
            If you have any questions, suggestions or concerns about our use of cookies or this cookies policy, please
            contact us at:
         </p>
         <ul className={`list-disc mt-4 text-sm !pl-4`}>
            <li>
               Email: <a href={`mailto:info@${APP_NAME.toLowerCase()}.com`}>
               info@{APP_NAME.toLowerCase()}.com
            </a>
            </li>
            <li className={`mt-2`}>
               Write: {APP_NAME}, a Bulgarian brand
               <br />
               Kesten 14
               <br />
               9000 Varna
               <br />
               Bulgaria
            </li>
         </ul>
      </div>
   );
};

export default Page;
