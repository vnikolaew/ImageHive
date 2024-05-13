"use server";

import { z } from "zod";
import { VALID_URL_REGEX } from "@web/lib/utils";
import { xprisma } from "@nx-web/db";
import { ActionApiResponse } from "@utils";
import { UserReport } from "@prisma/client";
import { authorizedAction } from "@web/lib/actions";
import { SlackService } from "@web/lib/slack";

const formSchema = z.object({
   purpose: z.union([z.literal(`copyright`), z.literal(`violence`), z.literal(`privacy`)]),
   contentUrl: z.string().min(1).regex(VALID_URL_REGEX, { message: `Please enter a valid url` }),
   information: z.string(),
   username: z.string().min(1),
   email: z.string().min(1),
   agreeToProcessingInformation: z.literal(true),
   agreeToBelief: z.literal(true),
   issueScreenshot: z.optional(z.instanceof(File)),
});

type FormSchema = z.infer<typeof formSchema>;

export const reportContent = authorizedAction(formSchema, async (payload, { userId }): Promise<ActionApiResponse<UserReport>> => {
   try {
      const slack = new SlackService();
      const {
         agreeToProcessingInformation,
         information,
         agreeToBelief,
         issueScreenshot,
         purpose,
         ...rest
      } = payload as Required<FormSchema>;

      // Save report to DB ...
      const userReport = await xprisma.userReport.create({
         data: {
            ...rest,
            reason: purpose,
            issue_screenshot_absolute_url: ``,
            metadata: {},
         },
      });

      // Potentially add Slack integration:
      await slack.sendUserReport(userReport);

      return { success: true, data: userReport };

   } catch (err) {
      return { success: false };
   }
});
