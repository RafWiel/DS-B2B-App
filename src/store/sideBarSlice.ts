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
    isOpenDesktop: JSON.parse(localStorage.getItem('isSideBarOpenDesktop') ?? 'true'),
    openMobile: () => {        
        set({ isOpenMobile: true });
    },
    openDesktop: () => {        
        set({ isOpenDesktop: true });
        localStorage.setItem('isSideBarOpenDesktop', JSON.stringify(true));
    },
    close: () => {        
        set({ 
            isOpenMobile: false,
            isOpenDesktop: false, 
        });
        localStorage.setItem('isSideBarOpenDesktop', JSON.stringify(false));
    }     
});