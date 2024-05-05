"use client";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Earth, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

import { EditProfileFormValues } from "./EditProfileFormWrapper";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@components/form";
import { Input } from "@components/input";
export interface OnlineProfilesSectionProps {
   form: UseFormReturn<EditProfileFormValues>
}

const OnlineProfilesSection = ({ form }: OnlineProfilesSectionProps) => {
   return (
      <div>
         <FormField
            control={form.control}
            name="onlineProfiles.facebook"
            render={({ field }) => (
               <FormItem className={`!mt-8 min-w-[400px] w-2/3 mx-auto flex items-center gap-4`}>
                  <FormLabel className={`min-w-[100px] text-right`}>Facebook</FormLabel>
                  <FormControl className={`!mt-0`}>
                     <Input placeholder="https://facebook.com/..." {...field} />
                  </FormControl>
                  <Facebook size={28} className="!mt-0  text-blue-500" />
                  <FormDescription>
                  </FormDescription>
                  <FormMessage />
               </FormItem>
            )}
         />
         <FormField
            control={form.control}
            name="onlineProfiles.twitter"
            render={({ field }) => (
               <FormItem className={`!mt-8 min-w-[400px] w-2/3 mx-auto flex items-center gap-4`}>
                  <FormLabel className={`min-w-[100px] text-right`}>Twitter</FormLabel>
                  <FormControl className={`!mt-0`}>
                     <Input placeholder="https://twitter.com/..." {...field} />
                  </FormControl>
                  <Twitter size={28} className="!mt-0 fill-primary border-none stroke-primary" />
                  <FormDescription>
                  </FormDescription>
                  <FormMessage />
               </FormItem>
            )}
         />

         <FormField
            control={form.control}
            name="onlineProfiles.instagram"
            render={({ field }) => (
               <FormItem className={`!mt-8 min-w-[400px] w-2/3 mx-auto flex items-center gap-4`}>
                  <FormLabel className={`min-w-[100px] text-right`}>Instagram</FormLabel>
                  <FormControl className={`!mt-0`}>
                     <Input placeholder="https://instagram.com/..." {...field} />
                  </FormControl>
                  <Instagram style={{
                     // background: `#d6249f`,
                     // width: 24,
                     // height: 24,
                     background: `radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%,#d6249f 60%,#285AEB 90%)`
                  }} size={28} className="!mt-0 text-white border-none" />
                  <FormDescription>
                  </FormDescription>
                  <FormMessage />
               </FormItem>
            )}
         />

         <FormField
            control={form.control}
            name="onlineProfiles.soundCloud"
            render={({ field }) => (
               <FormItem className={`!mt-8 min-w-[400px] w-2/3 mx-auto flex items-center gap-4`}>
                  <FormLabel className={`min-w-[100px] text-right`}>SoundCloud</FormLabel>
                  <FormControl className={`!mt-0`}>
                     <Input placeholder="https://soundcloud.com/..." {...field} />
                  </FormControl>
                  <FormDescription>
                  </FormDescription>
                  <FormMessage />
               </FormItem>
            )}
         />

         <FormField
            control={form.control}
            name="onlineProfiles.youtube"
            render={({ field }) => (
               <FormItem className={`!mt-8 min-w-[400px] w-2/3 mx-auto flex items-center gap-4`}>
                  <FormLabel className={`min-w-[100px] text-right`}>YouTube</FormLabel>
                  <FormControl className={`!mt-0`}>
                     <Input placeholder="https://youtube.com/..." {...field} />
                  </FormControl>
                  <Youtube size={28} className="!mt-0 border-none fill-red-500 text-white" />
                  <FormDescription>
                  </FormDescription>
                  <FormMessage />
               </FormItem>
            )}
         />
         <FormField
            control={form.control}
            name="onlineProfiles.website"
            render={({ field }) => (
               <FormItem className={`!mt-8 min-w-[400px] w-2/3 mx-auto flex items-center gap-4`}>
                  <FormLabel className={`min-w-[100px] text-right`}>Website</FormLabel>
                  <FormControl className={`!mt-0`}>
                     <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <Earth size={28} className="!mt-0 border-none text-neutral-700" />
                  <FormDescription>
                  </FormDescription>
                  <FormMessage />
               </FormItem>
            )}
         />
         <div className={`w-full flex flex-1 justify-end gap-2 justify-self-end`}>
         </div>
      </div>
   );
};

export default OnlineProfilesSection;
