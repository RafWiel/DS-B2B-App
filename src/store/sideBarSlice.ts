import { StateCreator } from "zustand";

export type SideBarSlice = {
    isOpen: boolean;
    open: () => void;  
    close: () => void;      
}

export const createSideBarSlice: StateCreator<SideBarSlice, [], [], SideBarSlice> = (set) => ({
    isOpen: false,
    open: () => {
        console.log('open called');
        set({ isOpen: true });
    },
    close: () => {
        console.log('close called');
        set({ isOpen: false });
    }
});