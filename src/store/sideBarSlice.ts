import { StateCreator } from "zustand";

export type SideBarSlice = {
    isOpenMobile: boolean;
    openMobile: () => void;  
    closeMobile: () => void;      
    isOpenDesktop: boolean;
    openDesktop: () => void;  
    closeDesktop: () => void;          
}

export const createSideBarSlice: StateCreator<SideBarSlice, [], [], SideBarSlice> = (set) => ({
    isOpenMobile: false,
    openMobile: () => {
        console.log('open mobile called');
        set({ isOpenMobile: true });
    },
    closeMobile: () => {
        console.log('close mobile called');
        set({ isOpenMobile: false });
    },
    isOpenDesktop: false,
    openDesktop: () => {
        console.log('open desktop called');
        set({ isOpenDesktop: true });
    },
    closeDesktop: () => {
        console.log('close desktop called');
        set({ isOpenDesktop: false });
    }
});