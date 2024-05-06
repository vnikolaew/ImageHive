import { Account, Image, ImageCollection, PrismaClient, Profile, User } from "@prisma/client";
import { UserResponse } from "./types";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";

export interface ImagesResponse {
   result_count: number;
   page_count: number;
   page_size: number;
   page: number;
   results: Result[];
}

export interface Result {
   id: string;
   title: string;
   indexed_on: string;
   foreign_landing_url: string;
   url: string;
   creator: string;
   creator_url?: string;
   license: string;
   license_version: string;
   license_url: string;
   provider: string;
   source: string;
   category: any;
   filesize?: number;
   filetype?: string;
   tags: Tag[];
   attribution: string;
   fields_matched: any[];
   mature: boolean;
   height: number;
   width: number;
   thumbnail: string;
   detail_url: string;
   related_url: string;
   unstable__sensitivity: any[];
}

export interface Tag {
   name: string;
   accuracy?: number;
}

export class OpenverseApi {

   static CLIENT_ID = `4ctMWscCyMC2HbNrT41MVoxLIbf3XDDk9YYzeuW3`;
   static CLIENT_SECRET = `kp3ZiM6aWyyNFj4GlwGnZso0fQOfEZ9Z20YxupzZbwVaqcNF8ezC3YIRRfvfyldNujU4e3ZOz1ROcvgQ2OlnEqrPng7B6MVawepr4qjYJW12FT4GaoVvKtrSCh9yOz3I`;
   static TOKEN?: string;

   static BASE_URL = `https://api.openverse.engineering`;

   constructor() {
   }

   public async getAccessToken(): Promise<string> {
      const formData = new URLSearchParams();
      formData.append(`client_id`, OpenverseApi.CLIENT_ID);
      formData.append(`client_secret`, OpenverseApi.CLIENT_SECRET);
      formData.append(`grant_type`, `client_credentials`);

      const res = await fetch(`${OpenverseApi.BASE_URL}/v1/auth_tokens/token/`, {
         headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: `application/json`,
         },
         body: formData,
         method: "POST",
      });
      const body = await res.json();

      OpenverseApi.TOKEN = body.access_token;
      return body.access_token as string;
   }


   public async getRecentPhotos(page: number, page_size: number, sources: string[]): Promise<ImagesResponse> {
      const token = OpenverseApi.TOKEN ?? (await this.getAccessToken());
      const res = await fetch(`${OpenverseApi.BASE_URL}/v1/images/?page=${page}&page_size=${page_size}&source=${encodeURIComponent(sources.join(`,`))}&size=medium&extension=${encodeURIComponent([`png`, `webp`, `jpg`].join(`,`))}`, {
         headers: {
            "Content-Type": "x-www-form-urlencoded; charset=UTF-8",
            "Authorization": `Bearer ${token}`,
         },
         method: "GET",
      });
      return await res.json() as ImagesResponse;
   }

}

export async function openverse_main(prisma: PrismaClient) {
   const userCount = await prisma.user.count();

   if (userCount > 0) {
      console.log(`Database already seeded.`);
      return;
   }

   const api = new OpenverseApi();
   const sources = [
      `wikimedia`, `flickr`, `thingiverse`, `nasa`, `spacex`,
   ];
   let photos = await api.getRecentPhotos(1, 500, sources);
   photos.results.push(...(await api.getRecentPhotos(2, 500, sources)).results);
   photos.results.push(...(await api.getRecentPhotos(3, 500, sources)).results);
   photos.results.push(...(await api.getRecentPhotos(4, 500, sources)).results);
   photos.results.push(...(await api.getRecentPhotos(5, 500, sources)).results);

   photos.results = photos.results.filter(r => !!r.filetype);

   const users = await fetch(`https://randomuser.me/api/?results=50`)
      .then(res => res.json() as unknown as UserResponse);


   const dbUsers: (User & {
      profile: Profile,
      images: Image[],
      accounts: Account[],
      imageCollections: ImageCollection[]
   })[] = [];

   let index = 0;
   for (let user of users.results) {
      const dbUser = await prisma.user.upsert({
         where: { email: user.email },
         update: {},
         create: {
            email: user.email,
            password: bcrypt.hashSync(`${user.login.username[0].toUpperCase()}${user.login.username.slice(1).toLowerCase()}123!`, 10),
            name: user.login.username,
            image: user.picture.medium,
            imageCollections: {
               create: {
                  title: `Default`,
                  metadata: {},
                  public: false,
                  is_deleted: false,
               },
            },
            images: {
               create: photos.results.slice(index, index + 8).map(i => ({
                  title: i.title,
                  absolute_url: i.url,
                  dimensions_set: [`${i.width},${i.height}`],
                  file_format: i.filetype,
                  tags: i.tags.map(t => t.name),
                  original_file_name: i.id,
                  metadata: { aiGenerated: false },
                  is_deleted: false,
               })),
            },
            accounts: {
               create: [
                  {
                     provider: `credentials`,
                     providerAccountId: randomUUID(),
                     type: `basic`,
                  },
               ],
            },
            profile: {
               create: {
                  about: ``,
                  city: user.location.city,
                  country: user.location.country,
                  firstName: user.name.first,
                  lastName: user.name.last,
                  dateOfBirth: null!,
                  gender: user.gender === `female` ? `FEMALE` : `MALE`,
               },
            },
         },
         include: {
            images: true,
            profile: true,
            accounts: true,
            imageCollections: true,
         },
      });


      index++;

      dbUsers.push(dbUser as any);
      console.log(`Created new user with Id: ${dbUser.id}`);
   }

   dbUsers.forEach(user => {
      user.images.forEach(async image => {
         const userIdsUsed: Set<string> = new Set();

         // Insert between 5 - 10 views:
         await prisma.imageView.createMany({
            data: Array
               .from({ length: 5 + Math.ceil(Math.random() * 5) })
               .map((_) => {
                  const userId = dbUsers?.find(u => !userIdsUsed.has(u.id))?.id!;
                  userIdsUsed.add(userId);

                  return {
                     userId,
                     imageId: image.id,
                     metadata: {},
                  };
               }),
         });
         userIdsUsed.clear();

         // Insert between 5 - 10 downloads:
         await prisma.imageDownload.createMany({
            data: Array.from({ length: 5 + Math.ceil(Math.random() * 5) }).map((_) => {
               const userId = dbUsers.find(u => !userIdsUsed.has(u.id))?.id;
               userIdsUsed.add(userId);

               return ({
                  userId,
                  imageId: image.id,
                  metadata: {},
               });
            }),
         });
         userIdsUsed.clear();

         // Insert between 5 - 10 likes:
         await prisma.imageLike.createMany({
            data: Array.from({ length: 5 + Math.ceil(Math.random() * 5) }).map((_) => {
               const userId = dbUsers.find(u => !userIdsUsed.has(u.id))?.id;
               userIdsUsed.add(userId);

               return ({
                  userId,
                  imageId: image.id,
                  metadata: {},
               });
            }),
         });
         userIdsUsed.clear();

         // Insert between 2 - 5 saves:
         if (Math.random() > 0.5) {
            const user = dbUsers.find(u => !userIdsUsed.has(u.id))!;
            if (user) {
               await prisma.collectionImage.create({
                  data: {
                     collectionId: user.imageCollections[0].id,
                     imageId: image!.id,
                     metadata: {},
                     is_deleted: false,
                  },
               });
            }
         }
      });
   });
}
