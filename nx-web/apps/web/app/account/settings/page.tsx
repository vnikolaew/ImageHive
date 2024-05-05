import React from "react";
import EditProfileFormWrapper from "./_components/EditProfileFormWrapper";
import { getUserProfile } from "./_queries";

const Page = async () => {
   const user = await getUserProfile()
   return (
      <div className={`my-8 min-h-[70vh]`}>
         <EditProfileFormWrapper userProfile={user!.profile!} user={user!} />
      </div>
   );
};

export default Page;
