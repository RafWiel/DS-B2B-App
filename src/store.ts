import { create } from 'zustand';
import { SideBarSlice, createSideBarSlice } from './store/sideBarSlice.ts';
import { AppBarTitleSlice, createAppBarTitleSlice } from './store/appBarTitleSlice.ts';
import { AutoMessageDialogSlice, createAutoMessageDialogSlice } from './store/autoMessageDialogSlice.ts';
import { MessageDialogSlice, createMessageDialogSlice } from './store/messageDialogSlice.ts';
import { QuestionDialogSlice, createQuestionDialogSlice } from './store/questionDialogSlice.ts';
import { LoadingIconSlice, createLoadingIconSlice } from './store/loadingIconSlice.ts';

export const useAppStore = create<
    SideBarSlice & 
    AppBarTitleSlice &
    AutoMessageDialogSlice &
    MessageDialogSlice &
    QuestionDialogSlice &
    LoadingIconSlice
>((...a) => ({
    ...createSideBarSlice(...a),    
    ...createAppBarTitleSlice(...a),
    ...createAutoMessageDialogSlice(...a),
    ...createMessageDialogSlice(...a),
    ...createQuestionDialogSlice(...a),
    ...createLoadingIconSlice(...a)
}));