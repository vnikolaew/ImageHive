"use client";
import React, { Fragment } from "react";
import { RadioGroup, RadioGroupItem } from "@components/radio-group";
import { Control } from "react-hook-form";
import { FormSchema } from "./ReportForm";
import { FormControl, FormField, FormItem, FormLabel } from "@components/form";

export interface FormStepOneProps {
   control: Control<FormSchema, any>;
}

const FormStepOne = ({ control }: FormStepOneProps) => {

   return (
      <Fragment>
         <h2 className={`text-lg font-semibold`}>What are you reporting?</h2>
         <FormField control={control} render={({ field }) => (
            <FormItem>
               <FormControl>
                  <RadioGroup
                     onValueChange={field.onChange}
                     className={`mt-4 flex flex-col gap-3`} defaultValue={field.value}>
                     <FormItem className="flex items-center space-x-2">
                        <FormControl>
                           <RadioGroupItem value="copyright" id="r1" />
                        </FormControl>
                        <FormLabel htmlFor="r1">Copyright infringement</FormLabel>
                     </FormItem>
                     <FormItem className="flex items-center space-x-2">
                        <FormControl>
                           <RadioGroupItem value="violence" id="r2" />
                        </FormControl>
                        <FormLabel htmlFor="r1">Violent, sexual or otherwise inappropriate content</FormLabel>
                     </FormItem>
                     <FormItem className="flex items-center space-x-2">
                        <FormControl>
                           <RadioGroupItem value="privacy" id="r3" />
                        </FormControl>
                        <FormLabel htmlFor="r3">Privacy issue</FormLabel>
                     </FormItem>
                  </RadioGroup>
               </FormControl>
            </FormItem>
         )} name={`purpose`} />
      </Fragment>
   );
};

export default FormStepOne;
