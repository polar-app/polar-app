import * as React from 'react';
import {CloudSyncConfiguredContent} from './CloudSyncConfiguredContent';
import Dialog from "@material-ui/core/Dialog";
import DialogContent from '@material-ui/core/DialogContent';
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";

export const CloudSyncConfiguredDialog = () => {

    const [open, setOpen] = React.useState(true);

    return (
        <Dialog fullWidth maxWidth="md" open={open}>
            <DialogContent>
                <CloudSyncConfiguredContent/>
            </DialogContent>
            <DialogActions>

                <Button color="primary"
                        variant="contained"
                        size="large"
                        onClick={() => setOpen(false)}>
                    OK
                </Button>

            </DialogActions>
        </Dialog>

    );
};
