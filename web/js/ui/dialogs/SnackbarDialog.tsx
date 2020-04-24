import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

interface SnackbarDialogProps {
    readonly type?: 'info' | 'success' | 'warning' | 'error';
    readonly autoHideDuration?: number;
}

export const SnackbarDialog = (props: SnackbarDialogProps) => {

    return (
        <Snackbar open={true}
                  autoHideDuration={props.autoHideDuration || 5000}>
            <Alert severity="success">
                This is a success message!
            </Alert>
        </Snackbar>
    );

};
