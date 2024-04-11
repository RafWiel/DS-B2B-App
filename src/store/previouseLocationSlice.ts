import { StateCreator } from "zustand";

export type PreviousLocationSlice = {
    previousLocation: string;
    setPreviousLocation: (value: string) => void;    
}

export const createPreviousLocationSlice: StateCreator<PreviousLocationSlice, [], [], PreviousLocationSlice> = (set) => ({
    previousLocation: '',
    setPreviousLocation: (value: string) => {
        set({ previousLocation: value });
    },
});