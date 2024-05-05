"use server";

import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@web/auth";
import { xprisma } from "@nx-web/db";
import { ImageHiveApiResponse } from "@web/lib/utils";

export async function DELETE(req: NextRequest, ctx: { params: { collectionId: string } }): Promise<any> {
   const { collectionId } = ctx.params;
   const session = await auth();
   if (!session) return ImageHiveApiResponse.unauthenticated();
   console.log({ ctx });

   const collection = await xprisma.imageCollection.findFirst({
      where: {
         id: collectionId,
         userId: session.user?.id,
      },
   });
   if (!collection) return ImageHiveApiResponse.failure(`Collection not found`);

   await xprisma.imageCollection.delete({
      where: { id: collection.id },
      include: {
         images: true,
      },
   });

   revalidatePath(`/account/collections`);
   revalidatePath(`/account/collections/${collection.id}`);
   return ImageHiveApiResponse.success({ collection });
}
