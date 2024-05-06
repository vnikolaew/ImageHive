"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../public/ImageHive-logo.png";
import LogoDark from "../../public/ImageHive-logo-dark.png";
import DefaultAvatar from "../../public/default-avatar.png";
import { LogOut, Upload } from "lucide-react";
import { useWindowScroll } from "@uidotdev/usehooks";
import { useEffect, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";
import { useIsDarkMode } from "@web/hooks/useIsDarkMode";
import { ModalType, useModals } from "@web/providers/ModalsProvider";
import NavSearchBar from "./NavSearchBar";
import { ThemeSwitch } from "./ThemeSwitch";
import { SignedIn, SignedOut } from "./Auth";
import { Button } from "@components/button";
import { cn } from "@utils";
import NavbarUserMenu from "@web/components/common/NavbarUserMenu";

const Navbar = () => {
   const { data } = useSession();
   const pathname = usePathname();
   const darkMode = useIsDarkMode();
   const { openModal } = useModals();

   useEffect(() => {
      if ("scrollRestoration" in window.history) {
         window.history.scrollRestoration = "manual";
      }
   }, []);

   const navRef = useRef<HTMLElement>(null!);
   const [{ y }] = useWindowScroll();
   const showNavbarBackground = useMemo(() => {
      return y! >= navRef?.current?.clientHeight;
   }, [y]);

   return (
      <nav
         id={`navbar`}
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
            <div className={`flex items-center gap-2`}>
               <SignedIn>
                  <NavbarUserMenu />
                  <div className={cn(`text-sm font-semibold text-black mr-4`,
                     showNavbarBackground ? `text-white` : `text-white`,
                     !darkMode && `!text-black`,
                     pathname.startsWith(`/users`) && `!text-white`,
                     // showNavbarBackground ? `!text-black` : `text-white`,
                  )}>
                     {data?.user?.name}
                  </div>
                  <Button asChild variant={`default`} className={`gap-3 text-white dark:text-black !px-5 rounded-lg`}>
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
