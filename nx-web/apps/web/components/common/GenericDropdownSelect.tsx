"use client";
import React, { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@components/dropdown-menu";
import { Button } from "@components/button";
import { cn } from "@utils";
import { ChevronDown } from "lucide-react";

type Option = { value: string; label: string };

export interface GenericDropdownSelectProps {
   options: Option[];
   onChange?: (value: string) => void;
   placeholder: string;
   defaultValue?: string | null;
}

const GenericDropdownSelect = ({ options, onChange, placeholder, defaultValue }: GenericDropdownSelectProps) => {
   const [open, setOpen] = useState(false);
   const [selectedValue, setSelectedValue] = useState<string>(defaultValue!);

   return (
      <DropdownMenu onOpenChange={setOpen} open={open}>
         <DropdownMenuTrigger>
            <Button
               variant={`ghost`}
               onClick={_ => {
               }}
               className={cn(`rounded-full p-2 bg-transparent gap-2 !px-4 hover:bg-transparent hover:border-[1px] hover:border-white transition-colors duration-200`,
                  selectedValue !== null && `bg-neutral-200 hover:!bg-neutral-200 !border-none !outline-none focus:!outline-none focus-visible:!ring-0`,
               )}>
               {options.find(o => o.value === selectedValue)?.label ?? defaultValue ?? placeholder}
               <ChevronDown
                  className={cn(open ? `rotate-180 transition-transform duration-200 text-primary stroke-2` : `rotate-0 transition-transform duration-200`,
                     selectedValue !== null && `text-primary`)} />
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent className={`!z-[100] p-2 min-w-[160px]`}>
            {options.map((option, i) => (
               <DropdownMenuItem
                  key={i}
                  className={cn(`px-2 py-2 cursor-pointer rounded-md`, option.value === selectedValue && `text-primary font-semibold`)}
                  onClick={() => {
                     setSelectedValue(option.value);
                     onChange?.(option.value);
                  }}>
                  {option.label}
               </DropdownMenuItem>
            ))}
         </DropdownMenuContent>
      </DropdownMenu>
   );
};

export default GenericDropdownSelect;
