import { create } from 'zustand';
import { SideBarSlice, createSideBarSlice } from './store/sideBarSlice.ts';

export const useAppStore = create<SideBarSlice>((...a) => ({
    ...createSideBarSlice(...a)    
}));