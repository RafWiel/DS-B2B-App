import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { memo, useEffect } from "react";
import { useAppStore } from "../store";

export const AutoMessageDialog = memo(() => {
    const autoMessageDialog = useAppStore((state) => state.autoMessageDialog);
    const closeAutoMessageDialog = useAppStore((state) => state.closeAutoMessageDialog);
    
    useEffect(() => {
        if (!autoMessageDialog.isOpen) {
            return;
        }

        const timeout = setTimeout(() => {
            closeAutoMessageDialog();        
        }, autoMessageDialog.delay);                           

        return () => {
            clearTimeout(timeout);
        }

    }, [autoMessageDialog.isOpen, autoMessageDialog.delay, closeAutoMessageDialog]);

    return (
        <Dialog
            fullWidth
            maxWidth="xs"
            open={autoMessageDialog.isOpen ?? false}
            onClose={closeAutoMessageDialog}
            aria-labelledby="auto-message-dialog-title"
            aria-describedby="auto-message-dialog-description"
        >
            <DialogTitle id="auto-message-dialog-title">
                {autoMessageDialog.title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="auto-message-dialog-description">
                    {autoMessageDialog.text}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeAutoMessageDialog} autoFocus>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
});
