"use client";
import React, { useMemo, useState } from "react";
import { Button } from "@components/button";
import FormStepOne from "@web/app/service/report/_components/FormStepOne";
import FormStepTwo from "./FormStepTwo";
import FormStepThree from "@web/app/service/report/_components/FormStepThree";
import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@components/form";
import { cn } from "@utils";
import { VALID_URL_REGEX } from "@web/lib/utils";

export interface ReportFormProps {
}

const STEPS = [
   FormStepOne,
   FormStepTwo,
   FormStepThree,
];

const formSchema = z.object({
   purpose: z.union([z.literal(`copyright`), z.literal(`violence`), z.literal(`privacy`)]),
   contentUrl: z.string().regex(VALID_URL_REGEX, { message: `Please enter a valid url` }), information: z.string(),
   username: z.string(),
   email: z.string(),
   agreeToProcessingInformation: z.boolean(),
   agreeToBelief: z.boolean(),
   issueScreenshot: z.optional(z.instanceof(File)),
});

export type FormSchema = z.infer<typeof formSchema>

const ReportForm = ({}: ReportFormProps) => {
   const [step, setStep] = useState(1);
   const form = useForm<FormSchema>({
      resolver: zodResolver(formSchema),
      reValidateMode: `onChange`,
      defaultValues: {
         purpose: `copyright`,
         contentUrl: ``,
         information: ``,
         username: ``,
         email: ``,
         agreeToProcessingInformation: false,
         agreeToBelief: false,
         issueScreenshot: null!
      },
   });
   const values = useWatch({ control: form.control });

   const nextButtonDisabled = useMemo(() => {
      if (step === STEPS.length) {
         return !values.agreeToProcessingInformation || !values.agreeToBelief || !values.information?.length;
      }
      return false;
   }, [step, values.agreeToBelief, values.agreeToProcessingInformation, values.information?.length]);

   async function onSubmit() {

   }

   return (
      <div className={`w-full border-[1px] border-neutral-300 rounded-lg p-12`}>

         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex flex-col">
               {STEPS.map((Step, i) => (
                  <div className={cn(i + 1 !== step && `hidden`)} key={i}>
                     <Step onBack={_ => setStep(s => s - 1)} control={form.control} />
                  </div>
               ))}
            </form>
         </Form>
         <div className={`w-full flex items-center justify-between mt-8`}>
            <Button
               onClick={_ => setStep(s => s - 1)}
               disabled={step === 0}
               variant={`secondary`}
               className={`rounded-full shadow-md !px-8`}>
               Back
            </Button>
            {step === STEPS.length ? (
               <Button
                  onClick={_ => setStep(s => s + 1)}
                  disabled={nextButtonDisabled}
                  variant={`destructive`}
                  className={`rounded-full shadow-md !px-8 disabled:!bg-neutral-400 transition-colors duration-200`}>
                  Report
               </Button>
            ) : (
               <Button
                  onClick={_ => setStep(s => s + 1)} disabled={step === STEPS.length}
                  className={`rounded-full shadow-md !px-8`}>
                  Next
               </Button>
            )}
         </div>
      </div>
   );
};

export default ReportForm;
