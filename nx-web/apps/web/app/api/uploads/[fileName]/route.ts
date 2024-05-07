import { NextResponse } from "next/server";
import { NextApiRequest } from "next";
import path from "path";
import * as fs from "node:fs";
import mime from "mime";

type Params = {
   fileName: string
}

export const revalidate = 60 * 30;

export async function GET(request: NextApiRequest, ctx: { params: Params }): Promise<Response> {
   console.log(request.query);
   const fileName = path.join(process.cwd(), `public`, `uploads`, ctx.params.fileName!);
   console.log({ fileName });

   const fsExists = fs.existsSync(fileName);
   if (!fsExists) return NextResponse.json({ success: false }, { status: 404 });

   const blob = fs.readFileSync(fileName);
   const response = new NextResponse(blob, {
      headers: {
         "Content-Type": mime.getType(fileName) ,
         "Cache-Control": 'public, max-age=1800, stale-while-revalidate=1800, must-revalidate'
      },
   });

   return response;
}
