import { create } from 'zustand';
import { SideBarSlice, createSideBarSlice } from './store/sideBarSlice.ts';
import { AppBarTitleSlice, createAppBarTitleSlice } from './store/appBarTitleSlice.ts';

export const useAppStore = create< SideBarSlice & AppBarTitleSlice >((...a) => ({
    ...createSideBarSlice(...a),    
    ...createAppBarTitleSlice(...a)    
}));