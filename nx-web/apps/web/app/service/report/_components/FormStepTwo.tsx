"use client";
import React, { Fragment } from "react";
import { Button } from "@components/button";
import { ArrowLeft } from "lucide-react";
import { Input } from "@components/input";
import { Control, useFormState } from "react-hook-form";
import { FormSchema } from "@web/app/service/report/_components/ReportForm";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/form";
import { cn } from "@utils";

export interface FormStepTwoProps {
   control: Control<FormSchema, any>;
   onBack: () => void;
}

const FormStepTwo = ({ control, onBack }: FormStepTwoProps) => {
   const { errors } = useFormState({ control });

   return (
      <Fragment>
         <h2 className={`text-lg font-semibold flex items-center gap-4`}>
            <Button onClick={onBack} title={`Back`} variant={"ghost"} className={`rounded-full`} size={`icon`}>
               <ArrowLeft size={18} />
            </Button>
            Copyright infringement
         </h2>
         <div className="grid w-full max-w-sm items-center gap-1.5 mt-6">
            <FormField name={`contentUrl`} control={control} render={({ field }) => (
               <FormItem>
                  <FormLabel className={`!text-black`} htmlFor="url">URL of content you are reporting
                  </FormLabel>
                  <FormControl>
                     <Input type="text" {...field} placeholder="www.image-hive.com/"
                            className={cn(!!errors.contentUrl && `border-red-500 focus:border-red-500 focus:!ring-red-500`)} />
                  </FormControl>
                  <FormMessage className={`text-xs font-light`} />
               </FormItem>
            )} />
         </div>
      </Fragment>
   );
};

export default FormStepTwo;
