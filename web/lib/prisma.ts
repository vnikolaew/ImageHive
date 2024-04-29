import { Image, Prisma, PrismaClient, User } from "@prisma/client";
import { __IS_DEV__ } from "@/lib/consts";
import bcrypt from "bcryptjs";
import { InternalArgs } from "@prisma/client/runtime/binary";
import { groupBy } from "lodash";
import { getFileName, isAbsoluteUrl } from "@/lib/utils";
import path from "path";

export const config = { runtime: "node.js" };

export const globalForPrisma = globalThis as unknown as {
   prisma: PrismaClient | undefined
};

export let prisma = globalForPrisma.prisma ?? new PrismaClient({
   log: [{ emit: `stdout`, level: `info` }],
   errorFormat: `pretty`,
   transactionOptions: { isolationLevel: `Serializable` },
});

export let xprisma = prisma.$extends({
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
      },
   },
   model: {
      user: {
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

            let user = await xprisma.user.create({
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
         async search(searchValue: string, limit: number = 10): Promise<Image[]> {
            const iLikeSearch = `%${searchValue}%`

            const result = await xprisma.$queryRaw`
                SELECT *,
                       unnested_tag                          AS tag_match,
                       levenshtein(LOWER(title), ${searchValue}) AS title_distance
                FROM (SELECT * FROM (SELECT unnest(tags) unnested_tag, * FROM "Image") i
                WHERE i."unnested_tag" ILIKE ${iLikeSearch}) s
                ORDER BY title_distance
                LIMIT ${limit};
            `;

            return Object
               .entries(groupBy(result as any[], i => i.id))
               .map(([_, value]) => value[0] as Image);
         },
         async findSimilarImages(image: Image, limit: number = 10): Promise<Image[]> {
            const imageTags = image.tags.map(t => t.toLowerCase());
            const result = await xprisma.$queryRaw<Image[]>`
                SELECT DISTINCT(i.id), *
                FROM (SELECT *
                      FROM (SELECT *, unnest(tags) tag from "Image") i
                      WHERE i.tag ILIKE ANY (array [${Prisma.join(imageTags)}])) i
                LIMIT ${limit}
                ;
            `;

            return result!;
         },
         async mostUsedTags(limit: number = 20): Promise<{ tag: string, count: BigInt }[]> {
            const result = await xprisma.$queryRaw<{ tag: string, count: BigInt }[]>`
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