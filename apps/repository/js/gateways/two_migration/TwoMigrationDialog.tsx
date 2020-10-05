import * as React from 'react';
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { TwoMigrationContent } from './TwoMigrationContent';

interface IProps {
    readonly onClose: () => void;
}

export const TwoMigrationDialog = React.memo((props: IProps) => {

    const [open, setOpen] = React.useState(true);

    function handleClose() {
        setOpen(false);
        props.onClose();
    }

    return (

        <Dialog maxWidth='md'
                open={open}
                onClose={handleClose}>

            <DialogContent>
                <TwoMigrationContent/>
            </DialogContent>

            <DialogActions style={{justifyContent: 'center'}}>

                <Button color="primary"
                        variant="contained"
                        size="large"
                        onClick={handleClose}>
                    Let's Get Started
                </Button>

            </DialogActions>

        </Dialog>

    );

});
