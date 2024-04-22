"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { ThemeSwitch } from "@/components/common/ThemeSwitch";
import Image from "next/image";
import { useIsSignedIn } from "@/hooks/useIsSignedIn";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Logo from "@/public/ImageHive-logo.png";
import LogoDark from "@/public/ImageHive-logo-dark.png";
import DefaultAvatar from "@/public/default-avatar.png";
import { Button } from "@/components/ui/button";
import { ModalType, useModals } from "@/providers/ModalsProvider";
import { cn } from "@/lib/utils";
import { useIsDarkMode } from "@/hooks/useIsDarkMode";
import { usePromise } from "@/hooks/usePromise";
import { SignedIn, SignedOut } from "@/components/common/Auth";
import { Upload } from "lucide-react";

const Navbar = () => {
   const { data } = useSession();
   const darkMode = useIsDarkMode();
   const { openModal } = useModals();
   const { loading, action: signOutAction } = usePromise(async () => {
      await signOut({ redirect: true, callbackUrl: `/` });
   });

   return (
      <nav
         className="w-full navbar-dark bg-dark flex items-center justify-between px-12 py-4 shadow-sm sticky !z-100 border-b-[1px] rounded-b-xl">
         <h2 className="text-xl cursor-pointer">
            <Link href={`/`}>
               <Image alt={`logo`} width={120} height={30}
                      src={darkMode ? LogoDark : Logo} />
            </Link>
         </h2>
         <div className="mr-8 flex items-center gap-4">
            <ThemeSwitch />
            <div className={`flex items-center gap-4`}>
               <SignedIn>
                     <DropdownMenu modal>
                        <DropdownMenuTrigger asChild>
                           <Image
                              className={cn(`rounded-full cursor-pointer bg-white border-[1px] border-neutral-200`,
                                 !data?.user?.image && `p-1`)}
                              height={36}
                              width={36}
                              src={data?.user?.image ?? DefaultAvatar} alt={``} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className={`min-w-[200px] p-1 -left-1/2`}>
                           <DropdownMenuLabel>Signed in as {data?.user?.name}</DropdownMenuLabel>
                           <DropdownMenuSeparator />
                           <Link href={`/profile`}>
                              <DropdownMenuItem className={`cursor-pointer py-2 px-5`}>
                                 Profile
                              </DropdownMenuItem>
                           </Link>
                           <Link href={`/`}>
                              <DropdownMenuItem className={`cursor-pointer py-2 px-5`}>
                                 Billing
                              </DropdownMenuItem>
                           </Link>
                           <Link href={`/`}>
                              <DropdownMenuItem className={`cursor-pointer py-2 px-5`}>
                                 Team
                              </DropdownMenuItem>
                           </Link>
                           <DropdownMenuItem className={`flex mt-2 justify-center w-full hover:!bg-transparent`}>
                              <Button
                                 disabled={loading}
                                 className={`!px-6 rounded-lg !py-2 shadow-md`} variant={`destructive`}
                                 onClick={() => signOutAction()}>
                                 Sign out
                              </Button>
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                  <Button asChild variant={`default`} className={`gap-3 text-default !px-5 rounded-lg`}>
                     <Link href={`/upload`}>
                        <Upload size={16} />
                        Upload
                     </Link>
                  </Button>
               </SignedIn>
               <SignedOut>
                  <div className={`gap-4 flex`}>
                     <Button
                        onClick={_ => openModal(ModalType.SIGN_IN)}
                        variant={`secondary`}
                        className={`px-6 shadow-md !py-0`}>Log in</Button>
                     <Button
                        onClick={_ => openModal(ModalType.SIGN_UP)}
                        variant={`default`}
                        className={`px-6 shadow-md !py-1`}>Join now</Button>
                  </div>
               </SignedOut>
            </div>
         </div>
      </nav>
   );
};

export default Navbar;