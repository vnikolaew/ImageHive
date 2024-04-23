"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import path from "path";
import { Image as IImage } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { CircleHelp, Pencil } from "lucide-react";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EditMediaForm from "@/app/account/media/_components/EditMediaForm";
import MediaSettingsForm from "./MediaSettingsForm";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

   const imageSrc = path.join(`/uploads`, getFileName(image.absolute_url)).replaceAll(`\\`, `/`);

   return (
      <div>
         <div className={`flex flex-col rounded-2xl border-[1px] border-neutral-700 `}>
            <div className={`relative group cursor-pointer rounded-2xl m-1`}>
               <div className={`absolute z-10 top-2 left-2 hidden text-white group-hover:block`}>
                  <Button onClick={_ => setEditMediaModalOpen(true)}
                          className={`!bg-white/90 !p-1 hover:border-[1px] hover:border-black transition-colors duration-100`}
                          variant={`ghost`} size={`icon`}>
                     <Pencil className={`text-black`} size={16} />
                  </Button>
               </div>
               <Image
                  className={`rounded-xl mx-auto !max-h-[300px]`}
                  height={300}
                  width={300}
                  alt={image.original_file_name}
                  src={imageSrc} />
            </div>
            <div
               className={`mt-0 flex flex-col items-start justify-start gap-2 text-center text-lg p-3 border-t-[1px] border-neutral-700`}>
               <span className={`ml-2`}>
                  {image.title}
               </span>
               <div className={`items-center flex gap-2`}>
                  {image.tags.slice(0,3).sort().map((tag, i) => (
                     <Badge variant={`secondary`} key={i}>{tag}</Badge>
                  ))}
                  {image.tags.length > 3 && (
                     <TooltipProvider>
                        <Tooltip>
                           <TooltipTrigger className={`cursor-auto`}>
                              <Badge className={`text-nowrap`} variant={`outline`} key={`more`}>+{image.tags.length - 3} more</Badge>
                           </TooltipTrigger>
                           <TooltipContent className={`!text-xs rounded-lg bg-black text-white flex gap-1`}>
                              {image.tags.slice(3).sort().map((tag, i) => (
                                 <Badge variant={`secondary`} key={i}>{tag}</Badge>
                              ))}
                           </TooltipContent>
                        </Tooltip>
                     </TooltipProvider>

                  )}
               </div>
            </div>
         </div>
         <Dialog onOpenChange={setEditMediaModalOpen} open={editMediaModalOpen}>
            <DialogTrigger></DialogTrigger>
            <DialogContent className="min-h-[70vh] !h-fit !w-[40vw] sm:!w-[70vw] !max-w-[40vw] sm:!max-w-[70vw] flex gap-4 !p-0 rounded-xl">
               <DialogHeader>
                  <div ref={imageRef} style={{
                     backgroundImage: `url(${imageSrc})`,
                     backgroundSize: `cover`,
                     backgroundOrigin: `center`,
                  }} className="!h-full min-w-[300px] sm:w-[400px] rounded-xl">
                  </div>
               </DialogHeader>
               <div className={`p-8 flex-1`}>
                  <h2 className={`font-semibold text-xl`}>Edit media</h2>
                  <Tabs
                     defaultValue={TABS.SETTINGS}
                     className="mt-12 h-full">
                     <TabsList className="w-3/4">
                        <TabsTrigger className={`w-1/2`} value={TABS.DETAILS}>{TABS.DETAILS}</TabsTrigger>
                        <TabsTrigger className={`w-1/2`} value={TABS.SETTINGS}>{TABS.SETTINGS}</TabsTrigger>
                     </TabsList>
                     <TabsContent className={`mt-8 w-full mr-auto`} value={TABS.DETAILS}>
                        <EditMediaForm onClose={_ => setEditMediaModalOpen(false)} image={image} />
                     </TabsContent>
                     <TabsContent className={`mt-8 w-full h-full mx-auto`} value={TABS.SETTINGS}>
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