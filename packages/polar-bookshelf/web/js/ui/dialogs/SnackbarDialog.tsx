import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import {CloseIcon} from "../icons/FixedWidthIcons";
import {deepMemo} from "../../react/ReactUtils";
import { useHistory, useLocation } from "react-router-dom";

export interface SnackbarDialogProps {
    readonly type?: 'info' | 'success' | 'warning' | 'error';
    readonly message: string;
    readonly autoHideDuration?: number;

    /**
     * Use a custom action like an 'open' button
     */
    readonly action?: React.ReactNode;

}
export interface SnackbarDialogPropsWithID extends SnackbarDialogProps {
    readonly id: string;
}

export const SnackbarDialog = deepMemo(function SnackbarDialog(props: SnackbarDialogPropsWithID) {
    const [open, setOpen] = React.useState(true);

    const location = useLocation();
    const history = useHistory();

    React.useEffect(() => {
        history.push({hash: `#prompt-${props.id}`});
    }, [history, props.id])

    React.useEffect(() => {

        setOpen(location.hash === `#prompt-${props.id}`);

    }, [history, location, props.id, open]);
    
    const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {

        if (reason === 'clickaway') {
            return;
        }
        
        // this happens on Escape and clickaway...
        history.replace({hash: ''});

        setOpen(false);
    };

    const Action = () => (
        <IconButton size="small" aria-label="close" color="inherit"
                    onClick={handleClose}>
            <CloseIcon/>
        </IconButton>
    );

    const action = props.action || <Action/>

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
            action={action}/>
    );

});
