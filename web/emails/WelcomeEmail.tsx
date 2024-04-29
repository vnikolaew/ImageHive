import React from "react";
import { Html, Section, Tailwind, Text, Link, Hr } from "@react-email/components";
import { APP_NAME } from "@/lib/consts";

export interface WelcomeEmailProps {
   username : string
}

const WelcomeEmail = ({username}: WelcomeEmailProps) => {
   return (
      <Html lang="en">
         <Tailwind
            config={{
               theme: {
                  extend: {
                     colors: {
                        brand: "#007291",
                     },
                  },
               },
            }}
         >
            <Section >
               <Text className={`text-base`}>Dear {username ?? `John`},
               </Text>
               <Text className={`text-base`}>
                  Welcome to <b>{APP_NAME}</b>! We&apos;re thrilled to have you on board and excited to see the
                  memories you&apos;ll create and share with our community.
               </Text>

               <Text className={`text-base !w-2/3`}>
                  At <b>{APP_NAME}</b>, we believe in the power of images to connect people, spark conversations,
                  and inspire creativity. Whether you&apos;re a seasoned photographer or someone who simply loves
                  capturing moments on the go, our platform provides the perfect space for you to showcase your work and
                  discover inspiring content from others.
               </Text>

               <Text className={`text-base`}>
                  Here are a few things you can do to get started:
               </Text>

               <Text className={`text-base`}>
                  <ol>
                     <li>
                        Upload your favorite photos and create albums to organize them.
                     </li>
                     <li>
                        Explore the diverse range of photos shared by other users and connect with fellow
                        enthusiasts.
                     </li>
                     <li>
                        Engage with the community by liking, commenting, and sharing photos that resonate with you.
                     </li>
                     <li>
                        Customize your profile to reflect your unique style and interests.
                     </li>
                  </ol>
               </Text>
               <Text className={`text-base`}>
                  We&apos;re constantly working to improve {APP_NAME} and enhance your experience, so
                  don&apos;t hesitate to share any feedback or suggestions you may have.
               </Text>
               <Text className={`text-base`}>
                  Once again, welcome to <b>{APP_NAME}</b>! We can&apos;t wait to see the world through your
                  lens.
               </Text>
               <Text className={`text-base`}>
                  Best regards,
               </Text>
               <Text className={`text-base`}>
                  Victorio Nikolaev <br />
                  CEO @ ImageHive Team <br />
               </Text>
               <Text className={`text-base`}>
                  Explore <Link className={`mx-.5`} href={process.env.BASE_URL ?? `/`}>{APP_NAME}</Link> now!
               </Text>

               <Hr />
               <Text className={`text-sm`}>
                  © Copyright {new Date().getFullYear()} {APP_NAME}, Inc. All Rights Reserved.
               </Text>
            </Section>
         </Tailwind>
      </Html>
   )
      ;
};

export default WelcomeEmail;