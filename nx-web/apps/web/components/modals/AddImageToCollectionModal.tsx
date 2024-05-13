"use client";
import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import { ModalType, useModals } from "@web/providers/ModalsProvider";
import useSWR, { KeyedMutator, useSWRConfig } from "swr";
import { useQueryString } from "@web/hooks/useQueryString";
import { handleAddImageToCollection, handleRemoveImageFromCollection } from "@web/app/actions";
import { Check, Plus, Search, Image } from "lucide-react";
import { ImageCollectionApiResponse } from "@web/app/api/collections/route";
import { API_ROUTES } from "@nx-web/shared";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@components/dialog";
import { ScrollArea } from "@components/scroll-area";
import { Button } from "@components/button";
import { Input } from "@components/input";
import { cn, getFileName } from "@web/lib/utils";
import { useAction } from "next-safe-action/hooks";


export const AddImageToCollectionModalWrapper = () => {
   const { modal } = useModals();
   const { data, isLoading, mutate } = useSWR<{
      collections: ImageCollectionApiResponse
   }>(API_ROUTES.COLLECTIONS);

   if (modal !== ModalType.ADD_IMAGE_TO_COLLECTION) return null;

   return <AddImageToCollectionModal data={data} mutate={mutate} isLoading={isLoading} />;
};

interface AddImageToCollectionModalProps {
   data?: {
      collections: ImageCollectionApiResponse
   };
   isLoading: boolean;
   mutate: KeyedMutator<{
      collections: ImageCollectionApiResponse
   }>;
}

const AddImageToCollectionModal = ({ data, isLoading, mutate }: AddImageToCollectionModalProps) => {
   const { modal, toggleModal, openModal } = useModals();
   const [searchValue, setSearchValue] = useState(``);

   const filteredCollections = useMemo(() => {
      return searchValue?.length
         ? data?.collections.filter(c => c.title?.toLowerCase().includes(searchValue.toLowerCase()))
         : (data?.collections ?? []);
   }, [data?.collections, searchValue]);

   const noResultsFound = useMemo(() => {
      return !!searchValue?.length && !filteredCollections?.length
         || (!searchValue?.length && !data?.collections?.length);
   }, [filteredCollections?.length, searchValue?.length]);

   return (
      <Dialog onOpenChange={_ => toggleModal(ModalType.ADD_IMAGE_TO_COLLECTION)}
              open={modal === ModalType.ADD_IMAGE_TO_COLLECTION}>
         <DialogTrigger></DialogTrigger>
         <DialogContent className="sm:max-w-[450px] !p-8 min-h-[70vh] !h-fit flex flex-col items-start">
            <DialogHeader className="">
               <DialogTitle className={`text-left text-2xl`}>Add to collection(s)</DialogTitle>
               <DialogDescription className={`!mt-4 text-slate-500 text-sm`}>
                  Add this image to an existing or create a new one
               </DialogDescription>
            </DialogHeader>
            <div className="mt-0 w-full">
               <div
                  onClick={_ => openModal(ModalType.CREATE_NEW_COLLECTION)}
                  className={`w-full mt-4 rounded-sm bg-neutral-200 flex items-center justify-center h-[100px] cursor-pointer text-black text-sm hover:border-[1.5px] hover:border-green-500 hover:text-green-500 hover:bg-green-100 transition-colors duration-100`}>
                  + Create a new collection
               </div>
            </div>
            <div className={`w-full`}>
               <ImageCollectionSearchModal search={searchValue} setSearch={setSearchValue} />
            </div>
            <div className={cn(`w-full mt-2 rounded-md p-2 bg-neutral-100/70 min-h-[120px]`,
               noResultsFound && `!min-h-[100px] flex items-center justify-center`)}>
               {noResultsFound ? (
                  <div className={`w-full h-full flex items-center justify-center text-sm`}>
                     No collections found.
                  </div>
               ) : (
                  <ScrollArea className="!h-full">
                     {filteredCollections?.map((collection, i) => (
                        <ImageCollectionItem collection={collection} key={i} />
                     ))}
                  </ScrollArea>
               )}
            </div>
         </DialogContent>
      </Dialog>
   );
};

interface ImageCollectionSearchModalProps {
   search: string;
   setSearch: Dispatch<SetStateAction<string>>;
}

type ArrayElement<A> = A extends readonly (infer T)[] ? T : never

interface ImageCollectionProps {
   collection: ArrayElement<ImageCollectionApiResponse>;
}

const ImageCollectionItem = ({ collection }: ImageCollectionProps) => {
   const firstCollectionImageSrc = `/uploads/${getFileName(collection?.images?.at(0)?.image?.absolute_url ?? ``)}`;
   const [imageWidth, imageHeight] = collection?.images?.at(0)?.image?.dimensions?.at(0) ?? [200, 200];

   const [imageId] = useQueryString();
   const { mutate } = useSWRConfig();

   const isCurrentImageSaved = useMemo(() =>
      collection?.images?.some(i => i.imageId === imageId),
      [collection.images, imageId]);

   const { execute: handleRemove, status: removeStatus } = useAction(handleRemoveImageFromCollection, {
      onSuccess: async res => {
         if (res.success) {
            await mutate(API_ROUTES.COLLECTIONS);
         }
      },
   });
   const { execute: handleAdd, status } = useAction(handleAddImageToCollection, {
      onSuccess: async res => {
         if (res.success) {
            await mutate(API_ROUTES.COLLECTIONS);
         }
      },
   });

   return (
      <div
         className={`w-full relative cursor-pointer p-3 h-[80px] rounded-md dark:bg-neutral-100 mt-2 text-black text-sm group`}>
         <div
            style={{
               backgroundImage: `url(${firstCollectionImageSrc})`,
               backgroundPosition: `center center`,
               backgroundSize: `400px ${Math.round(imageHeight / imageWidth * 400)}px`,
               filter: `brightness(50%)`,
            }}
            className={`absolute w-full h-full top-0 left-0 rounded-md`}
         ></div>
         <div
            className={`absolute w-full h-full top-0 left-0 rounded-md group-hover:bg-green-400/30 transition-colors duration-300`}></div>
         <div className={`absolute left-4 top-4 z-10 text-white`}>
            <div className={`flex flex-col items-start gap-1 z-10`}>
               <h2 className={`font-semibold text-md text-white/100`}>
                  {collection.title}
               </h2>
               <span className={`font-semibold flex items-center gap-1 text-xs text-neutral-300`}>
                 <Image size={12} /> {collection.images.length === 0 ? `No` : collection.images.length} items
               </span>
            </div>
         </div>
         <div className={`absolute right-4 top-4 z-10 text-white`}>
            {!isCurrentImageSaved ? (
               <Button
                  onClick={_ => handleAdd({ imageId, collectionId: collection.id })}
                  className={`bg-green-600 items-center gap-2 hover:bg-transparent transition-colors duration-200 rounded-full border-transparent hover:border-white hover:border-[1px]`}>
                  <Plus size={12} /> add
               </Button>
            ) : (
               <Button
                  onClick={_ => handleRemove({imageId, collectionId: collection.id})}
                  className={`bg-green-600 items-center gap-2 hover:bg-transparent transition-colors duration-200 rounded-full border-transparent hover:border-white hover:border-[1px]`}>
                  <Check size={12} /> added
               </Button>

            )}
         </div>
      </div>
   );
};

const ImageCollectionSearchModal = ({ setSearch, search }: ImageCollectionSearchModalProps) => {
   return (
      <div className={`w-full rounded-md relative dark:bg-neutral-100 mt-2 `}>
         <Search size={14} className={`absolute top-[50%] left-4 -translate-y-1/2 cursor-pointer text-primary`} />
         <Input
            onChange={e => setSearch(e.target.value)}
            value={search} placeholder={`Filter your collections`}
            className={`rounded-full dark:bg-neutral-100 focus-visible:ring-0 border-none pl-10 text-neutral-700 placeholder:text-neutral-400 text-sm `} />
      </div>
   );
};

export default AddImageToCollectionModal;
