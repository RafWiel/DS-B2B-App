import { StateCreator } from "zustand";

export type SideBarSlice = {
    isOpenMobile: boolean;
    isOpenDesktop: boolean;
    openMobile: () => void;      
    openDesktop: () => void;  
    close: () => void;          
}

export const createSideBarSlice: StateCreator<SideBarSlice, [], [], SideBarSlice> = (set) => ({
    isOpenMobile: false,
    isOpenDesktop: false,
    openMobile: () => {
        console.log('open mobile called');
        set({ isOpenMobile: true });
    },
    openDesktop: () => {
        console.log('open desktop called');
        set({ isOpenDesktop: true });
    },
    close: () => {
        console.log('close called');
        set({ 
            isOpenMobile: false,
            isOpenDesktop: false, 
        });
    },        
});