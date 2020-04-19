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
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        error: {
            backgroundColor: theme.palette.error.main,
            color: theme.palette.error.contrastText,
        },
        warning: {
            backgroundColor: theme.palette.warning.main,
            color: theme.palette.warning.contrastText,
        },
        success: {
            backgroundColor: theme.palette.success.main,
            color: theme.palette.success.contrastText,
        },
        info: {
            backgroundColor: theme.palette.info.main,
            color: theme.palette.info.contrastText,
        },
        root: {
        },
        subtitle: {
            fontSize: '1.25rem'
        }
    }),
);

export type AlertType = 'error' | 'warning' | 'success' | 'info';

interface IProps {
    readonly onCancel: Callback;
    readonly onAccept: Callback;
    readonly title: string;
    readonly subtitle: string | JSX.Element;
    readonly type?: AlertType;
    readonly autoFocus?: boolean;
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

    const type: AlertType = props.type || 'error';

    // tslint:disable-next-line:no-string-literal
    const palette = classes[type];

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

                <DialogTitle id="alert-dialog-title" className={palette}>
                    {props.title}
                </DialogTitle>

                <DialogContent>

                    <Box pt={1}>
                        <DialogContentText id="alert-dialog-description"
                                           className={classes.subtitle}>
                            {props.subtitle}
                        </DialogContentText>
                    </Box>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel}
                            size="large">
                        Cancel
                    </Button>

                        <Button className={palette}
                                onClick={handleAccept}
                                size="large"
                                variant="contained"
                                autoFocus={props.autoFocus}>
                            Accept
                        </Button>

                </DialogActions>
            </Dialog>
        </div>
    );
};

export const AlertDialogDemo = () => (
    <AlertDialog onAccept={() => console.log('accept')}
                 onCancel={() => console.log('cancel')}
                 title="You sure you want to do something dangerous?"
                 subtitle="This is a dangerous action and can't be undone bro."
                 type='success' />
);
