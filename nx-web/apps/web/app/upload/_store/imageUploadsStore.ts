import { createStore } from "zustand";
import { enableMapSet, produce } from "immer";

enableMapSet();

export interface ImageUpload {
   inputFile: File;
   imagePreview: string;
   id: string;
   tags: string[];
   description?: string;
   aiGenerated: boolean;
}

export interface StoreState {
   imageUploads: ImageUpload[];
}

export interface StoreActions {
   updateImage: (id: string, data: Partial<ImageUpload>) => void;
   removeImage: (id: string) => void;
}

export interface Store extends StoreState, StoreActions{
}

export const createImageUploadStore = () => createStore<StoreState & StoreActions>((set) => ({
   imageUploads: [],
   updateImage: (id: string, data: Partial<ImageUpload>) => set((state) => {
      return produce(state, draft => {
         if (draft.imageUploads.some(image => image.id === id)) {
            draft.imageUploads = draft.imageUploads.map(u =>
               u.id === id ? { ...u, ...data } : u);
         } else {
            // @ts-ignore
            draft.imageUploads.push({ ...data });
         }

         return draft;
      });
   }),
   removeImage: (id: string) => set((state) => {
      return produce(state, draft => {
         draft.imageUploads = draft.imageUploads.filter(u => u.id !== id);
         return draft;
      });
   }),
}));