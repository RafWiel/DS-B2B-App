import { StateCreator } from "zustand";

type MessageDialog = {
    title: string;
    text: string;
    isOpen?: boolean;
}

export type MessageDialogSlice = {
    messageDialog: MessageDialog,
    openMessageDialog: (value: MessageDialog) => void;
    closeMessageDialog: () => void;
}

export const createMessageDialogSlice: StateCreator<MessageDialogSlice, [], [], MessageDialogSlice> = (set) => ({
    messageDialog: {
        title: '',
        text: '',
        isOpen: false
    },
    openMessageDialog: (value) => {        
        set({ 
            messageDialog: {
                title: value.title,
                text: value.text,
                isOpen: true
            }
        });
    },
    closeMessageDialog: () => {  
        set({ 
            messageDialog: {
                title: '',
                text: '',
                isOpen: false
            }
        });
    }     
});