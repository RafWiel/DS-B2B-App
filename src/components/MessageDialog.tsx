import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { memo } from "react";
import { useAppStore } from "../store";

const MessageDialog = memo(() => {
    const messageDialog = useAppStore((state) => state.messageDialog);
    const closeMessageDialog = useAppStore((state) => state.closeMessageDialog);

    return (
        <Dialog
            fullWidth
            maxWidth="xs"
            open={messageDialog.isOpen ?? false}
            onClose={closeMessageDialog}
            aria-labelledby="message-dialog-title"
            aria-describedby="message-dialog-description"
        >
            <DialogTitle id="message-dialog-title">
                {messageDialog.title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="message-dialog-description">
                    {messageDialog.text}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeMessageDialog} autoFocus>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
});

export default MessageDialog;