"use client";
import React from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { ThemeSwitch } from "@/components/common/ThemeSwitch";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import imageHiveLogo from "../../public/ImageHive-logo.png";
import imageHiveDarkLogo from "../../public/ImageHive-logo-dark.png";
import { useTheme } from "next-themes";
import { useIsSignedIn } from "@/hooks/useIsSignedIn";
import {
   DropdownMenu,
   DropdownMenuContent, DropdownMenuItem,
   DropdownMenuLabel, DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const Navbar = () => {
   const { status, data } = useSession();
   const isSignedIn = useIsSignedIn();
   const { theme } = useTheme();

   return (
      <header className={`w-full p-0`}>
         <nav
            className="w-full navbar-dark bg-dark flex items-center justify-between px-12 py-4 rounded-md shadow-sm fixed !z-100">
            <h2 className="text-xl cursor-pointer">
               <Link href={`/`}>
                  <Image alt={`logo`} height={30} src={theme === `dark` ? imageHiveDarkLogo : imageHiveLogo} />
               </Link>
            </h2>
            <div className="mr-8 flex items-center gap-4">
               <ThemeSwitch />
               <div>{isSignedIn && (
                  <>
                     <DropdownMenu open modal>
                        <DropdownMenuTrigger asChild>
                           <Image className={`rounded-full shadow-md cursor-pointer`} height={36} width={36}
                                  src={data!.user!.image!} alt={``} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className={`w-fit p-1 -left-1/2`}>
                           <DropdownMenuLabel>Signed in as {data?.user?.name}</DropdownMenuLabel>
                           <DropdownMenuSeparator />
                           <DropdownMenuItem>Profile</DropdownMenuItem>
                           <DropdownMenuItem>Billing</DropdownMenuItem>
                           <DropdownMenuItem>Team</DropdownMenuItem>
                           <DropdownMenuItem className={`flex mt-2 justify-center w-full hover:!bg-transparent`}>
                              <Button className={`!px-6`} size={`sm`} variant={`destructive`} onClick={async () => {
                                 await signOut();
                              }}>Sign out</Button>
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                  </>
               )}</div>
            </div>
         </nav>
         <Separator className={`w-full bg-neutral-300 h-[1px] rounded-md shadow-md`} />
      </header>
   );
};

export default Navbar;