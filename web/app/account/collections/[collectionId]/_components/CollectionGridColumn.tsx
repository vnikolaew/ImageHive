"use client"
import { useQsCollectionId, useQsImageId } from "@/hooks/useQsImageId";
import { ModalType, useModals } from "@/providers/ModalsProvider";
import { handleLikeImage, handleUnlikeImage } from "@/app/actions";
import React, { Fragment } from "react";
import GridColumnImage, { ActionButton } from "@/app/_components/GridColumnImage";
import { Bookmark, Heart, Trash } from "lucide-react";
import { getFileName } from "@/lib/utils";
import { CollectionGridColumnProps } from "@/app/account/collections/[collectionId]/page";
import Image from "next/image";
import {Image as IImage} from "@prisma/client";

export const CollectionGridColumn = ({ images, likedImageIds, collectionId }: CollectionGridColumnProps & { collectionId: string}) => {
   const [, setImageId] = useQsImageId();
   const [, setCollectionId] = useQsCollectionId();
   const { openModal } = useModals();

   async function handleAddToCollection(id: string) {
      setImageId(id).then(_ => {
         setTimeout(_ => openModal(ModalType.ADD_IMAGE_TO_COLLECTION), 100);
      });
   }

   async function handleRemoveFromCollection(id: string) {
      setImageId(id)
         .then(_ => setCollectionId(collectionId))
         .then(_ => {
         setTimeout(_ => openModal(ModalType.REMOVE_IMAGE_FROM_COLLECTION), 100);
      });
   }

   async function handleLikeImageClient(id: string) {
      if (likedImageIds.has(id)) handleUnlikeImage(id).then(console.log).catch(console.error);
      else handleLikeImage(id).then(console.log).catch(console.error);
   }

   const topContent = (imageId: string) => (
      <Fragment>
         <ActionButton
            text={`Remove from collection`} icon={<Trash className={`text-white`} size={18} />}
            action={() => handleRemoveFromCollection(imageId)} />
         <ActionButton
            text={`Add to collection`} icon={<Bookmark className={`text-white`} size={18} />}
            action={() => handleAddToCollection(imageId)} />
         <ActionButton
            active={likedImageIds.has(imageId)}
            text={likedImageIds.has(imageId) ? `Unlike` : `Like`} icon={<Heart className={`text-white`} size={18} />}
            action={() => handleLikeImageClient(imageId)} />
      </Fragment>
   );

   const bottomContent = (image: IImage) =>(
      <div className={`flex items-center gap-4`}>
         {/*<Image src={image.absolute_url} alt={} />*/}
      </div>
   );

   return <div className={`grid gap-8`}>
      {images.map((image, i) => (
         <GridColumnImage
            topContent={topContent(image.id)}
            bottomContent={bottomContent(image)}
            likedByMe={likedImageIds.has(image.id)}
            imageUrl={`/uploads/${getFileName(image.absolute_url)}`}
            image={image}
            imageKey={image.id}
            key={image.id } />
      ))}
   </div>;

};
