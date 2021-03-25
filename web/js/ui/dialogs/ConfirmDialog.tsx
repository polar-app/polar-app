import React from 'react';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Box from "@material-ui/core/Box";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {Callback, NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {InputCompleteListener, InputCompletionType} from "../../mui/complete_listeners/InputCompleteListener";
import {WithDeactivatedKeyboardShortcuts} from "../../keyboard_shortcuts/WithDeactivatedKeyboardShortcuts";
import {MUIDialog} from "./MUIDialog";
import {deepMemo} from "../../react/ReactUtils";
import { ClassNameMap } from '@material-ui/styles';
import { DialogClassKey } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        primary: {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
        },
        danger: {
            backgroundColor: theme.palette.error.main,
            color: theme.palette.error.contrastText,
        },
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
        none: {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
        },
        cancelButton: {
            color: theme.palette.text.secondary,
        },
        root: {
        },
        subtitle: {
            fontSize: '1.25rem'
        }
    }),
);

export type AlertType = 'danger' | 'error' | 'warning' | 'success' | 'info' | 'none' | 'primary';

export interface ConfirmDialogProps {
    readonly title: string;
    readonly subtitle: string | JSX.Element;
    readonly onCancel?: Callback;
    readonly onAccept: Callback;
    readonly type?: AlertType;
    readonly autoFocus?: boolean;
    readonly classes?: Partial<ClassNameMap<DialogClassKey>>;

    /**
     * The text to use for the cancel button.
     */
    readonly cancelText?: string;

    /**
     * The text to use for the accept button.
     */
    readonly acceptText?: string;

    /**
     * When true, do not show the cancel button.
     */
    readonly noCancel?: boolean

    /**
     * When true, do not show the accept button.
     */
    readonly noAccept?: boolean

    // TOD: we need noCancel

    readonly maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;

    readonly inputCompletionType?: InputCompletionType;

}

export const ConfirmDialog = deepMemo(function ConfirmDialog(props: ConfirmDialogProps) {

    const [open, setOpen] = React.useState(true);

    const classes = useStyles();

    const onCancel = props.onCancel || NULL_FUNCTION;

    const handleClose = React.useCallback((event: any, reason: 'backdropClick' | 'escapeKeyDown' | undefined) => {

        if (reason !== undefined) {
            onCancel();
        }

        setOpen(false);
    }, [onCancel]);

    const handleCancel = React.useCallback(() => {
        setOpen(false);
        onCancel();
    }, [onCancel]);

    const handleAccept = React.useCallback(() => {
        setOpen(false);
        props.onAccept();
    }, [props]);

    // FIXME: I don't think error should be the default here.
    const type: AlertType = props.type || 'error';

    // tslint:disable-next-line:no-string-literal
    const palette = classes[type];

    return (
        <MUIDialog
            maxWidth={props.maxWidth}
            open={open}
            onClose={handleClose}
            classes={props.classes}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">

            <WithDeactivatedKeyboardShortcuts>
                <InputCompleteListener type={props.inputCompletionType || 'enter'}
                                       noHint={true}
                                       onComplete={handleAccept}
                                       onCancel={handleCancel}>
                    <>
                        <DialogTitle id="alert-dialog-title" className={palette}>
                            {props.title}
                        </DialogTitle>

                        <DialogContent className="alert-dialog-content-outer">

                            {typeof props.subtitle === 'string' && (
                                <Box pt={1}>
                                    <DialogContentText id="alert-dialog-description"
                                                       className={`${classes.subtitle} alert-dialog-content-inner`}>
                                        {props.subtitle}
                                    </DialogContentText>
                                </Box>
                            )}

                            {typeof props.subtitle !== 'string' && (
                                <DialogContent id="alert-dialog-description"
                                               className={`${classes.subtitle} alert-dialog-content-inner`}>
                                    {props.subtitle}
                                </DialogContent>
                            )}

                        </DialogContent>
                        <DialogActions>

                            {! props.noCancel &&
                                <Button className={classes.cancelButton}
                                        onClick={handleCancel}
                                        size="large">
                                    {props.cancelText || 'Cancel'}
                                </Button>}

                            {! props.noAccept &&
                                <Button className={palette}
                                        onClick={handleAccept}
                                        size="large"
                                        variant="contained"
                                        autoFocus={props.autoFocus}>
                                    {props.acceptText || 'Accept'}
                                </Button>}

                        </DialogActions>
                    </>
                </InputCompleteListener>
            </WithDeactivatedKeyboardShortcuts>

        </MUIDialog>
    );
});
