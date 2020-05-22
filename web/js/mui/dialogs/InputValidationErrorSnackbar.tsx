import {useState} from "react";
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import React from "react";

interface IProps {
    readonly message: string;
}

export const InputValidationErrorSnackbar = (props: IProps) => {

    const [open, setOpen] = useState(true);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
            <Alert severity="error" onClose={handleClose}>
                {props.message}
            </Alert>
        </Snackbar>
    )

};

