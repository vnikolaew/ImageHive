import { Dropbox, DropboxAuth } from "dropbox";
import fetch from "node-fetch";

// Upload flow ->
// 1. Upload image to Dropbox
// 2. Create a shared link
// 3. Construct a new image URL and save it to DB

export const FOLDERS = {
   UPLOADS: "images",
   COVERS: "covers",
   PROFILE_PICS: "profile_pictures",
};


export class DropboxService {
   private db: Dropbox;
   private dbAuth: DropboxAuth;

   constructor() {
      this.dbAuth = new DropboxAuth({
         fetch,
         clientId: `95iupmdxhrhm6b6`,
         clientSecret: `vgoqpb4ypsu0kep`,
         accessToken: process.env.DROPBOX_ACCESS_TOKEN,
      })

      this.db = new Dropbox({
         fetch,
         auth: this.dbAuth,
      });

   }

   async filesListFolder(path: string) {
      const res = await this.db.filesListFolder({ path });
      return { entries: res.result.entries, cursor: res.result.cursor };
   }

   async sharingListSharedLinks(path: string) {
      const res = await this.db.sharingListSharedLinks({ path });
      return res.result.links;
   }

   async sharingImageCreate(path: string) {
      const res = await this.db.sharingCreateSharedLinkWithSettings({
         path,
         settings: {
            allow_download: true,
            requested_visibility: { ".tag": `public` },
         },
      });

      return { success: res.status === 200, response: res.result };
   }

   async uploadImage(file: File, fileName: string) {
      const res = await this.db.filesUpload({
         path: `/${FOLDERS.UPLOADS}/${fileName}`,
         contents: await file.arrayBuffer(),
      });

      return { success: res.status === 200, response: res.result };
   }

   async uploadCover(file: File, fileName: string) {
      const res = await this.db.filesUpload({
         path: `/${FOLDERS.COVERS}/${fileName}`,
         contents: await file.arrayBuffer(),
      });

      return { success: res.status === 200, response: res.result };
   }

   async uploadProfilePicture(file: File, fileName: string) {
      const res = await this.db.filesUpload({
         path: `/${FOLDERS.PROFILE_PICS}/${fileName}`,
         contents: await file.arrayBuffer(),
      });

      return { success: res.status === 200, response: res.result };
   }

   async deleteImage(fileName: string) {
      const res = await this.db.filesDeleteV2({
         path: `/${FOLDERS.UPLOADS}/${fileName}`,
      });

      return { success: res.status === 200, response: res.result };
   }

   async deleteCover(fileName: string) {
      const res = await this.db.filesDeleteV2({
         path: `/${FOLDERS.COVERS}/${fileName}`,
      });

      return { success: res.status === 200, response: res.result };
   }

   async deleteProfilePicture(fileName: string) {
      const res = await this.db.filesDeleteV2({
         path: `/${FOLDERS.PROFILE_PICS}/${fileName}`,
      });

      return { success: res.status === 200, response: res.result };
   }
}
