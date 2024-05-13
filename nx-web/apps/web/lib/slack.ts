import { WebClient } from "@slack/web-api";
import { UserReport } from "@prisma/client";


export class SlackService {
   private client: WebClient;
   static USER_REPORTS_CHANNEL_ID = `C073CND8AEM`;

   constructor() {
      this.client = new WebClient(process.env.SLACK_TOKEN);
   }

   async sendUserReport(userReport: UserReport) {
      const messageText = `${userReport.id} - ${userReport.email.trim()} - ${userReport.reason} at ${userReport.createdAt.toISOString()}`;

      const response = await this.client.chat.postMessage({
         channel: SlackService.USER_REPORTS_CHANNEL_ID,
         text: messageText,
         blocks: [{
            type: `section`,
            text: {
               type: `plain_text`,
               text: messageText,
            },
            ...(userReport.issue_screenshot_absolute_url?.length ? {
               accessory: {
                  type: `image`,
                  image_url: userReport.issue_screenshot_absolute_url,
                  alt_text: `alt text`,
               },
            } : {}),
         }],
      });

      const { ok, errors } = response;
      return { ok, errors };
   }
}
