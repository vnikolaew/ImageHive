"use client";
import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import {
   Dialog, DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { ModalType, useModals } from "@/providers/ModalsProvider";
import { API_ROUTES, HTTP } from "@/lib/consts";
import useSWR, { KeyedMutator } from "swr";
import { Search, Image, Check, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQsImageId } from "@/hooks/useQsImageId";
import { ImageCollectionApiResponse } from "@/app/api/collections/route";
import { getFileName } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { handleAddImageToCollection, handleRemoveImageFromCollection } from "@/app/actions";


export const AddImageToCollectionModalWrapper = () => {
   const { modal, toggleModal } = useModals();
   const { data, error, isLoading, mutate } = useSWR<{
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
      return searchValue?.length ? data?.collections.filter(c => c.title?.toLowerCase().includes(searchValue.toLowerCase())) : (data?.collections ?? []);
   }, [data?.collections, searchValue]);

   const [imageId] = useQsImageId();

   console.log({ collections: data?.collections });

   useEffect(() => {
      if (data !== undefined && !isLoading && !data?.collections?.length && imageId?.length && modal === ModalType.ADD_IMAGE_TO_COLLECTION) {
         console.log(`Adding image with ID ${imageId} to default Saved collection`);
         fetch(API_ROUTES.COLLECTIONS, {
            method: `POST`,
            headers: {
               Accept: HTTP.MEDIA_TYPES.APPLICATION_JSON,
               "Content-Type": HTTP.MEDIA_TYPES.APPLICATION_JSON,
            },
            body: JSON.stringify({ imageId, title: `Saved` }),

         }).then(res => res.json())
            .then(res => {
               console.log({ res });
               mutate();
            })
            .catch(console.error);
      }
   }, [data, data?.collections?.length, imageId, isLoading, modal, mutate]);

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
            <div className={`w-full mt-2 rounded-md p-2 bg-neutral-100/70 min-h-[200px]`}>
               <ScrollArea>
                  {filteredCollections?.map((collection, i) => (
                     <ImageCollectionItem collection={collection} key={i} />
                  ))}
               </ScrollArea>
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
   const firstCollectionImageSrc = `/uploads/${getFileName(collection.images.at(0)?.image?.absolute_url ?? ``)}`;
   const [imageWidth, imageHeight] = collection?.images?.at(0)?.image?.dimensions?.at(0) ?? [200, 200];
   const [imageId] = useQsImageId();

   const isCurrentImageSaved = useMemo(() => {
      return collection.images.some(i => i.imageId === imageId);
   }, [collection.images, imageId]);


   async function handleRemove() {
      await handleRemoveImageFromCollection(imageId!, collection.id).then(console.log).catch(console.error);
   }

   async function handleAdd() {
      await handleAddImageToCollection(imageId!, collection.id).then(console.log).catch(console.error);
   }

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
                 <Image size={12} /> {collection.images.length} items
               </span>
            </div>
         </div>
         <div className={`absolute right-4 top-4 z-10 text-white`}>
            {!isCurrentImageSaved ? (
               <Button
                  onClick={handleAdd}
                  className={`bg-green-600 items-center gap-2 hover:bg-transparent transition-colors duration-200 rounded-full border-transparent hover:border-white hover:border-[1px]`}>
                  <Plus size={12} /> add
               </Button>
            ) : (
               <Button
                  onClick={handleRemove}
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
         <Search size={18} className={`absolute top-[50%] left-2 -translate-y-1/2 cursor-pointer text-primary`} />
         <Input
            onChange={e => setSearch(e.target.value)}
            value={search} placeholder={`Filter your collections`}
            className={`rounded-full dark:bg-neutral-100 focus-visible:ring-0 border-none pl-8 text-neutral-700 placeholder:text-neutral-400 text-sm `} />
      </div>
   );
};

export default AddImageToCollectionModal;