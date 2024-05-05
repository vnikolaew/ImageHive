"use client";
import React, { useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import Image from "next/image";
import { Profile, User } from "@prisma/client";
import { useSingleFileImagePreview } from "@web/hooks/useFileImagePreviews";
import { EditProfileFormValues } from "./EditProfileFormWrapper";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@components/form";
import { Input } from "@components/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/select";
import { Textarea } from "@components/textarea";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

const DAYS = Array.from({ length: 31 }).map((_, i) => i + 1);

const YEARS = Array.from({ length: 2011 - 1934 + 1 }).map((_, i) => i + 1934);

interface PersonalDataSectionProps {
  user?: User & { profile: Profile },
  form: UseFormReturn<EditProfileFormValues>
}

const PersonalDataSection = ({ user, form }: PersonalDataSectionProps) => {
  const { inputFiles, addImage, imagePreview, removeImage } = useSingleFileImagePreview();
  const inputRef = useRef<HTMLInputElement>(null!);

  return (
    <div>
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem className={`!mt-8 min-w-[400px] w-2/3 mx-auto flex items-center gap-4`}>
            <FormLabel className={`min-w-[100px] text-right`}>Username</FormLabel>
            <FormControl className={`!mt-0`}>
              <Input placeholder="" {...field} />
            </FormControl>
            <FormDescription>
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="profileImage"
        render={({ field }) => (
          <FormItem className={`!mt-8 min-w-[400px] w-2/3 mx-auto flex items-center gap-4`}>
            <FormLabel className={`min-w-[100px] text-right`}>Profile image</FormLabel>
            <input accept={`image/*`} onChange={e => {
              if (!!e.target.files?.length) {
                const file = e.target.files![0];
                addImage(file);
                form.setValue(`profileImage`, file);

              }
            }} ref={inputRef} hidden type={`file`} placeholder="" />
            <FormControl className={`!mt-0`}>
              <Image
                onClick={_ => inputRef?.current?.click()}
                className={`rounded-full shadow-sm cursor-pointer w-40 h-40`}
                objectFit={`cover`}
                height={160}
                width={160}
                src={imagePreview ?? field.value}
                alt={`${user?.name}'s profile picture`} />
            </FormControl>
            <FormDescription>
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="firstName"
        render={({ field }) => (
          <FormItem className={`!mt-8 min-w-[400px] w-2/3 mx-auto flex items-center gap-4`}>
            <FormLabel className={`min-w-[100px] text-nowrap text-right`}>First name</FormLabel>
            <FormControl className={`!mt-0`}>
              <Input placeholder="" {...field} />
            </FormControl>
            <FormDescription>
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="lastName"
        render={({ field }) => (
          <FormItem className={`!mt-8 min-w-[400px] w-2/3 mx-auto flex items-center gap-4`}>
            <FormLabel className={`min-w-[100px] text-nowrap text-right`}>Last name</FormLabel>
            <FormControl className={`!mt-0`}>
              <Input placeholder="" {...field} />
            </FormControl>
            <FormDescription>
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="city"
        render={({ field }) => (
          <FormItem className={`!mt-8 min-w-[400px] w-2/3 mx-auto flex items-center gap-4`}>
            <FormLabel className={`min-w-[100px] text-nowrap text-right`}>City</FormLabel>
            <FormControl className={`!mt-0`}>
              <Input placeholder="" {...field} />
            </FormControl>
            <FormDescription>
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="country"
        render={({ field }) => (
          <FormItem className={`!mt-8 min-w-[400px] w-2/3 mx-auto flex items-start gap-4`}>
            <FormLabel className={`min-w-[100px] text-nowrap mt-2 text-right`}>Country</FormLabel>
            <FormControl className={`!mt-0`}>
              <Input placeholder="" {...field} />
            </FormControl>
            <FormDescription>
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className={`flex items-center gap-0`}>
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem className={`!mt-8 min-w-[400px] w-2/3 mx-auto flex items-start`}>
              <FormLabel className={`min-w-[100px] text-nowrap mt-2 mr-4 text-right`}>Date of birth</FormLabel>
              <Select
                defaultValue={form.getValues(`dob.month`) ? (Number(form.getValues(`dob.month`)) - 1).toString() : null}
                onValueChange={value => {
                  form.setValue(`dob.month`, value ? Number(value) : null!);
                }}>
                <FormControl className={`w-1/4`}>
                  <SelectTrigger>
                    <SelectValue placeholder="----" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {[`---`, ...MONTHS].map((month, i) => (
                    <SelectItem key={i} value={i === 0 ? null : (i - 1).toString()}>{month}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                defaultValue={form.getValues(`dob.day`) ? (Number(form.getValues(`dob.day`)) - 1).toString() : null}
                onValueChange={value => {
                  form.setValue(`dob.day`, value ? Number(value) + 1 : null!);
                }}>
                <FormControl className={`w-1/5`}>
                  <SelectTrigger>
                    <SelectValue placeholder="----" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {[`---`, ...DAYS].map((day, i) => (
                    <SelectItem key={i} value={i === 0 ? null : day.toString()}>
                      {day.toString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                defaultValue={form.getValues(`dob.year`) ? (Number(form.getValues(`dob.year`))).toString() : null}
                onValueChange={value => {
                  form.setValue(`dob.year`, value ? Number(value) : null!);
                }}>
                <FormControl className={`w-1/5`}>
                  <SelectTrigger>
                    <SelectValue placeholder="----" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {[`---`, ...YEARS].map((year, i) => (
                    <SelectItem key={i} value={i === 0 ? null : year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="aboutMe"
        render={({ field }) => (
          <FormItem className={`!mt-8 min-w-[400px] w-2/3 mx-auto flex items-start gap-4`}>
            <FormLabel className={`min-w-[100px] mt-2 text-nowrap text-right`}>About</FormLabel>
            <FormControl className={`!mt-0`}>
              <Textarea
                className={`resize-none`}
                placeholder="In a few words, tell us about yourself" {...field} />
            </FormControl>
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

export default PersonalDataSection;
