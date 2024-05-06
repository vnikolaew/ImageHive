import { Image, Message, Prisma, PrismaClient, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { InternalArgs } from "@prisma/client/runtime/binary";
import { groupBy } from "lodash";
import path from "path";
import { __IS_DEV__ } from "@nx-web/shared";
import { messages } from "nx/src/utils/ab-testing";

export const config = { runtime: "node.js" };

export const globalForPrisma = globalThis as unknown as {
   prisma: PrismaClient | undefined
};

function isAbsoluteUrl(url: string) {

   // Regular expression for absolute URL
   const absoluteUrlPattern = /^(?:https?:\/\/)?(?:\w+\.)+\w{2,}(?:\/.*)?$/;

   // Test the string against the pattern
   return absoluteUrlPattern.test(url);
}

function getFileName(fileName: string) {
   if (fileName?.includes(`\\`)) return fileName?.split(`\\`).at(-1)?.trim();
   return fileName?.split(`/`)?.at(-1)?.trim();
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
   log: [{ emit: `stdout`, level: `info` }],
   errorFormat: `pretty`,
   transactionOptions: { isolationLevel: `Serializable` },
});

export const xprisma = prisma.$extends({
   result: {
      account: {
         deleteResetToken: {
            needs: { providerAccountId: true, provider: true, metadata: true, userId: true },
            compute(account) {
               return async () => {
                  if (!Object.hasOwn(account?.metadata as object ?? {}, "reset_token")) return account;

                  const { reset_token, ...rest } = account!.metadata as Record<string, any>;
                  return await xprisma.account.update({
                     where: {
                        userId: account.userId,
                        provider_providerAccountId: {
                           providerAccountId: account!.providerAccountId, provider: account!.provider,
                        },
                     },
                     data: { metadata: rest },
                  });
               };
            },
         },
      },
      user: {
         profilePictureImageSrc: {
            needs: { image: true },
            compute({ image }) {
               if (!image) return null;
               return isAbsoluteUrl(image) ? image : path.join(`/profile-pictures`, getFileName(image)!).replaceAll(`\\`, `/`);
            },
         },
         verifyPassword: {
            needs: { password: true },
            compute(user) {
               return (password: string) => {
                  return bcrypt.compareSync(password, user.password ?? ``);
               };
            },
         },
         updatePassword: {
            needs: { id: true },
            compute(user) {
               return async (password: string) => {
                  return await xprisma.user.update({
                     where: { id: user.id },
                     data: {
                        password: bcrypt.hashSync(password, 10),
                     },
                  });
               };
            },
         },
      },
      image: {
         dimensions: {
            needs: { dimensions_set: true },
            compute({ dimensions_set }) {
               return dimensions_set.map(d => d.split(`,`).map(x => Number(x)).filter(x => !Number.isNaN(x)));
            },
         },
         classified: {
            needs: { metadata: true },
            compute({ metadata }) {
               // @ts-ignore
               return metadata.classified === true;
            },
         },
      },
   },
   model: {
      user: {
         async inbox({ userId }: { userId: string }): Promise<Message[]> {
            const messages = await xprisma.message.findMany({
               where: {
                  recipientId: userId,
                  is_deleted: false,
               },
               orderBy: {
                  createdAt: `desc`,
               },
               include: {
                  sender: { select: { id: true, name: true, image: true, email: true } },
               },
               take: 20,
            });
            return messages;
         },
         async outbox({ userId }: { userId: string }): Promise<Message[]> {
            const messages = await xprisma.message.findMany({
               where: {
                  senderId: userId,
                  is_deleted: false,
               },
               orderBy: {
                  createdAt: `desc`,
               },
               include: {
                  recipient: { select: { id: true, name: true, image: true, email: true } },
               },
               take: 20,
            });

            return messages;
         },
         async signIn({ email, password, username }: {
            email: string;
            password: string,
            username: string
         }, select?: Prisma.UserSelect<InternalArgs>): Promise<Partial<User> | null> {
            const user = await xprisma.user.findFirst({
               where: {
                  OR: [
                     {
                        email: email as string,
                     },
                     {
                        name: username as string,
                     },
                  ],
               },
               select: {
                  id: true,
                  email: true,
                  name: true,
                  verifyPassword: true,
                  image: true,
                  ...(select ?? {}),
               },
            });

            if (user && user.verifyPassword?.(password as string ?? ``)) {
               return {
                  id: user.id,
                  email: user.email,
                  name: user.name,
                  image: user.image,
               };
            }

            return null!;
         },
         async signUp({ email, password, username, image }: {
            email: string;
            password: string,
            username: string,
            image?: string
         }, select?: Prisma.UserSelect<InternalArgs>) {

            const user = await xprisma.user.create({
               data: {
                  email,
                  password: bcrypt.hashSync(password, 10),
                  name: username,
                  image,
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
               select: {
                  id: true,
                  email: true,
                  name: true,
                  ...(select ?? {}),
               },
            });
            await xprisma.account.create({
               data: {
                  userId: user.id,
                  provider: `credentials`,
                  providerAccountId: user.id,
                  type: `basic`,
               },
            });

            return user;
         },
      },
      image: {
         async homeFeedRaw(limit = 20): Promise<Image[]> {
            const images = await xprisma.$queryRaw<Image[]>`
               SELECT "Image".*,
                      COALESCE(il.likes * 1.0, 0)
                         + COALESCE(ic.comments * 1.2, 0)
                         + COALESCE(id.downloads * 1.5, 0)
                         + COALESCE(icc.collections * 0.7, 0) +
                      COALESCE(vc.views * 0.4, 0)
                         as feed_score
               FROM "Image"
                       LEFT JOIN (SELECT "imageId",
                                         COUNT(*) AS likes
                                  FROM "ImageLike"
                                  GROUP BY "imageId") AS il ON "Image".id = il."imageId"
                       LEFT JOIN (SELECT "imageId",
                                         COUNT(*) AS comments
                                  FROM "ImageComment"
                                  GROUP BY "imageId") ic ON "Image".id = ic."imageId"
                       LEFT JOIN (SELECT "imageId",
                                         COUNT(*) AS downloads
                                  FROM "ImageDownload"
                                  GROUP BY "imageId") id ON "Image".id = id."imageId"
                       LEFT JOIN (SELECT "imageId",
                                         COUNT(*) AS collections
                                  FROM "CollectionImage"
                                  GROUP BY "imageId") icc ON "Image".id = icc."imageId"
                       LEFT JOIN (SELECT "imageId",
                                         COUNT(*) AS views
                                  FROM "ImageView"
                                  GROUP BY "imageId") vc ON "Image".id = vc."imageId"
               ORDER BY feed_score DESC, "createdAt" DESC
                  LIMIT ${limit};
            `;

            return images;
         },

         async homeFeedRaw_Latest(limit = 20): Promise<Image[]> {
            return await xprisma.image.findMany({
               orderBy: { createdAt: `desc` },
               take: limit,
            });
         },

         async search_Trending(searchValue: string, filters?: Record<string, any>, limit = 10): Promise<Image[]> {
            const iLikeSearch = `%${searchValue}%`;
            const filterClause = filters?.date instanceof Date ? Prisma.sql`AND i."createdAt" > ${filters.date}` : Prisma.sql``;

            const result = await xprisma.$queryRaw`
               SELECT *,
                      unnested_tag                              AS tag_match,
                      levenshtein(LOWER(title), ${searchValue}) AS title_distance
               FROM (SELECT *
                     FROM (SELECT unnest(tags) unnested_tag, * FROM "Image") i
                     WHERE i."unnested_tag" ILIKE ${iLikeSearch} ${filterClause}) s
               ORDER BY title_distance
                  LIMIT ${limit};
            `;

            return Object
               .entries(groupBy(result as any[], i => i.id))
               .map(([_, value]) => value[0] as Image);
         },
         async search_Latest(searchValue: string, filters?: Record<string, any>, limit = 10): Promise<Image[]> {
            const iLikeSearch = `%${searchValue}%`;
            const filterClause = filters?.date instanceof Date ? Prisma.sql`AND i."createdAt" > ${filters.date}` : Prisma.sql``;

            const result = await xprisma.$queryRaw`
               SELECT *,
                      unnested_tag                              AS tag_match,
                      levenshtein(LOWER(title), ${searchValue}) AS title_distance
               FROM (SELECT *
                     FROM (SELECT unnest(tags) unnested_tag, * FROM "Image") i
                     WHERE i."unnested_tag" ILIKE ${iLikeSearch} ${filterClause}) s
               ORDER BY "createdAt" DESC, title_distance
                  LIMIT ${limit};
            `;

            return Object
               .entries(groupBy(result as any[], i => i.id))
               .map(([_, value]) => value[0] as Image);
         },
         async search_MostRelevant(searchValue: string, filters?: Record<string, any>, limit = 10): Promise<Image[]> {
            const iLikeSearch = `%${searchValue}%`;
            const filterClause = filters?.date instanceof Date ? Prisma.sql`AND i."createdAt" > ${filters.date}` : Prisma.sql``;

            const result = await xprisma.$queryRaw`
               SELECT *,
                      unnested_tag                              AS tag_match,
                      levenshtein(LOWER(title), ${searchValue}) AS title_distance
               FROM (SELECT *
                     FROM (SELECT unnest(tags) unnested_tag, * FROM "Image") i
                     WHERE i."unnested_tag" ILIKE ${iLikeSearch} ${filterClause}) s
               ORDER BY "createdAt" DESC, title_distance
                  LIMIT ${limit};
            `;

            return Object
               .entries(groupBy(result as any[], i => i.id))
               .map(([_, value]) => value[0] as Image);
         },
         async search(searchValue: string, filters?: Record<string, any>, limit = 10): Promise<Image[]> {
            const iLikeSearch = `%${searchValue}%`;
            const filterClause = filters?.date instanceof Date ? Prisma.sql`AND i."createdAt" > ${filters.date}` : Prisma.empty;

            const result = await xprisma.$queryRaw`
               SELECT *,
                      unnested_tag                              AS tag_match,
                      levenshtein(LOWER(title), ${searchValue}) AS title_distance
               FROM (SELECT *
                     FROM (SELECT unnest(tags) unnested_tag, * FROM "Image") i
                     WHERE i."unnested_tag" ILIKE ${iLikeSearch} ${filterClause}) s
               ORDER BY title_distance
                  LIMIT ${limit};
            `;

            return Object
               .entries(groupBy(result as any[], i => i.id))
               .map(([_, value]) => value[0] as Image);
         },
         async findSimilarImages(image: Image, limit = 10): Promise<Image[]> {
            const imageTags = image.tags.map(t => t.toLowerCase());
            const arrayFilter = imageTags.length > 0
               ? Prisma.sql`WHERE i.tag ILIKE ANY (array [${Prisma.join(imageTags)}])`
               : Prisma.empty;

            const result = await xprisma.$queryRaw<Image[]>`
               SELECT DISTINCT(i.id), *
               FROM (SELECT *
                     FROM (SELECT *, unnest(tags) tag from "Image") i
                     ${arrayFilter}) i
                  LIMIT ${limit}
               ;
            `;

            return result!;
         },
         async mostUsedTags(limit = 20): Promise<{ tag: string, count: bigint }[]> {
            const result = await xprisma.$queryRaw<{ tag: string, count: bigint }[]>`
               SELECT unnest(tags) as tag, COUNT(*) AS count
               FROM "Image"
               GROUP BY tag
               ORDER BY count DESC
                  LIMIT ${limit};
            `;

            return result;
         },
      },
   },
});

export type XPrismaClient = typeof xprisma

// @ts-ignore
if (__IS_DEV__) globalForPrisma.prisma = xprisma;
