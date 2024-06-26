"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import path from "path";
import { Image as IImage } from "@prisma/client";
import { Pencil } from "lucide-react";
import MediaSettingsForm from "./MediaSettingsForm";
import { useIsDarkMode } from "@web/hooks/useIsDarkMode";
import { Button } from "@components/button";
import { Badge } from "@components/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@components/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@components/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/tabs";
import EditMediaForm from "@web/app/account/media/_components/EditMediaForm";
import { isAbsoluteUrl } from "@utils";
import { motion } from "framer-motion";
import EditMediaImage from "@web/app/account/media/_components/EditMediaImage";
import Link from "next/link";

interface AccountMediaItemProps {
   image: IImage;
}

enum TABS {
   DETAILS = `Details`,
   SETTINGS = `Settings`,
}

function getFileName(fullPath: string): string {
   return fullPath.split(`\\`).at(-1)!.trim();
}

const AccountMediaItem = ({ image }: AccountMediaItemProps) => {
   const [editMediaModalOpen, setEditMediaModalOpen] = useState(false);
   const imageRef = useRef<HTMLDivElement>(null!);

   const imageSrc = isAbsoluteUrl(image.absolute_url)
      ? image.absolute_url
      : path.join(`/uploads`, getFileName(image.absolute_url)).replaceAll(`\\`, `/`);

   return (
      <div>
         <div className={`flex flex-col rounded-2xl border-[1px] dark:border-neutral-700 `}>
            <motion.div className={`relative group cursor-pointer rounded-2xl m-0`}>
               <motion.div
                  className={`absolute z-10 top-2 left-2 opacity-0 text-white group-hover:opacity-100 duration-200 transition-opacity`}>
                  <Button onClick={_ => setEditMediaModalOpen(true)}
                          className={`!bg-white/90 !p-1 hover:border-[1px] hover:border-black transition-colors duration-100`}
                          variant={`ghost`} size={`icon`}>
                     <Pencil className={`text-black`} size={16} />
                  </Button>
               </motion.div>
               <Link href={`/photos/${image.id}`}>
                  <Image
                     className={`rounded-xl mx-auto !max-h-[300px]`}
                     height={300}
                     width={300}
                     alt={image.original_file_name}
                     src={imageSrc} />
               </Link>
            </motion.div>
            <div
               className={`mt-0 flex flex-col items-start justify-start gap-2 text-center text-lg p-3 border-t-[1px] dark:border-neutral-700`}>
               <span className={`ml-2 font-semibold`}>
                  {image.title}
               </span>
               <div className={`items-center flex gap-2`}>
                  {image.tags.slice(0, 3).sort().map((tag, i) => (
                     <Badge variant={`secondary`} key={i}>{tag}</Badge>
                  ))}
                  {image.tags.length > 3 && (
                     <TooltipProvider>
                        <Tooltip>
                           <TooltipTrigger asChild className={`cursor-auto`}>
                              <Badge className={`text-nowrap`} variant={`outline`}
                                     key={`more`}>+{image.tags.length - 3} more</Badge>
                           </TooltipTrigger>
                           <TooltipContent
                              className={`!text-xs rounded-lg text-white flex gap-1`}>
                              {/*{image.tags.slice(3).sort().map((tag, i) => (*/}
                              {/*   <Badge className={`bg-slate-100 border-none`}*/}
                              {/*          variant={darkMode ? `secondary` : `outline`} key={i}>*/}
                              {/*      {tag}*/}
                              {/*   </Badge>*/}
                              {/*))}*/}
                              {image.tags.slice(3).join(`, `)}
                           </TooltipContent>
                        </Tooltip>
                     </TooltipProvider>

                  )}
               </div>
            </div>
         </div>
         <Dialog onOpenChange={setEditMediaModalOpen} open={editMediaModalOpen}>
            <DialogTrigger></DialogTrigger>
            <DialogContent
               className="min-h-[60vh] !h-fit !w-[40vw] sm:!w-[60vw] !max-w-[40vw] sm:!max-w-[70vw] flex gap-4 !p-0 rounded-xl">
               <DialogHeader>
                  <EditMediaImage ref={imageRef} image={image} />
               </DialogHeader>
               <div className={`p-8 flex-1`}>
                  <h2 className={`font-semibold text-xl`}>Edit media</h2>
                  <Tabs
                     defaultValue={TABS.SETTINGS}
                     className="mt-8 h-full">
                     <TabsList className="w-3/4">
                        <TabsTrigger className={`w-1/2`} value={TABS.DETAILS}>{TABS.DETAILS}</TabsTrigger>
                        <TabsTrigger className={`w-1/2`} value={TABS.SETTINGS}>{TABS.SETTINGS}</TabsTrigger>
                     </TabsList>
                     <TabsContent className={`mt-8 w-full mr-auto`} value={TABS.DETAILS}>
                        <EditMediaForm onClose={_ => setEditMediaModalOpen(false)} image={image} />
                     </TabsContent>
                     <TabsContent className={`mt-8 w-full h-fit mx-auto`} value={TABS.SETTINGS}>
                        <MediaSettingsForm onCloseModal={_ => setEditMediaModalOpen(false)} imageId={image.id} />
                     </TabsContent>
                  </Tabs>
               </div>
            </DialogContent>
         </Dialog>
      </div>
   );
};

export default AccountMediaItem;
