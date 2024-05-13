"use client";
import React, { Fragment, useMemo, useRef, useState } from "react";
import { ModalType, useModals } from "@web/providers/ModalsProvider";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@components/dialog";
import { cn } from "@utils";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@components/button";
import { z } from "zod";
import { Control, useForm, useFormContext, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/form";
import { RadioGroup, RadioGroupItem } from "@components/radio-group";
import { Textarea } from "@components/textarea";
import { Label } from "@components/label";
import { Input } from "@components/input";
import { Checkbox } from "@components/checkbox";
import { useSingleFileImagePreview } from "@web/hooks/useFileImagePreviews";
import { APP_NAME, TOASTS } from "@nx-web/shared";
import { ScrollArea } from "@components/scroll-area";
import { useAction } from "next-safe-action/hooks";
import { reportContent } from "@web/app/service/report/actions";
import { toast } from "sonner";
import { ShieldAlert } from "lucide-react";
import { LoadingSpinner } from "@web/components/modals/SocialLogins";

export interface ReportMediaModalProps {
   imageId: string;
}

const formSchema = z.object({
   purpose: z.union([z.literal(`copyright`), z.literal(`violence`), z.literal(`privacy`)]),
   contentUrl: z.string(),
   information: z.string(),
   username: z.string(),
   email: z.string(),
   agreeToProcessingInformation: z.boolean(),
   agreeToBelief: z.boolean(),
   issueScreenshot: z.optional(z.instanceof(File)),
});

export type FormSchema = z.infer<typeof formSchema>

export const ReportMediaModalWrapper = ({ }) => {
   const pathname = usePathname();
   const { modal } = useModals();
   if (modal !== ModalType.REPORT_MEDIA) return null!;

   const imageId = pathname.split("/").at(-1).trim();

   return <ReportMediaModal imageId={imageId} />
};

const ReportMediaModal = ({imageId}: ReportMediaModalProps) => {
   const [step, setStep] = useState(1);
   const { modal, toggleModal } = useModals();

   const { result, execute, status } = useAction(reportContent, {
      onSettled: res => {
         console.log({ res });
      },
      onSuccess: (res) => {
         console.log({ res });
         if (res.success) {
            const { message, ...rest } =
               TOASTS.USER_REPORT_SUCCESS;
            toast(message, { ...rest, icon: <ShieldAlert className={``} size={16} /> });

            toggleModal(ModalType.REPORT_MEDIA);
         }
      },
   });

   const form = useForm<FormSchema>({
      resolver: zodResolver(formSchema),
      reValidateMode: `onChange`,
      defaultValues: {
         purpose: `copyright`,
         contentUrl: `/photos/${imageId}`,
         information: ``,
         username: ``,
         email: ``,
         agreeToProcessingInformation: false,
         agreeToBelief: false,
         issueScreenshot: null!,
      },
   });
   const imageSrc = document.getElementById(`image-${imageId}`)?.dataset?.src;

   const values = useWatch({ control: form.control });
   const nextButtonDisabled = useMemo(() => {
      if (step === 2) {
         return !values.agreeToProcessingInformation || !values.agreeToBelief || !values.information?.length;
      }
      return false;
   }, [step, values.agreeToBelief, values.agreeToProcessingInformation, values.information?.length]);


   async function onSubmit(values: FormSchema) {
      const { issueScreenshot, ...rest } = values;
      execute(rest);
   }

   return (
      <Dialog
         onOpenChange={_ => toggleModal(ModalType.REPORT_MEDIA)}
         open={modal === ModalType.REPORT_MEDIA}>
         <DialogTrigger></DialogTrigger>
         <DialogContent className="!w-1/2 !p-8 !max-w-xl h-[70vh] !min-h-fit flex flex-col items-start">
            <ScrollArea className={cn(`!h-full !px-2`, step === 2 && ``)}>
               <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex flex-col px-2">
                     <DialogHeader className="">
                        <DialogTitle className={`text-left text-xl`}>What are you reporting?</DialogTitle>
                     </DialogHeader>
                     <div
                        className={cn(`w-full mt-2 rounded-md p-3 bg-neutral-300/70 min-h-[120px] flex items-center gap-4`)}>
                        <Image
                           className={`!object-cover rounded-md shadow-sm !h-24 !w-24 !bg-center-center`} height={100}
                           width={200} src={imageSrc} alt={``} />
                        <div className={`h-full flex flex-col justify-center items-start gap-2`}>
                           <h2>Reported content</h2>
                           <Link className={`text-primary text-sm hover:underline`}
                                 href={`/photos/${imageId}`}>/photos/{imageId}</Link>
                        </div>
                     </div>
                     <div>
                        {step === 1 && (<ModalStepOne control={form.control} />)}
                        {step === 2 && (<ModalStepTwo control={form.control} />)}
                     </div>
                     <DialogFooter className={`w-full flex justify-end`}>
                        {step === 2 ? (
                           <Button
                              type={`submit`}
                              disabled={nextButtonDisabled || status === `executing`}
                              className={`!px-8 shadow-sm rounded-full mb-2`}
                              size={`default`}
                              variant={`destructive`}>
                              {status === `executing` ? (
                                 <LoadingSpinner text={`Executing...`} />
                              ) : `Report`}
                           </Button>
                        ) : (
                           <Button
                              onClick={_ => setStep(s => s + 1)}
                              className={`!px-8 shadow-sm rounded-full mb-2`} size={`default`}
                              variant={`default`}>
                              Next
                           </Button>
                        )}
                     </DialogFooter>
                  </form>
               </Form>
            </ScrollArea>
         </DialogContent>
      </Dialog>
   );
};

export interface FormStepProps {
   control: Control<FormSchema, any>;
}

const ModalStepOne = ({ control }: FormStepProps) => {
   return (
      <FormField control={control} render={({ field }) => (
         <FormItem>
            <FormControl>
               <RadioGroup
                  onValueChange={field.onChange}
                  className={`mt-2 flex flex-col gap-1`}
                  defaultValue={field.value}>
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
   );
};

const ModalStepTwo = ({ control }: FormStepProps) => {
   const { addImage, removeImage, imagePreview, inputFile } = useSingleFileImagePreview();
   const context = useFormContext<FormSchema>();
   const inputRef = useRef<HTMLInputElement>(null!);

   return (
      <Fragment>
         <div className="grid w-full items-center gap-1.5 mt-6">
            <FormField control={control} render={({ field }) => (
               <FormItem>
                  <FormLabel htmlFor="information">
                     <p>
                        Please include the information set out in section 9 of our
                        <Link
                           className={`text-primary !inline pl-1 hover:underline`} href={`/service/terms`}>
                           Terms of Service
                        </Link>
                     </p>
                  </FormLabel>
                  <FormControl>
                     <Textarea id="url" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
               </FormItem>
            )} name={`information`} />
         </div>
         <div className="grid w-full items-center gap-1.5 mt-6">
            <Label htmlFor="url">
               <p>
                  Add a screenshot of the issue <span className={`text-neutral-500 text-xs pl-1`}>Optional</span>
               </p>
            </Label>
            <div onDragOver={e => {
               e.preventDefault();
            }} onDrop={e => {
               e.preventDefault();
               const file = e.dataTransfer.files[0];
               addImage(file);
               context.setValue(`issueScreenshot`, file);
            }}
                 className={`flex flex-col items-center justify-center mt-2 w-full h-fit !py-8 border-dashed border-[2px] border-slate-300/70 dark:bg-slate-600/60 bg-slate-300/60 rounded-xl text-black dark:text-white shadow-md`}>
               <div className="flex gap-3 items-center">
                  <Button
                     onClick={_ => inputRef?.current?.click()} className={`rounded-full !px-6`}
                     variant={`outline`}>
                     Browse files
                  </Button>
                  <form>
                     <Input
                        accept={`image/*`} onChange={({ target: { files } }) => {
                        addImage(files![0]);
                        context.setValue(`issueScreenshot`, files![0]);
                     }} className={`hidden`} ref={inputRef} type={`file`} hidden />
                  </form>
               </div>
               <div className={`mt-6 text-neutral-400 text-sm flex items-center gap-2 `}>
                  Upload a PNG or JPG file. Max size 10MB.
               </div>
            </div>
            <div>
               {imagePreview?.length && (
                  <div className={`flex items-center gap-4 my-4`}>
                     <Image className={`!h-[120px] rounded-lg shadow-sm !object-cover bg-center-center`} height={100}
                            width={200} src={imagePreview} alt={`image-1`} />
                     <span className={`text-base font-normal`}>{inputFile?.name}</span>
                  </div>
               )}
            </div>
         </div>
         <p className={`mt-4 text-sm font-semibold`}>
            To be notified of the report outcome, please include your name and email address:
         </p>
         <div className="grid w-full items-center gap-1.5 mt-6">
            <FormField control={control} render={({ field }) => (
               <FormItem>
                  <FormLabel htmlFor="name">
                     <p>
                        Enter name
                        <span className={`text-neutral-500 text-xs pl-1`}>Optional</span>
                     </p>
                  </FormLabel>
                  <FormControl>
                     <Input id="name" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
               </FormItem>
            )
            } name={`username`} />
         </div>
         <div className="grid w-full items-center gap-1.5 mt-6">
            <FormField control={control} render={({ field }) => (
               <FormItem>
                  <FormLabel htmlFor="email">
                     <p>
                        Enter email address
                        <span className={`text-neutral-500 text-xs pl-1`}>Optional</span>
                     </p>
                  </FormLabel>
                  <FormControl>
                     <Input id="email" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
               </FormItem>
            )
            } name={`email`} />
         </div>
         <div>
            <FormField control={control} render={({ field }) => (
               <FormItem className="items-top flex space-x-2 mt-6 hover:text-primary">
                  <FormControl>
                     <Checkbox
                        onCheckedChange={field.onChange}
                        checked={field.value}
                        className={`!rounded-sm`} id="terms" />
                  </FormControl>
                  <FormLabel
                     htmlFor="terms"
                     className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 !mt-0"
                  >
                     I agree to {APP_NAME} processing my information as outlined in it’s <Link
                     className={`text-primary`}
                     href={`/service/privacy`}>
                     Privacy policy
                  </Link> .
                  </FormLabel>
                  <FormMessage />
               </FormItem>
            )
            } name={`agreeToProcessingInformation`} />
         </div>
         <div className="items-top flex space-x-2 hover:text-primary">
            <FormField control={control} render={({ field }) => (
               <FormItem className="items-top flex space-x-2 mt-3 hover:text-primary">
                  <FormControl>
                     <Checkbox
                        onCheckedChange={field.onChange} checked={field.value} className={`!rounded-sm`}
                        id="terms2" />
                  </FormControl>
                  <FormLabel
                     htmlFor="terms2"
                     className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 !mt-0"
                  >
                     I have a good faith belief that the information and allegations contained in this report are
                     accurate
                     and complete.
                  </FormLabel>
                  <FormMessage />
               </FormItem>
            )
            } name={`agreeToBelief`} />
         </div>
      </Fragment>
   );
};
