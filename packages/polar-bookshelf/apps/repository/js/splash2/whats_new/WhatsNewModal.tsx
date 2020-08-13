import * as React from 'react';
import {WhatsNewContent} from './WhatsNewContent';
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

export const WhatsNewModal = React.memo(() => {

    const [open, setOpen] = React.useState(true);

    function handleClose() {
        setOpen(false)
    }

    return (

        <div>

            <Dialog
                fullWidth={true}
                maxWidth='lg'
                open={open}
                onClose={handleClose}>

                <DialogContent>
                    <WhatsNewContent/>
                </DialogContent>

                <DialogActions>

                    <Button color="primary"
                            variant="contained"
                            onClick={handleClose}>
                        Close
                    </Button>

                </DialogActions>

            </Dialog>

        </div>

    );

});
