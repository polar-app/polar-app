import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Box from "@material-ui/core/Box";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {Callback} from "polar-shared/src/util/Functions";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        button: {
            backgroundColor: theme.palette.error.main,
            color: theme.palette.text.primary,
        },
    }),
);

interface IProps {
    readonly onCancel: Callback;
    readonly onAccept: Callback;
}

export const AlertDialog = (props: IProps) => {

    const [open, setOpen] = React.useState(false);

    const classes = useStyles();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (event: {}, reason: 'backdropClick' | 'escapeKeyDown' | undefined) => {

        if (reason !== undefined) {
            props.onCancel();
        }

        setOpen(false);
    };

    const handleCancel = () => {
        props.onCancel();
        setOpen(false);
    };

    const handleAccept = () => {
        props.onAccept();
        setOpen(false);
    };

    return (
        <div>
            <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                Open alert dialog
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">

                <Box bgcolor="error.main"
                     color="text.primary">
                    <DialogTitle id="alert-dialog-title">
                            {"Use Google's location service?"}
                    </DialogTitle>
                </Box>

                <DialogContent>

                    <Box pt={1}>
                        <DialogContentText id="alert-dialog-description">

                            Let Google help apps determine location. This means
                            sending anonymous location data to Google, even when
                            no apps are running.
                        </DialogContentText>
                    </Box>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel}>
                        Cancel
                    </Button>

                        <Button className={classes.button}
                                onClick={handleAccept}
                                variant="contained" autoFocus>
                            Accept
                        </Button>

                </DialogActions>
            </Dialog>
        </div>
    );
}

export const AlertDialogDemo = () => (
    <AlertDialog onAccept={() => console.log('accept')}
                 onCancel={() => console.log('cancel')}/>
);
