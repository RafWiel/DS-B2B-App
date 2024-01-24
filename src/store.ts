import { create } from 'zustand';
import { SideBarSlice, createSideBarSlice } from './store/sideBarSlice.ts';
import { AppBarTitleSlice, createAppBarTitleSlice } from './store/appBarTitleSlice.ts';
import { MessageDialogSlice, createMessageDialogSlice } from './store/messageDialogSlice.ts';
import { QuestionDialogSlice, createQuestionDialogSlice } from './store/questionDialogSlice.ts';

export const useAppStore = create<
    SideBarSlice & 
    AppBarTitleSlice &
    MessageDialogSlice &
    QuestionDialogSlice 
>((...a) => ({
    ...createSideBarSlice(...a),    
    ...createAppBarTitleSlice(...a),
    ...createMessageDialogSlice(...a),
    ...createQuestionDialogSlice(...a)
}));