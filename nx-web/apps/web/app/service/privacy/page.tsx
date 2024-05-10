import React from "react";
import { APP_NAME } from "@nx-web/shared";
import Link from "next/link";

export interface PageProps {
}

const Page = ({}: PageProps) => {
   return (
      <div className="w-full flex flex-col gap-2">
         <h2 className={`text-xl font-semibold`}>
            Privacy Policy
         </h2>
         <p className={`text-sm mt-2 max-w-2xl`}>
            We are {APP_NAME}, a Canva Germany GmbH brand (&quot;{APP_NAME}&quot;). This privacy policy applies to {APP_NAME}&apos;s
            website
            at
            {APP_NAME}.com (the &quot;Website&quot;) and all related websites, software, mobile apps, plug-ins and other services
            that we provide (together, the &quot;Service&quot;).
         </p>
         <p className={`text-sm mt-2 max-w-2xl`}>
            This privacy policy explains how we and our affiliates collect, use, disclose and safeguard the information
            you provide while accessing and using the Service. It also explains how you can exercise your privacy
            rights. If you have any questions, suggestions or complaints about our use of your personal information or
            this privacy policy, please contact us using the details provided at the bottom of this page.
         </p>

         <h2 className={`text-lg font-semibold mt-4`}>
            Personal information we collect
         </h2>
         <p className={`text-sm mt-2 max-w-2xl`}>
            Certain parts of the Service may ask you to provide personal information voluntarily, such as your first and
            last name, date of birth, gender, the city and country you live in, information about you, your PayPal
            address, online profiles, uploaded media and email address. This information will be displayed on your
            public profile page on {APP_NAME} and can be edited and removed at any time.
         </p>
         <p className={`text-sm mt-2 max-w-2xl`}>
            We also collect personal information in any messages you send to us and other users through the Service
            (such as user feedback, messages and search queries), and may collect personal information in content you
            upload to the Service (such as photos or videos you upload and the metadata about your content). We use this
            information to operate, maintain, and provide the features and functionality of the Service, to correspond
            with you, and to address any issues you raise about our services. You must not upload photos or other
            content containing any personal data of third parties without their express consent.
         </p>
         <p className={`text-sm mt-2 max-w-2xl`}>
            If you don’t provide your information to us, you may not be able to access or use certain features of the
            Service or your experience of using the Service may not be as enjoyable.
         </p>

         <p className={`text-sm mt-2 max-w-2xl`}>
            We may receive information about you from third parties. For example, when you log into the Service using a
            third-party account (such as Facebook) we may also collect certain information from the third-party
            necessary to authenticate your account, such as your email address and any other information you allow the
            third party to share with us. You should always review, and if necessary, adjust your privacy settings on
            third-party websites and services before linking or connecting them to our Service. You may also unlink your
            third-party account from our websites by adjusting your settings on the third-party service. If you unlink
            your third-party account, we will no longer receive information collected about you in connection with that
            service.
         </p>

         <p className={`text-sm mt-2 max-w-2xl`}>
            We will directly collect or generate certain information about your use of the Service (such as user
            activity data, analytics event data and clickstream data), for data analytics and machine learning, and to
            help us measure traffic and usage trends for the Service. We may also use third party analytics tools that
            automatically collect information sent by your browser or mobile device, including the pages you visit and
            other information that assists us in improving the Service. For more information, please see the paragraphs
            below on cookies information, log file information, clear gifs, device identifiers, and location data.
         </p>

         <p className={`text-sm mt-2 max-w-2xl`}>
            When you visit the Service, we (and our third-party partners) will send cookies — small text files
            containing a string of alphanumeric characters — to your computer that uniquely identifies your browser and
            lets us do things like help you log in faster, enhance your navigation through the site, remember your
            preferences and generally improve the user experience. Cookies also convey information to us about how you
            use the Service (e.g., the pages you view, the links you click and other actions you take on the Service),
            and allow us or our business partners to track your usage of the Service over time. They also allow us to
            measure traffic and usage trends for the Service, deliver personalized advertisements that may be of
            interest to you and measure their effectiveness, and find potential new users of the Service.
         </p>

         <p className={`text-sm mt-2 max-w-2xl`}>
            You can control or reset your cookies and similar technologies through your web browser, which will allow
            you to customize your cookie preferences and to refuse all cookies or to indicate when a cookie is being
            sent. However, some features of the Service may not function properly if the ability to accept cookies is
            disabled. For more information on how we use cookies and other technologies and how you can control them,
            please read our <Link className={`text-blue-500`} href={`/service/cookie-policy`}>
            Cookies Policy
         </Link>.
         </p>
         <p className={`text-sm mt-2 max-w-2xl`}>
            Log file information is automatically reported by your browser or mobile device each time you access the
            Service. When you use our Service, our servers automatically record certain log file information. These
            server logs may include anonymous information such as your web request, browser type, referring / exit pages
            and URLs, number of clicks and how you interact with links on the Service, domain names, landing pages,
            pages viewed, and other such information.


         </p>
         <p className={`text-sm mt-2 max-w-2xl`}>
            When you use the Service, we may employ clear GIFs (also known as web beacons) which are used to anonymously
            track the online usage patterns of our users. In addition, we may also use clear GIFs in HTML-based emails
            sent to our users to track which emails are opened and which links are clicked by recipients. This
            information allows for more accurate reporting and improvement of the Service.
         </p>
         <p className={`text-sm mt-2 max-w-2xl`}>
            When you access the Service on a device (including smart-phones or tablets), we may access, collect and/or
            monitor one or more “device identifiers,” such as a universally unique identifier (“UUID”). Device
            identifiers are small data files that uniquely identify your mobile device. A device identifier may convey
            information to us about how you use the Service. A device identifier may remain persistently on your device,
            to help you log in and navigate the Service better. Some features of the Service may not function properly
            if use of device identifiers is impaired.
         </p>
         <p className={`text-sm mt-2 max-w-2xl`}>
            We collect information in order to understand where our users are located for a number of reasons. We may
            collect your precise or approximate location:
         </p>
         <ul className={`list-disc mt-4 text-sm !pl-4`}>
            <li>
               from you, when you provide, correct or confirm your location (e.g., when you purchase products from us);
            </li>
            <li className={`mt-2`}>
               by inferring your location from your IP address; and
            </li>
            <li className={`mt-2`}>
               from our third party partners.
            </li>
         </ul>

         <h2 className={`text-lg font-semibold mt-4`}>
            How we use your information
         </h2>
         <p className={`text-sm mt-2 max-w-2xl`}>
            We use the information we collect about you for the purposes set out below:
         </p>
         <ul className={`list-disc mt-4 text-sm !pl-4 max-w-2xl`}>
            <li>
               Providing you with the Service: We use the information that you directly give us to provide the Service
               to you. This includes allowing you to log in to the Service, operating and maintaining the Service and
               giving you access to your Content. We may also use information we collect about you automatically to
               remember information about you so that you will not have to re-enter it during your visit or the next
               time you visit the site.
            </li>
            <li className={`mt-2`}>
               For data analytics: We use information about you to help us improve the Service and our users’
               experience, including by monitoring aggregate metrics such as total number of visitors, traffic, and
               demographic patterns.
            </li>
            <li className={`mt-2`}>
               For analytics and machine learning: We may analyze your activity, Content, and related data activity in
               your account to provide and customize the Service, and to train our algorithms, models, products and
               services using machine learning to develop, improve and provide our Service. If you don’t want your
               Content to be used for machine learning, you can opt out by updating your preferences in your account
               settings at any time.
               <p className={`mt-2`}>
                  These activities include, but are not limited to:
               </p>
               <ul className={`mt-0 text-sm !pl-4 max-w-2xl`} style={{
                  listStyleType: `circle`,
               }}>
                  <li>
                     labeling and detecting components in images (e.g., background, eyes);
                  </li>
                  <li>
                     labeling raw individual data (e.g., “man with dog”);
                  </li>
                  <li>
                     detecting content prohibited by our <Link href={`/service/terms`}>
                     Terms
                  </Link> for moderation and security purposes (e.g., pornographic
                     or copyright protected material);
                  </li>
                  <li>
                     translating audio soundtracks;
                  </li>
                  <li>
                     predicting the most relevant product offerings for a user to tailor communications and advertising;
                     and
                  </li>
                  <li>
                     search terms and corresponding search results interaction data to build an algorithm to deliver the
                     most relevant content result.
                  </li>
               </ul>
            </li>
            <li className={`mt-2`}>
               Customizing the Service for you: We may use and combine the information you provide us and information
               about you that we collect automatically and receive from other sources (including information we receive
               on and off our Service) and combine it with information about the behavior of other users to make sure
               that your use of the Service is customized to your needs. For example, to recommend content that is
               likely to be useful to you, we may use information derived from your prior behavior on our Service, the
               use of content by other people and other inferred information.
            </li>
            <li className={`mt-2`}>
               To communicate with you about the Service: We may use your contact information to get in touch with you
               and to send communications about critical elements of the Service. For example, we may send you emails
               about technical issues, security alerts or administrative matters.
            </li>
            <li className={`mt-2`}>
               To promote and drive engagement with the Service: We may use your contact information to get in touch
               with you about taking part in our surveys or about features and offers relating to the Service that we
               think you would be interested in. We may also use information we collect about you to make sure that you
               get the most relevant offers and promotions based on your use of the Service, and your preferences.

            </li>
            <li className={`mt-2`}>
               To improve the Service: We analyze information about your use of the Service and your content to better
               understand how users are engaging with our Service and measure the effectiveness of the Service so we can
               make improvements and develop our services for users.
            </li>
            <li className={`mt-2`}>
               For advertising purposes: We may use information about you, including cookies information and other
               information we (and our third-party partners) collect from you automatically about your use of the
               Service, to serve, personalize and measure the effectiveness of advertising on the Service and
               third-party sites and platforms. This includes showing you advertising we think you might find
               interesting as well as displaying advertising to potential new users that have similar interests. For
               more information about how we use your information for advertising purposes, please see the section
               titled “Advertising” below.

            </li>
            <li className={`mt-2`}>
               Customer service: We use information about you, information that we collect or and from within your
               account, information that you provide to our customer service team, and information about your
               interactions with the Service to resolve technical issues you experience with the Service, and to ensure
               that we can repair and improve the Service for all users.
            </li>
            <li className={`mt-2`}>
               For security measures: We use information about you and from within your account to monitor activity that
               we think is suspicious or potentially fraudulent, and to identify violations of this Privacy Policy or
               our Terms.
            </li>
            <li className={`mt-2`}>
               For troubleshooting, error resolution and service improvement: We may need to review your content or
               information to support your request for help, correct general errors with the Service or improve our
               services.
            </li>

            <li className={`mt-2`}>
               For matters that we are required to use your information by law: We will use or disclose your information
               where we reasonably believe that such action is necessary to (a) comply with the law and the reasonable
               requests of law enforcement; (b) to enforce our Terms or to protect the security or integrity of our
               Service; and/or (c) to exercise or protect the rights, property, or personal safety of {APP_NAME}, our
               users
               or others.
            </li>
         </ul>
         <h2 className={`text-lg font-semibold mt-4`}>
            Legal basis for processing personal information
         </h2>
         <p className={`text-sm mt-2 max-w-2xl`}>
            If you are located in the EEA, Switzerland or UK, we need a legal basis to collect, use and disclose your
            personal information. Our lawful basis will depend on the information concerned and the context in which it
            is processed.
         </p>
         <p className={`text-sm mt-2 max-w-2xl`}>
            Generally, {APP_NAME} will collect and use your information as follows:
         </p>
         <ul className={`list-disc mt-4 text-sm !pl-4 max-w-2xl`}>
            <li>
               Contractual necessity: We need it to provide the Service to you and fulfil our obligations to you under
               our Terms of Service. For example, this includes creating and maintaining your account, resolving issues
               you may experience with the Service and providing you with access to your Content.

            </li>
            <li className={`mt-2`}>
               Legitimate interests: It is necessary for our legitimate interests for example, providing a useful and
               customized Service, sending you relevant marketing messages, displaying advertising and tracking its
               effectiveness, using information we collect about you (like your platform usage and search terms) so that
               we can make more informed predictions, decisions and offers for our users, helping users connect with our
               community and enhancing our Service via research and development, data analytics, data labelling, machine
               learning and predictive analytics relating to your usage data. We do not rely on this lawful basis where
               our legitimate interests are overridden by your rights and interests.
            </li>
            <li className={`mt-2`}>
               Consent: You consent to us, and our third party partners, using your information in a certain way - for
               example, to hear about new features or offers, and for machine learning and predictive analysis relating
               to your Content.
            </li>
            <li className={`mt-2`}>
               Legal obligations: It is necessary for compliance with our legal obligations - for example, to disclose
               your information in response to law enforcement requests and to retain your information for our record
               keeping purposes.
            </li>
         </ul>
         <p className={`text-sm mt-2 max-w-2xl`}>
            If you consented to our use of your information, you can withdraw that consent at any time. Depending on the
            situation you can either withdraw your consent by emailing info@{APP_NAME}.com, or through your account
            settings page.
         </p>
         <p className={`text-sm mt-2 max-w-2xl`}>
            Where we use your information for our legitimate interest, you have the right to object to that use by
            contacting info@{APP_NAME.toLowerCase()}.com. However, if you do, it may diminish the quality of the Service you receive
            or
            prevent you from using the Service.
         </p>

         <h2 className={`text-lg font-semibold mt-4`}>
            Sharing your information
         </h2>
         <p className={`text-sm mt-2 max-w-2xl`}>
            We respect and are committed to protecting your privacy.
         </p>
         <p className={`text-sm mt-2 max-w-2xl`}>
            However, we may disclose your personal information to our group companies, and to our services providers and
            partners who provide data processing services to us (for example, to support the delivery of, provide
            functionality on, or help to enhance the security of our websites) or who otherwise process data for
            purposes that are described in this privacy policy or notified to you when we collect your data.
         </p>
         <p className={`text-sm mt-3 max-w-2xl`}>
            In the event of a proposed purchase, merger or acquisition of any part of our business, we may disclose your
            personal information to an actual or potential buyer (and its agents and advisers) provided that we inform
            the buyer it must use your personal information only for the purposes disclosed in this privacy policy.
         </p>
         <p className={`text-sm mt-3 max-w-2xl`}>
            We may also aggregate or otherwise strip data of all personally identifying characteristics and may share
            that aggregated such anonymized data with third parties.
         </p>
         <p className={`text-sm mt-3 max-w-2xl`}>
            We reserve the right to disclose your personal information as required by law (e.g., to comply with a
            subpoena, warrant, or court order) and when we believe that disclosure is necessary to protect our rights,
            avoid litigation, protect your safety or the safety of others, investigate fraud, and/or respond to a
            government request. We may also disclose information about you if we determine that such disclosure should
            be made for reasons of national security, law enforcement, or other issues of public importance.
         </p>
         <p className={`text-sm mt-3 max-w-2xl`}>
            If you have consented to the disclosure of your personal information to any other third party, we may also
            share the data with them.
         </p>

         <h2 className={`text-lg font-semibold mt-4`}>
            How we transfer, store and protect your information
         </h2>
         <p className={`text-sm mt-3 max-w-2xl`}>
            Your information will be stored and processed in the United States, Australia, Singapore, the European
            Union, United Kingdom, Philippines and New Zealand and any other country in which {APP_NAME}, its group
            companies, service providers and partners maintain facilities or employ staff or contractors.
         </p>
         <p className={`text-sm mt-3 max-w-2xl`}>
            This means that your data may be transferred to and processed in countries other than the country in which
            you are located. These countries may have data protection laws that are different to the laws of your
            country (and, in some cases, may not be as protective).
         </p>
         <p className={`text-sm mt-3 max-w-2xl`}>
            However, we always take steps to ensure that your data will remain protected in accordance with this privacy
            policy and applicable data protection laws. These measures include transferring your data to a country that
            the European Commission or UK authorities (as applicable) have determined provides an adequate level of
            protection for personal data, or by implementing standard contractual clauses with our group companies,
            service providers and partners.
         </p>
         <h2 className={`text-lg font-semibold mt-4`}>
            Keeping your information safe
         </h2>
         <p className={`text-sm mt-3 max-w-2xl`}>
            We take commercially reasonable security measures designed to protect the security of the personal data,
            including protection against unauthorized or unlawful processing and against accidental loss, destruction or
            damage, using appropriate technical or organisational measures. To protect your privacy and security, we
            take reasonable steps (such as requesting a unique password) to verify your identity before granting you
            access to your account. You are responsible for maintaining the secrecy of your unique password and account
            information, and for controlling access to your account, at all times. However, we cannot ensure or warrant
            the security of any information you transmit to us or guarantee that information on the Service may not be
            accessed, disclosed, altered, or destroyed.
         </p>
         <h2 className={`text-lg font-semibold mt-4`}>
            Your rights
         </h2>
         <p className={`text-sm mt-3 max-w-2xl`}>
            You have the right to access the data we process about you, obtain rectification of inaccurate data, request
            deletion of your data, restrict our processing of your data, request portability of your data, and/or object
            to unreasonable processing. If we process your data on the basis of your consent, you have the option to
            withdraw your consent at any time. Doing so will not affect the lawfulness of the processing we carried out
            based on your consent up to the time of withdrawal.
         </p>
         <p className={`text-sm mt-3 max-w-2xl`}>
            You can exercise any of these rights by contacting us using the contact details provided at the bottom of
            this page under the “Contact us” heading. We respond to all requests we receive in accordance with
            applicable data protection laws. In some circumstances we will not be able to comply with your request
            regarding your personal data. If we are unable to remove any of your information, we will explain why.
         </p>
         <p className={`text-sm mt-3 max-w-2xl`}>
            You also have the right to opt-out of marketing communications we send you at any time. You can exercise
            this right by clicking on the “unsubscribe” or “opt-out” link in the marketing emails we send you or in your
            user profile page. You can also opt out of having your Content used for machine learning by updating your
            preferences in your account settings at any time. You can also contact us using the contact details provided
            at the bottom of this page under the “Contact us” heading.
         </p>
         <p className={`text-sm mt-3 max-w-2xl`}>
            If we are unable to resolve your request, or if you are concerned about a potential violation, you also have
            the option to report the issue or make a complaint to the data protection authority in your jurisdiction.
         </p>
         <h2 className={`text-lg font-semibold mt-4`}>
            Data retention

         </h2>
         <p className={`text-sm mt-3 max-w-2xl`}>
            We will retain your personal information for as long as your account is active or as needed to provide you
            with the Service or as necessary to comply with our legal obligations, resolve disputes, and enforce our
            agreements.
         </p>
         <p className={`text-sm mt-3 max-w-2xl`}>
            When we have no ongoing legitimate business need to process your information, we will either delete or
            anonymise it or, if this is not possible (for example, because your information has been stored in backup
            archives), then we will securely store your information and isolate it from any further processing until
            deletion is possible.
         </p>
         <h2 className={`text-lg font-semibold mt-4`}>
            Children
         </h2>
         <p className={`text-sm mt-3 max-w-2xl`}>
            As set out in our Terms, Children may not access or use the Service unless their use is directly authorized
            by their parent, guardian or another authorized adult who agrees to be bound by these Terms. For the
            purposes of these Terms, a child is a person under the age of 13 (or the minimum legal age required to
            provide consent for processing of personal data in the country where the child is located, noting 16 is the
            minimum legal age in Germany).
         </p>
         <p className={`text-sm mt-3 max-w-2xl`}>
            The Service and our content are not directed at children. Children are not permitted to sign up for the
            Service by themselves. We do not knowingly collect or solicit personal information from Children. If we
            learn that we have collected personal information from a child without verification of parental consent
            where this is required, we will delete that information as quickly as possible.
         </p>
         <h2 className={`text-lg font-semibold mt-4`}>
            Third-party service-based information
         </h2>
         <p className={`text-sm mt-3 max-w-2xl`}>
            {APP_NAME} is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program
            designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com.
         </p>
         <h2 className={`text-lg font-semibold mt-4`}>
            Advertising

         </h2>
         <p className={`text-sm mt-3 max-w-2xl`}>
            We partner with third-party ad servers, ad networks and social media platforms (like Facebook, Instagram,
            Google, Amazon Services LLC Associates and BuySellAds) to deliver personalized advertisements (“ads”) on our
            Service and other sites that may be of interest to you and/or to measure their effectiveness, and/or to
            identify potential new users of our Service.
         </p>
         <p className={`text-sm mt-3 max-w-2xl`}>
            We may share certain information with our third-party advertising partners, such as your email address,
            location, cookie information and information relating to your use of our Service, and allow partners to
            perform a match of your information against information from other third-party networks or sites to serve
            ads either on the Service or on third-party sites (including, but not limited to Facebook, Google) and to
            measure the effectiveness of these ads. We also share certain information with social media platforms, such
            as Facebook and TikTok, to display advertising to potential new users whose demographics and behaviour look
            like those of our existing users.
         </p>
         <p className={`text-sm mt-3 max-w-2xl`}>
            In addition, these third-party ad servers or ad networks may use technology to send, directly to your
            browser or mobile device, these personalized ads and ad links directly to your browser or mobile device, and
            will automatically receive your IP address when they do so. They may also use other technologies (such as
            cookies, JavaScript, device identifiers, location data, and clear gifs) to compile information about your
            browser’s or device’s visits and usage patterns on the Service, and to measure the effectiveness of their
            ads and to personalize the advertising content. Please see our Cookies Policy for more information about how
            we and our third-party partners use cookies and other technologies to deliver ads to you.
         </p>
         <p className={`text-sm mt-3 max-w-2xl`}>
            We do not sell or rent the information we collect about you with these third-party ad servers or ad networks
            for such parties’ own marketing purposes.
         </p>
         <p className={`text-sm mt-3 max-w-2xl`}>
            Please note that an advertiser may ask us to show an ad on the Service to a certain audience of users (e.g.,
            based on demographics or other interests). In that situation, we determine the target audience and we serve
            the advertising to that audience and only provide anonymous aggregated data to the advertiser. If you
            respond to such an ad, the advertiser or ad server may conclude that you fit the description of the audience
            they are trying to reach.
         </p>
         <p className={`text-sm mt-3 max-w-2xl`}>
            The {APP_NAME} Privacy Policy does not apply to, and we cannot control the activities of, third-party
            advertisers. Please consult the respective privacy policies of such advertisers or contact such advertisers
            for more information.
         </p>
         <h2 className={`text-lg font-semibold mt-4`}>
            Changes to this policy
         </h2>
         <p className={`text-sm mt-3 max-w-2xl`}>
            We may update this privacy policy from time to time to reflect our current practice and ensure compliance
            with applicable laws. When we post changes to this policy, we will revise the “Last Updated” date at the top
            of this policy. If we make any material changes to the way we collect, use, store and/or share your personal
            data, we will take appropriate measures to notify you. We recommend that you check this page from time to
            time to inform yourself of any changes.
         </p>
         <h2 className={`text-lg font-semibold mt-4`}>
            Contact us

         </h2>
         <p className={`text-sm mt-3 max-w-2xl`}>
            If you have any questions, suggestions or concerns about our use of your personal data or this privacy
            policy, please contact us at:
         </p>
         <ul className={`text-sm list-disc pl-4 mt-4`}>
            <li>
               Email address: <a href={`mailto:info@${APP_NAME.toLowerCase()}.com`}>
               info@{APP_NAME.toLowerCase()}.com
            </a>
            </li>
            <li>
               <p className={`text-sm mt-2 max-w-2xl`}>
                  {APP_NAME}, a Bulgarian brand
                  <br />
                  Kesten 14
                  <br />
                  9000 Varna
                  <br />
                  Bulgaria
               </p>
            </li>
         </ul>
      </div>
   );
};

export default Page;
