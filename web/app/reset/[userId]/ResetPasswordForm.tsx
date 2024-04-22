"use client";
import React, { useMemo, useState } from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PASSWORD_REGEX } from "@/components/modals/SignUpForm";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { API_ROUTES, HTTP, TOASTS } from "@/lib/consts";
import { Separator } from "@/components/ui/separator";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsDarkMode } from "@/hooks/useIsDarkMode";
import { ApiResponse } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
   newPassword: z.string().min(6).max(50).regex(PASSWORD_REGEX),
});

type FormValues = z.infer<typeof formSchema>

export interface ResetPasswordFormProps {
   userId: string;
   token: string;
}

const ResetPasswordForm = ({ userId, token }: ResetPasswordFormProps) => {
   const form = useForm<FormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         newPassword: "",
      },
   });

   const [showPassword, setShowPassword] = useState(false);
   const PasswordIcon = useMemo(() => {
      return showPassword ? EyeOffIcon : EyeIcon;
   }, [showPassword]);
   const darkMode = useIsDarkMode();
   const { toast } = useToast();

   async function onSubmit({ newPassword }: FormValues) {
      fetch(API_ROUTES.RESET_PASSWORD, {
         method: "POST",
         body: JSON.stringify({ newPassword, userId, token }),
         headers: {
            "Content-Type": HTTP.MEDIA_TYPES.APPLICATION_JSON,
            "Accept": HTTP.MEDIA_TYPES.APPLICATION_JSON,
         },
      }).then(res => res.json())
         .then((res: ApiResponse<any>) => {
            if (res.success) {
               toast(TOASTS.FORGOT_PASSWORD);
            }
         })
         .catch(console.error);
   }

   return (
      <div className={`w-1/2 mx-auto`}>
         <h2 className={`text-2xl`}>Reset your password</h2>
         <Separator className={`w-2/3 mt-2`} />
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex flex-col mt-8 w-2/3">
               <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                     <FormItem className={`!mt-4`}>
                        <FormLabel>Enter you new password:</FormLabel>
                        <FormControl className={`!mt-1`}>
                           <div className={`relative`}>
                              <Input required type={showPassword ? `text` : `password`}
                                     placeholder="e.g. jack@example.com" {...field} />
                              <PasswordIcon
                                 onClick={_ => setShowPassword(!showPassword)}
                                 className={`w-4 h-4 absolute right-3 top-3 cursor-pointer`} />
                           </div>
                        </FormControl>
                        <FormDescription>
                           This will be your new password.
                        </FormDescription>
                        <FormMessage className={`dark:text-red-400`} />
                     </FormItem>
                  )}
               />
               <Button
                  // disabled={}
                  size={`default`}
                  variant={darkMode ? `default` : `outline`}
                  className={`self-end !px-12 !py-1 rounded-full !mt-3 shadow-md`} type="submit">
                  Reset
               </Button>
            </form>
         </Form>
      </div>

   );
};

export default ResetPasswordForm;