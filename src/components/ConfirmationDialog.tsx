import * as React from "react";
import {Dialog, DialogTitle, DialogActions, DialogContent, Button} from "@material-ui/core";

export interface ConfirmationDialogRawProps {
    id: string;
    keepMounted: boolean;
    open: boolean;
    title: any;
    content: any;
    onClose: () => void;
    onConfirm: () => void;
}

export default function ConfirmationDialog(props: ConfirmationDialogRawProps) {
    const { onClose, onConfirm, open, title, content, ...other } = props;
    const radioGroupRef = React.useRef<HTMLElement>(null);

    const handleEntering = () => {
        if (radioGroupRef.current != null) {
            radioGroupRef.current.focus();
        }
    };

    const handleCancel = () => {
        onClose();
    };

    const handleOk = () => {
        onConfirm();
    };

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
            maxWidth="xs"
            TransitionProps={{ onEntering: handleEntering }}
            open={open}
            {...other}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                {content}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel}>
                    Cancel
                </Button>
                <Button onClick={handleOk}>Ok</Button>
            </DialogActions>
        </Dialog>
    );
}