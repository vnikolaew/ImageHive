import { Image, PrismaClient } from "@prisma/client";
import _ from "lodash";
import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const API_KEY = `43497792-58fda20afafafee9028e5a67f`;

export interface ApiResponse {
   total: number;
   totalHits: number;
   hits: ApiImage[];
}

export interface ApiImage {
   id: number;
   pageURL: string;
   type: string;
   tags: string;
   previewURL: string;
   previewWidth: number;
   previewHeight: number;
   webformatURL: string;
   webformatWidth: number;
   webformatHeight: number;
   largeImageURL: string;
   imageWidth: number;
   imageHeight: number;
   imageSize: number;
   views: number;
   downloads: number;
   collections: number;
   likes: number;
   comments: number;
   user_id: number;
   user: string;
   userImageURL: string;
}
const PAGES = Array.from({ length: 10 }).map((_, i) => i + 1);

async function main() {
   const allImages : ApiImage[] = []

   for (let page of PAGES) {
      try {
         const pixabayImages: ApiResponse = await fetch(`https://pixabay.com/api/?key=${API_KEY}&page=${page}&per_page=200&order=popular`, {
            headers: new Headers({
               Accept: `application/json`,
            }),
         }).then(res => res.json());
         allImages.push(...pixabayImages.hits);
      } catch (err){
         console.log(err);
      }
   }

   const images = allImages.map<Partial<Image>>(hit => ({
      absolute_url: hit.largeImageURL,
      dimensions_set: [`${hit.imageWidth},${hit.imageHeight}`],
      tags: hit.tags.split(`, `).map(x => x.trim()),
      metadata: { aiGenerated: hit.tags.startsWith(`ai generated`) },
      userId: hit.user_id.toString(),
      original_file_name: hit.previewURL.split("/").at(-1)!.trim(),
      file_format: hit.previewURL.split(".").at(-1)!.trim(),
      title: ``,
   }));

   const users = _.uniqBy(allImages.map(h => ({
      user: h.user,
      userId: h.user_id,
      userImageUrl: h.userImageURL,
      images: images.filter(i => i.userId === h.user_id.toString()),
   })), `userId`);

   for (const user of users) {
      const dbUser = await prisma.user.upsert({
         where: { email: `${user.user.toLowerCase()}@gmail.com` },
         update: {},
         create: {
            email: `${user.user.toLowerCase()}@gmail.com`,
            password: bcrypt.hashSync(`${user.user}123!`, 10),
            name: user.user,
            image: user.userImageUrl,
            images: {
               //@ts-ignore
               create: user.images.map(({ userId, ...rest }) => ({
                  ...rest,
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
                  about: ``, city: ``, country: ``,
                  firstName: ``,
                  lastName: ``,
                  dateOfBirth: null!,
                  gender: `UNSPECIFIED`,
               },
            },
         },
      });
      console.log(`Created new user with Id: ${dbUser.id}`);
   }
}

main()
   .then(async () => {
      await prisma.$disconnect();
   })
   .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
   });