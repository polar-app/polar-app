import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import {CloseIcon} from "../icons/FixedWidthIcons";

export interface SnackbarDialogProps {
    readonly type?: 'info' | 'success' | 'warning' | 'error';
    readonly message: string;
    readonly autoHideDuration?: number;
}

export const SnackbarDialog = (props: SnackbarDialogProps) => {
    const [open, setOpen] = React.useState(true);

    const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const Action = () => (
        <IconButton size="small" aria-label="close" color="inherit"
                    onClick={handleClose}>
            <CloseIcon/>
        </IconButton>
    );

    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            open={open}
            autoHideDuration={props.autoHideDuration || 5000}
            onClose={handleClose}
            message={props.message}
            action={<Action/>}/>
    );

};
