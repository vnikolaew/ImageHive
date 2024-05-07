import { serve } from "inngest/next";
import { inngest } from "@web/lib/inngest";
import { classifyImage } from "@web/app/api/inngest/functions";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
   client: inngest,
   functions:
      [classifyImage]
});
