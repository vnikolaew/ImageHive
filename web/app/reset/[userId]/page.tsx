import React from "react";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import ResetPasswordForm from "@/app/reset/[userId]/ResetPasswordForm";

const Page = async () => {
   const headersList = headers();
   const url = headersList.get("referer") || headersList.get(`next-url`) || "";

   console.log({ url });
   const { pathname, searchParams } = new URL(url);

   const userId = pathname.split("/")?.at(-1)!.trim();
   const token = searchParams?.get("token");

   if (!userId) {
      return <div>No user Id supplied.</div>;
   }

   if (!token) {
      return <div>No token supplied.</div>;
   }

   const user = await prisma.user.findFirst(
      { where: { id: userId },
         include: { accounts: true } });
   if (!user) {
      return <div>User with ID {userId} was not found.</div>;
   }

   const success = user.accounts.some(a => a.metadata?.reset_token === token);
   const payload = jwt.verify(token, process.env.RESET_TOKEN_SECRET!, {
      maxAge: 60 * 60 * 10,
   });

   console.log({ success: success && payload.data === userId });

   return (
      <div className={`m-12`}>
         <ResetPasswordForm userId={user.id} token={token} />
      </div>
   );
};

export default Page;
