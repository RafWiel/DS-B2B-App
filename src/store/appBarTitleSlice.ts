import { StateCreator } from "zustand";

export type AppBarTitleSlice = {
    appBarTitle: string;
    setAppBarTitle: (value: string) => void;          
}

export const createAppBarTitleSlice: StateCreator<AppBarTitleSlice, [], [], AppBarTitleSlice> = (set) => ({
    appBarTitle: 'test',
    setAppBarTitle: (value) => {        
        set({ appBarTitle: value });
    }     
});