"use client";
import React, { Fragment } from "react";
import { Bookmark, Heart, Trash } from "lucide-react";
import { Image as IImage, User } from "@prisma/client";
import Image from "next/image";
import { useQsCollectionId, useQueryString } from "@web/hooks/useQueryString";
import { ModalType, useModals } from "@web/providers/ModalsProvider";
import { handleLikeImage, handleUnlikeImage } from "@web/app/actions";
import GridColumnImage, { ActionButton } from "@web/app/_components/GridColumnImage";
import { getFileName, getSessionImageSrc, isAbsoluteUrl,  } from "@web/lib/utils";

export interface CollectionGridColumnProps {
  images: (IImage & { dimensions: number[][] })[];
  likedImageIds: Set<string>;
}

export const CollectionGridColumn = ({ images, likedImageIds, collectionId }: CollectionGridColumnProps & {
   collectionId: string
}) => {
   return <div className={`grid gap-8`}>
      {images.map((image, i) => (
         <CollectionGridColumnImage
            image={image as any}
            collectionId={collectionId}
            haveILiked={likedImageIds.has(image.id)}
            key={image.id} />
      ))}
   </div>;

};

export const CollectionGridColumnImage = ({ image, collectionId, haveILiked }: {
   image: IImage & { owner: User },
   collectionId: string,
   haveILiked: boolean
}) => {
   const [, setImageId] = useQueryString();
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
      if (haveILiked) handleUnlikeImage(id).then(console.log).catch(console.error);
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
            active={haveILiked}
            text={haveILiked ? `Unlike` : `Like`} icon={<Heart className={`text-white`} size={18} />}
            action={() => handleLikeImageClient(imageId)} />
      </Fragment>
   );

   const bottomContent = (image: IImage & { owner: User }) => {
      return (
         <div className={`flex items-center gap-2`}>
            <Image className={`rounded-full`} height={32} width={32} src={getSessionImageSrc(image.owner.image!)!}
                   alt={``} />
            <span className={`text-sm text-neutral-200 font-semibold`}>{image.owner.name}</span>
         </div>
      );
   };
   return (
      <GridColumnImage
         topContent={topContent(image.id)}
         bottomContent={bottomContent(image as any)}
         likedByMe={haveILiked}
         imageUrl={isAbsoluteUrl(image.absolute_url) ? image.absolute_url : `/uploads/${getFileName(image.absolute_url)}`}
         image={image}
         imageKey={image.id}
         key={image.id} />
   );
};
