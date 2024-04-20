"use server";

import { signIn } from "@/auth";
import { FormValues } from "@/components/modals/SignUpForm";

export async function handleCredentialsSignUp(values: FormValues): Promise<any> {
   try {
      await signIn(`credentials`, values);
      return { success: true };
   } catch (err) {
      console.error(err);
      return { success: false };
   }
}

