import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@components/dropdown-menu";
import React from "react";
import { cn, getSessionImageSrc } from "@utils";
import Link from "next/link";
import { default as NextImage } from "next/image";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@components/button";
import { LogOut, User, Image, Upload, BarChart3, Library, UserRoundCheck, Mail, Settings } from "lucide-react";
import { usePromise } from "@web/hooks/usePromise";
import DefaultAvatar from "../../public/default-avatar.png";

export interface NavbarUserMenuProps {
}

const NavbarUserMenu = ({}: NavbarUserMenuProps) => {
   const { data } = useSession();
   const { loading, action: signOutAction } = usePromise(async () => {
      await signOut({ redirect: true, callbackUrl: `/` });
   });
   console.log(data.user.image);

   return (
      <DropdownMenu modal>
         <DropdownMenuTrigger asChild>
            <NextImage
               className={cn(`rounded-full cursor-pointer bg-white border-neutral-200 !h-9 !w-9`,
                  !data?.user?.image && `p-1`)}
               height={36}
               width={36}
               src={data?.user?.image ? getSessionImageSrc(data.user.image) : DefaultAvatar} alt={data.user.name} />
         </DropdownMenuTrigger>
         <DropdownMenuContent className={`min-w-[200px] p-1 -left-1/2`}>
            <DropdownMenuLabel className={`font-normal`}>
               Signed in as <b>
               {data?.user?.name}
            </b>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href={`/users/${data?.user?.id}`}>
               <DropdownMenuItem className={`cursor-pointer py-2 px-4 flex items-center gap-2`}>
                  <User size={14} />
                  Profile
               </DropdownMenuItem>
            </Link>
            <Link href={`/account/media`}>
               <DropdownMenuItem className={`cursor-pointer py-2 px-4 flex items-center gap-2`}>
                  <Image size={14} />
                  My images
               </DropdownMenuItem>
            </Link>
            <Link href={`/upload`}>
               <DropdownMenuItem className={`cursor-pointer py-2 px-4 flex items-center gap-2`}>
                  <Upload size={14} />
                  Upload
               </DropdownMenuItem>
            </Link>
            <Link href={`/account/statistics`}>
               <DropdownMenuItem className={`cursor-pointer py-2 px-4 flex items-center gap-2`}>
                  <BarChart3 size={14} />
                  Statistics
               </DropdownMenuItem>
            </Link>
            <Link href={`/account/collections`}>
               <DropdownMenuItem className={`cursor-pointer py-2 px-4 flex items-center gap-2`}>
                  <Library size={14} />
                  Collections
               </DropdownMenuItem>
            </Link>
            <Link href={`/account/following`}>
               <DropdownMenuItem className={`cursor-pointer py-2 px-4 flex items-center gap-2`}>
                  <UserRoundCheck size={14} />
                  Following
               </DropdownMenuItem>
            </Link>
            <Link href={`/account/messages/inbox`}>
               <DropdownMenuItem className={`cursor-pointer py-2 px-4 flex items-center gap-2`}>
                  <Mail size={14} />
                  Messages
               </DropdownMenuItem>
            </Link>
            <Link href={`/account/settings`}>
               <DropdownMenuItem className={`cursor-pointer py-2 px-4 flex items-center gap-2`}>
                  <Settings size={14} />
                  Settings
               </DropdownMenuItem>
            </Link>
            <DropdownMenuItem className={`flex my-2 justify-center w-full hover:!bg-transparent`}>
               <Button
                  disabled={loading}
                  className={`!px-8 rounded-full gap-3 !py-2 shadow-md`} variant={`destructive`}
                  onClick={() => signOutAction()}>
                  <LogOut size={14} />
                  Sign out
               </Button>
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   );
};

export default NavbarUserMenu;
