"use client";
import React from "react";
import {
   Dialog,
   DialogContent,
   DialogFooter,
   DialogTrigger,
   DialogHeader,
   DialogTitle,
} from "@components/dialog";
import { Button } from "@components/button";
import { Profile, User } from "@prisma/client";
import Image from "next/image";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@components/form";
import { Input } from "@components/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Textarea } from "@components/textarea";
import { Check, ShieldAlert, StepForward } from "lucide-react";
import { usePromise } from "@web/hooks/usePromise";
import { sendMessage } from "@web/app/users/search/actions";
import { TOASTS } from "@nx-web/shared";
import { toast } from "sonner";
import { LoadingSpinner } from "@web/components/modals/SocialLogins";

export interface MessageUserModalProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   user: User & { profile: Profile };
}

const formSchema = z.object({
   message: z.string(),
   subject: z.string(),
});

type FormValues = z.infer<typeof formSchema>

const MessageUserModal = ({ open, onOpenChange, user }: MessageUserModalProps) => {
   const form = useForm<FormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         subject: ``,
         message: ``,
      },
   });
   const { action: sendMessageAction, loading } = usePromise(async ({ message, subject }: FormValues) => {
      const res = await sendMessage(subject, message, user.id);
      if (res.success) {
         const { message, ...rest } =
            TOASTS.SEND_MESSAGE_SUCCESS;
         toast(message, { ...rest, icon: <Check className={``} size={16} /> });
         onOpenChange(false);

      } else {
         const { message, ...rest } =
            TOASTS.SEND_MESSAGE_FAILURE;
         toast(message, { ...rest, icon: <ShieldAlert className={``} size={16} /> });
      }
      form.reset();
   });

   async function onSubmit(values: FormValues) {
      await sendMessageAction(values);
   }

   return (
      <Dialog
         onOpenChange={onOpenChange}
         open={open}>
         <DialogTrigger></DialogTrigger>
         <DialogContent className="sm:max-w-[450px] !p-8 !pb-2 min-h-[60vh] !h-fit flex flex-col items-start">
            <DialogHeader className="">
               <DialogTitle className={`text-left text-2xl flex items-center gap-4`}>
                  <Image
                     className={`rounded-full shadow-md`} height={40} width={40} src={user.image} alt={user.name} />
                  <span className={`text-2xl font-bold`}>Message {user.name}</span>
               </DialogTitle>
            </DialogHeader>
            <div className="mt-4 w-full flex-1">
               <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6 flex flex-col !mb-4">
                     <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                           <FormItem className={`!mt-4`}>
                              <FormLabel>Subject</FormLabel>
                              <FormControl className={`!mt-1`}>
                                 <Input type={`text`} required placeholder="Add a subject" {...field} />
                              </FormControl>
                              <FormDescription>
                              </FormDescription>
                              <FormMessage className={`dark:text-red-400`} />
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                           <FormItem className={`!mt-6`}>
                              <div className={`flex items-center w-full justify-between`}>
                                 <FormLabel>Message</FormLabel>
                                 <div className={`text-xs text-neutral-500`}>{field.value.length}/2000</div>
                              </div>
                              <FormControl className={`!mt-1`}>
                                 <Textarea className={`min-h-[100px]`} required
                                           placeholder="Add your message" {...field} />
                              </FormControl>
                              <FormDescription>
                              </FormDescription>
                              <FormMessage className={`dark:text-red-400`} />
                           </FormItem>
                        )}
                     />
                     <DialogFooter className={`!w-full !mt-8  flex items-center !justify-between`}>
                        <Button
                           onClick={_ => onOpenChange(false)}
                           variant={"outline"}
                           className={`self-start shadow-sm !px-6 rounded-full`}
                           type="submit">
                           Cancel
                        </Button>
                        <Button
                           disabled={
                              !form.watch(`message`).length
                              || !form.watch(`subject`).length
                              || loading}
                           variant={`default`}
                           className={`self-end !px-6 gap-2 rounded-full shadow-sm`}
                           type="submit">
                           {loading ? (
                              <LoadingSpinner text={`Sending ...`} />
                           ) : (
                              <>
                                 <StepForward size={14} />
                                 Send
                              </>
                           )}

                        </Button>
                     </DialogFooter>
                  </form>
               </Form>
            </div>
         </DialogContent>
      </Dialog>
   );
};

export default MessageUserModal;
