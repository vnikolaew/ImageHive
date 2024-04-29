"use client";
import { useQsCollectionId, useQueryString } from "@/hooks/useQueryString";
import { ModalType, useModals } from "@/providers/ModalsProvider";
import { handleLikeImage, handleUnlikeImage } from "@/app/actions";
import React, { Fragment } from "react";
import GridColumnImage, { ActionButton } from "@/app/_components/GridColumnImage";
import { Bookmark, Heart, Trash } from "lucide-react";
import { getFileName, getSessionImageSrc } from "@/lib/utils";
import { CollectionGridColumnProps } from "@/app/account/collections/[collectionId]/page";
import { Image as IImage, User } from "@prisma/client";
import Image from "next/image";

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
         imageUrl={`/uploads/${getFileName(image.absolute_url)}`}
         image={image}
         imageKey={image.id}
         key={image.id} />
   );
};