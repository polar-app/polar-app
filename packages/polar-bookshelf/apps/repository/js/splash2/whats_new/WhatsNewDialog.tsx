import * as React from 'react';
import {WhatsNewContent} from './WhatsNewContent';
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

export const WhatsNewDialog = React.memo(function WhatsNewDialog() {

    const [open, setOpen] = React.useState(true);

    function handleClose() {
        setOpen(false)
    }

    return (

        <Dialog maxWidth='lg'
                open={open}
                onClose={handleClose}>

            <DialogContent>
                <WhatsNewContent/>
            </DialogContent>

            <DialogActions>

                <Button color="primary"
                        variant="contained"
                        size="large"
                        onClick={handleClose}>
                    Close
                </Button>

            </DialogActions>

        </Dialog>

    );

});
