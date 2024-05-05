"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@components/dropdown-menu";
import { Button } from "@components/button";
import { cn } from "@utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@components/tooltip";


interface ThemeSwitchProps {
   showNavbarBackground: boolean;
}

export function ThemeSwitch({ showNavbarBackground }: ThemeSwitchProps) {
   const { setTheme } = useTheme();

   return (
      <DropdownMenu>
         <DropdownMenuTrigger>
            <TooltipProvider>
               <Tooltip>
                  <TooltipTrigger asChild>
                     <Button className={cn(`rounded-xl border-none`, !showNavbarBackground && `!bg-transparent`)}
                             variant="outline" size="icon">
                        <Sun
                           className="h-[1.2rem] dark:text-white w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon
                           className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                     </Button>
                  </TooltipTrigger>
                  <TooltipContent className={`!px-3 py-[1px] !text-[.7rem] rounded-xl bg-black text-white`}>
                     Switch theme
                  </TooltipContent>
               </Tooltip>
            </TooltipProvider>
         </DropdownMenuTrigger>
         <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
               Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
               Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
               System
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   );
}
