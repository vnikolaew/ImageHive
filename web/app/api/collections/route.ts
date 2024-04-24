import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { xprisma } from "@/lib/prisma";
import { ImageHiveApiResponse } from "@/lib/utils";
import { z } from "zod";
import { ImageCollection, Prisma } from "@prisma/client";
import {
   CollectionImageCreateWithoutCollectionInput, CollectionImageUncheckedCreateWithoutCollectionInput,
   XOR,
} from "prisma-client-5d77d53f158f8e873249ba83246b0a019e69e7d8ad78aa785d168f741cece791";

export const revalidate = 60;

export type ImageCollectionApiResponse = (ImageCollection & {
   images: ({ image: { id: string, absolute_url: string, dimensions_set: string[], dimensions: number[][] } } & {
      metadata: Prisma.JsonValue;
      id: string
      imageId: string
      createdAt: Date
      updatedAt: Date
      is_deleted: boolean
      collectionId: string
   })[]
})[]

export async function GET(req: NextRequest, res: NextResponse): Promise<any> {
   const session = await auth();
   if (!session) return ImageHiveApiResponse.unauthenticated();

   const myCollections = await xprisma.imageCollection.findMany({
      where: {
         userId: session.user?.id,
      },
      include: {
         images: {
            include: {
               image: {
                  select: {
                     id: true,
                     absolute_url: true,
                     dimensions_set: true,
                     dimensions: true,
                  },
               },
            },
         },
      },
   });

   return ImageHiveApiResponse.json<{ collections: ImageCollectionApiResponse }>({ collections: myCollections });
}

const newCollectionSchema = z.object({
   imageId: z.string().nullable(),
   title: z.string().max(100, { message: "Title must contain at most 100 characters." }),
   public: z.union([z.literal(`true`), z.literal(`false`)]),
});

export async function POST(req: NextRequest, res: NextResponse): Promise<any> {
   const session = await auth();
   if (!session) return ImageHiveApiResponse.unauthenticated();

   const body = await req.json();
   const newCollectionBody = newCollectionSchema.safeParse(body);
   if (!newCollectionBody.success) return ImageHiveApiResponse.failure(`Invalid body.`);

   let create: XOR<CollectionImageCreateWithoutCollectionInput, CollectionImageUncheckedCreateWithoutCollectionInput>
      | CollectionImageCreateWithoutCollectionInput[]
      | CollectionImageUncheckedCreateWithoutCollectionInput[] = null!;
   if (!!newCollectionBody.data.imageId?.length) {
      create = {
         imageId: newCollectionBody.data.imageId,
         metadata: {},
      };
   }
   const newCollection = await xprisma.imageCollection.create({
         data: {
            userId: session.user!.id!,
            title: newCollectionBody.data.title,
            metadata: {},
            public: newCollectionBody.data.public === `true`,
            ...(!!create ? ({ images: { create } }) : {}),
         },
      })
   ;

   console.log({ newCollection });
   return ImageHiveApiResponse.success({ newCollection });
}

