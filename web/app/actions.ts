"use server";
import { signIn, signOut } from "@/auth";

export async function handleSignOut (_: FormData) {
   await signOut();
};

export async function handleEmailSignIn (formData: FormData) {
   await signIn(`resend`, formData);
};
