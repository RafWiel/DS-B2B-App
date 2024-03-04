import { StateCreator } from "zustand";

type AutoMessageDialog = {
    title: string;
    text: string;
    delay: number;
    isOpen?: boolean;
}

export type AutoMessageDialogSlice = {
    autoMessageDialog: AutoMessageDialog,
    openAutoMessageDialog: (value: AutoMessageDialog) => void;
    closeAutoMessageDialog: () => void;
}

export const createAutoMessageDialogSlice: StateCreator<AutoMessageDialogSlice, [], [], AutoMessageDialogSlice> = (set) => ({
    autoMessageDialog: {
        title: '',
        text: '',
        delay: 0,
        isOpen: false
    },
    openAutoMessageDialog: (value) => {        
        set({ 
            autoMessageDialog: {
                title: value.title,
                text: value.text,
                delay: value.delay,
                isOpen: true
            }
        });
    },
    closeAutoMessageDialog: () => {  
        set({ 
            autoMessageDialog: {
                title: '',
                text: '',
                delay: 0,
                isOpen: false
            }
        });
    }     
});