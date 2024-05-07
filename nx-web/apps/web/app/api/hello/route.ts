import { NextRequest, NextResponse } from "next/server";
import { inngest } from "@web/lib/inngest";

// Opt out of caching; every request should send a new event
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
   const imageId = request.nextUrl.searchParams.get(`imageId`)
   if(!imageId) return NextResponse.json({ name: "No image id provided" });

   await inngest.send({
      name: "test/image.classify",
      data: {
         imageId
      },
   });

   return NextResponse.json({ name: "Hello Inngest from Next!" });
}
