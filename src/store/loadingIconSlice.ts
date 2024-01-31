import { StateCreator } from "zustand";

export type LoadingIconSlice = {
    isLoadingIcon: boolean;
    showLoadingIcon: (value: boolean) => void;    
}

export const createLoadingIconSlice: StateCreator<LoadingIconSlice, [], [], LoadingIconSlice> = (set) => ({
    isLoadingIcon: false,
    showLoadingIcon: (value: boolean) => {
        set({ isLoadingIcon: value });
    },
});