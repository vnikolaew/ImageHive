import { Account, Image, ImageCollection, PrismaClient, Profile, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import {
   GetPhotoTagsResponse,
   GetUserInfoResponse,
   PhotosGetInfoResponse,
   PhotosGetRecentResponse,
   UserResponse,
} from "./types";
import { createFlickr, Flickr } from "flickr-sdk";

export class FlickrApi {
   private readonly _flickr: Flickr;

   constructor() {
      const { flickr } = createFlickr("cef71e7870dd0d15a79081af2cce9fbc");
      this._flickr = flickr;
   }

   public async getRecentPhotos(limit: number): Promise<PhotosGetRecentResponse> {
      let res = await this._flickr("flickr.photos.getRecent", {
         page: `1`,
         per_page: `${limit}`,
      });

      return res as PhotosGetRecentResponse;
   }

   public async getPhotoInfo(photo_id: string) {
      try {
         let res = await this._flickr("flickr.photos.getInfo", {
            photo_id,
         });

         return res as PhotosGetInfoResponse;
      } catch (err) {
         return null!;
      }
   }

   public async getUserInfo(user_id: string) {
      let res = await this._flickr("flickr.people.getInfo", {
         user_id,
      });

      return res as GetUserInfoResponse;
   }

   public async getPhotoTags(photo_id: string) {
      try {

         let res = await this._flickr("flickr.tags.getListPhoto", {
            photo_id,
         });

         return res as GetPhotoTagsResponse;
      } catch (err) {
         return null!;
      }
   }
}

export async function flickr_main(prisma: PrismaClient) {
   const userCount = await prisma.user.count();
   if (userCount > 0) {
      console.log(`Database already seeded.`);
      return;
   }

   const flickrApi = new FlickrApi();
   const photos = await flickrApi.getRecentPhotos(200);

   const userIds = photos.photos.photo.map(p => p.owner);
   const flickrUsers = new Map<string, GetUserInfoResponse>();

   for (let userId of userIds) {
      const flickrUser = await flickrApi.getUserInfo(userId);
      flickrUsers.set(flickrUser.person.id, flickrUser);
   }

   const photoUrls = photos.photos
      .photo
      .map(p => `https://live.staticflickr.com/${p.server}/${p.id}_${p.secret}.jpg`);

   const imagePromises = photos.photos.photo
      .map<Promise<Partial<Image>>>(async (p, index) => {
         const tags = await flickrApi.getPhotoTags(p.id);
         const pInfo = await flickrApi.getPhotoInfo(p.id);

         const res = await fetch(photoUrls[index]);
         const headers = res.headers;
         const h = headers.get(`Imageheight`);
         const w = headers.get(`Imagewidth`);

         return ({
            absolute_url: `https://live.staticflickr.com/${p.server}/${p.id}_${p.secret}.jpg`,
            dimensions_set: [`${w},${h}`],
            tags: tags?.photo.tags.tag.map(t => t.raw) ?? [],
            metadata: { aiGenerated: false },
            userId: p.owner,
            original_file_name: `${p.id}.${pInfo?.photo.originalformat ?? ``}`,
            file_format: pInfo?.photo.originalformat ?? `jpg`,
            title: p.title,
         });
      });
   const images = await Promise.all(imagePromises);

   // @ts-ignore
   const users = [...flickrUsers.values()]
      .slice(0, 20)
      .map((u, index) => ({
         name: u.person.username._content,
         userId: u.person.id,
         userImageUrl: ``,
         images: images.slice(index * 10, index * 10 + 10),
      }));

   const dbUsers: (User & {
      profile: Profile,
      images: Image[],
      accounts: Account[],
      imageCollections: ImageCollection[]
   })[] = [];

   for (const user of users) {
      const randomUser: UserResponse = await fetch(`https://randomuser.me/api`)
         .then((r) => r.json());

      const dbUser = await prisma.user.upsert({
         where: { email: randomUser.results[0].email },
         update: {},
         create: {
            email: randomUser.results[0].email,
            password: bcrypt.hashSync(`${user.name}123!`, 10),
            name: user.name,
            image: randomUser.results[0].picture.large,
            imageCollections: {
               create: {
                  title: `Default`,
                  metadata: {},
                  public: false,
                  is_deleted: false,
               },
            },
            images: {
               // @ts-ignore
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
                  about: ``,
                  city: randomUser.results[0].location.city,
                  country: randomUser.results[0].location.country,
                  firstName: randomUser.results[0].name.first,
                  lastName: randomUser.results[0].name.last,
                  dateOfBirth: null!,
                  gender: randomUser.results[0].gender === `female` ? `FEMALE` : `MALE`,
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

   console.log(`Database seeding done.`);
}

