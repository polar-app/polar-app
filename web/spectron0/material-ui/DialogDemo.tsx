import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import MUICreatableAutocomplete from "../../js/mui/autocomplete/MUICreatableAutocomplete";

export default function DialogDemo() {

    const [open, setOpen] = React.useState(true);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title"
                open={open}>
            <DialogContent>
                {/*<MUICreatableAutocomplete/>*/}
            </DialogContent>
            {/*<DialogActions>*/}
            {/*    <Button autoFocus onClick={handleClose} color="primary">*/}
            {/*        Save changes*/}
            {/*    </Button>*/}
            {/*</DialogActions>*/}
        </Dialog>
    );
}
