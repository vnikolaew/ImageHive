import { NextApiRequest, NextApiResponse } from "next";
import { Dropbox } from "dropbox";
import { NextRequest, NextResponse } from "next/server";
import fetch from "node-fetch";
import { DropboxService } from "@web/lib/dropbox";
import { randomUUID } from "node:crypto";

export async function GET(request: NextApiRequest, response: NextApiResponse): Promise<Response> {
   const db = new Dropbox({
      accessToken: process.env.DROPBOX_ACCESS_TOKEN,
      fetch,
      clientId: `95iupmdxhrhm6b6`,
      clientSecret: `vgoqpb4ypsu0kep`,
   });
   let res = await db.filesListFolder({ path: `/images` });
   const filesRes = await db.filesListFolderContinue({
      cursor: res.result.cursor,
   });

   const thumbnails = await db.filesGetThumbnailV2({
      mode: { ".tag": `bestfit` },
      resource: { ".tag": `path`, path: res.result.entries[1].path_display },
   });
   // const shareRes = await db.sharingCreateSharedLinkWithSettings({
   //    path: thumbnails.result.file_metadata.path_display
   // })
   // console.log({ shareRes} );

   const sharedLinks = await db.sharingListSharedLinks({
      path: thumbnails.result.file_metadata.path_display,
   });

   const tempLinks = await db.filesGetTemporaryLink({
      path: thumbnails.result.file_metadata.path_display,
   });

   const shareRes = await db.sharingCreateSharedLinkWithSettings({
      path: res.result.entries.at(-1).path_display,
      settings: {
         allow_download: true,
         audience: {
            ".tag": `public`,
         },
      },

   });

   console.log({
      files: res.result.entries,
      thumbnail: thumbnails.result.file_metadata,
      sharedLinks: sharedLinks.result.links,
      shareRes: shareRes.result,
   });
   return NextResponse.json({ success: true });
}


export async function POST(request: NextRequest) {
   const formData = await request.formData();

   const file = formData.get(`file`);
   if (file && file instanceof File) {
      const db = new DropboxService();

      const res = await db.uploadImage(file, `${randomUUID()}_${file.name}`);
      console.log({ res });
      if (res.success) {
         // Create a shared link
         const shareResponse = await db.sharingImageCreate(res.response.path_display);

         if (shareResponse.success) {
            const shareLink = shareResponse.response.url;
            return NextResponse.json({
               shareLink,
               imageId: res.response.id,
               path: res.response.path_display,
               browserLink: shareLink.replaceAll(`dl=0`, `raw=1`),
            });
         }
      }
   }

   return NextResponse.json({ success: false });
}
