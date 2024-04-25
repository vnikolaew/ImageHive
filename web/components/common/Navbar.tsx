"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { ThemeSwitch } from "@/components/common/ThemeSwitch";
import Image from "next/image";
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
import { LogOut, Upload } from "lucide-react";
import NavSearchBar from "@/components/common/NavSearchBar";
import { useWindowScroll } from "@uidotdev/usehooks";
import { useMemo, useRef } from "react";
import { usePathname } from "next/navigation";

const Navbar = () => {
   const { data } = useSession();
   const pathname = usePathname();
   const darkMode = useIsDarkMode();
   const { openModal } = useModals();
   const { loading, action: signOutAction } = usePromise(async () => {
      await signOut({ redirect: true, callbackUrl: `/` });
   });

   const navRef = useRef<HTMLElement>(null!);
   const [{ y }] = useWindowScroll();
   const showNavbarBackground = useMemo(() => {
      return y! >= navRef?.current?.clientHeight;
   }, [y]);

   return (
      <nav
         ref={navRef}
         className={cn(`w-full navbar-dark bg-transparent flex items-center justify-between gap-24 px-12 py-4 shadow-sm !z-20 rounded--bxl sticky transition-colors duration-300`,
            (pathname === `/` || pathname.startsWith(`/users`)) && `fixed`,
            (pathname.startsWith(`/users`)) && `bg-transparent`,
            showNavbarBackground && `bg-background border-b-[1px]`,
         )}>
         <h2 className="text-xl cursor-pointer">
            <Link href={`/`}>
               <Image alt={`logo`} width={120} height={30}
                      src={!darkMode ? Logo : (darkMode || !showNavbarBackground) ? LogoDark : Logo} />
            </Link>
         </h2>
         <div className={`flex-1`}>
            {(showNavbarBackground || pathname.startsWith(`/users`)) && (
               <NavSearchBar showNavbarBackground={showNavbarBackground} />
            )}
         </div>
         <div className="mr-8 flex items-center gap-4">
            <ThemeSwitch showNavbarBackground={showNavbarBackground} />
            <div className={`flex items-center gap-4`}>
               <SignedIn>
                  <DropdownMenu modal>
                     <DropdownMenuTrigger asChild>
                        <Image
                           className={cn(`rounded-full cursor-pointer bg-white border-neutral-200`,
                              !data?.user?.image && `p-1`)}
                           height={36}
                           width={36}

                           src={data?.user?.image ?? DefaultAvatar} alt={``} />
                     </DropdownMenuTrigger>
                     <DropdownMenuContent className={`min-w-[200px] p-1 -left-1/2`}>
                        <DropdownMenuLabel className={`font-normal`}>
                           Signed in as <b>
                           {data?.user?.name}
                        </b>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Link href={`/users/${data?.user?.id}`}>
                           <DropdownMenuItem className={`cursor-pointer py-2 px-5`}>
                              Profile
                           </DropdownMenuItem>
                        </Link>
                        <Link href={`/account/media`}>
                           <DropdownMenuItem className={`cursor-pointer py-2 px-5`}>
                              My images
                           </DropdownMenuItem>
                        </Link>
                        <Link href={`/`}>
                           <DropdownMenuItem className={`cursor-pointer py-2 px-5`}>
                              Team
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