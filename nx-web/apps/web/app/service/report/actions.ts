"use server";

import { z } from "zod";
import { VALID_URL_REGEX } from "@web/lib/utils";

const formSchema = z.object({
   purpose: z.union([z.literal(`copyright`), z.literal(`violence`), z.literal(`privacy`)]),
   contentUrl: z.string().regex(VALID_URL_REGEX, { message: `Please enter a valid url` }), information: z.string(),
   username: z.string(),
   email: z.string(),
   agreeToProcessingInformation: z.boolean(),
   agreeToBelief: z.boolean(),
   issueScreenshot: z.optional(z.instanceof(File)),
});

export async function reportContent(payload: any) {
   const res = formSchema.safeParse(payload);
   if (!res.success) return { success: false };

   const values = res.data;
   // Save report to DB ...

   return { success: true };
}
