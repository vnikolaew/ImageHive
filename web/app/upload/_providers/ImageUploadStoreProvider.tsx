"use client";
import React, { createContext, ReactNode, useContext, useRef } from "react";
import { StoreApi, useStore } from "zustand";
import { createImageUploadStore, Store } from "@/app/upload/_store/imageUploadsStore";

export interface ImageUploadStoreProviderProps {
}

export const ImageUploadStoreContext = createContext<StoreApi<Store> | null>(
   null,
);

export interface ImageUploadStoreProviderProps {
   children: ReactNode;
}

export const ImageUploadStoreProvider = ({
                                            children,
                                         }: ImageUploadStoreProviderProps) => {
   const storeRef = useRef<StoreApi<Store>>();
   if (!storeRef.current) {
      storeRef.current = createImageUploadStore();
   }

   return (
      <ImageUploadStoreContext.Provider value={storeRef.current}>
         {children}
      </ImageUploadStoreContext.Provider>
   );
};

export const useImageUploadStore = <T, >(
   selector: (store: Store) => T,
): T => {
   const counterStoreContext = useContext(ImageUploadStoreContext);

   if (!counterStoreContext) {
      throw new Error(`useCounterStore must be use within CounterStoreProvider`);
   }

   return useStore(counterStoreContext, selector);
};