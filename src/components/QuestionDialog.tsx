import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { memo } from "react";
import { useAppStore } from "../store";

const QuestionDialog = memo(() => {
    const questionDialog = useAppStore((state) => state.questionDialog);
    const applyQuestionDialog = useAppStore((state) => state.applyQuestionDialog);    
    const cancelQuestionDialog = useAppStore((state) => state.cancelQuestionDialog);

    return (
        <Dialog
            open={questionDialog.isOpen ?? false}
            onClose={cancelQuestionDialog}
            aria-labelledby="question-dialog-title"
            aria-describedby="question-dialog-description"
        >
            <DialogTitle id="question-dialog-title">
                {questionDialog.title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="question-dialog-description">
                    {questionDialog.text}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={applyQuestionDialog}>
                    Tak
                </Button>
                <Button onClick={cancelQuestionDialog} autoFocus>
                    Nie
                </Button>
            </DialogActions>
        </Dialog>
    );
});

export default QuestionDialog;