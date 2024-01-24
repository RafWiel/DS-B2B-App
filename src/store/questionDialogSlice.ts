/* eslint-disable @typescript-eslint/no-explicit-any */
import { StateCreator } from "zustand";

type QuestionDialog = {
    title: string;
    text: string;
    isOpen?: boolean;    
    action?: (param?: any) => void;
    actionParameters?: any;
}

export type QuestionDialogSlice = {
    questionDialog: QuestionDialog,
    openQuestionDialog: (value: QuestionDialog) => void;
    applyQuestionDialog: () => void;
    cancelQuestionDialog: () => void;
}

export const createQuestionDialogSlice: StateCreator<QuestionDialogSlice, [], [], QuestionDialogSlice> = (set, get) => ({
    questionDialog: {
        title: '',
        text: '',
        isOpen: false,
        action: () => {}
    },
    openQuestionDialog: (value) => {        
        set({ 
            questionDialog: {
                title: value.title,
                text: value.text,                
                action: value.action,
                actionParameters: value.actionParameters,
                isOpen: true        
            }
        });
    },
    applyQuestionDialog: () => {          
        const parameters = get().questionDialog.actionParameters;

        if (!parameters) {
            get().questionDialog.action?.();
        }
        else if (Array.isArray(parameters)) {
            get().questionDialog.action?.(...parameters);
        }
        else {
            get().questionDialog.action?.(parameters);
        }

        set({ 
            questionDialog: {
                title: '',
                text: '',
                isOpen: false,
            }
        });
    },
    cancelQuestionDialog: () => {  
        set({ 
            questionDialog: {
                title: '',
                text: '',
                isOpen: false,
            }
        });
    }     
});