import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ImageCollection, Prisma } from "@prisma/client";
import {
   CollectionImageCreateWithoutCollectionInput, CollectionImageUncheckedCreateWithoutCollectionInput,
   XOR,
} from "@prisma-client";
import { revalidatePath } from "next/cache";
import { auth } from "@web/auth";
import { xprisma } from "@nx-web/db";
import { ImageHiveApiResponse } from "@web/lib/utils";

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
   if (!!newCollectionBody.data.imageId?.length) {
      revalidatePath(`/photos/${newCollectionBody.data.imageId}`);
   }

   revalidatePath(`/account/collections`);
   revalidatePath(`/account/collections/${newCollection.id}`);
   return ImageHiveApiResponse.success({ newCollection });
}


const editCollectionSchema = z.object({
   collectionId: z.string(),
   title: z.string().max(100, { message: "Title must contain at most 100 characters." }),
   public: z.union([z.literal(`true`), z.literal(`false`)]),
});

export async function PUT(req: NextRequest, res: NextResponse): Promise<any> {
   const session = await auth();
   if (!session) return ImageHiveApiResponse.unauthenticated();

   const body = await req.json();
   const editCollectionBody = editCollectionSchema.safeParse(body);
   if (!editCollectionBody.success) return ImageHiveApiResponse.failure(`Invalid body.`);

   const collection = await xprisma.imageCollection.findUnique({
      where: { id: editCollectionBody.data.collectionId },
   });
   if (!collection) return ImageHiveApiResponse.failure(`Collection with ID ${editCollectionBody.data.collectionId} not found.`);

   const newCollection = await xprisma.imageCollection.update({
         where: { id: collection.id },
         data: {
            title: editCollectionBody.data.title,
            public: editCollectionBody.data.public === `true`,
         },
      })
   ;

   console.log({ newCollection });

   revalidatePath(`/account/collections`);
   revalidatePath(`/account/collections/${newCollection.id}`);

   return ImageHiveApiResponse.success({ newCollection });
}
