import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {InputValidator} from "./InputValidators";
import {InputCompleteListener} from "../../mui/complete_listeners/InputCompleteListener";
import {InputValidationErrorSnackbar} from "../../mui/dialogs/InputValidationErrorSnackbar";
import {WithDeactivatedKeyboardShortcuts} from "../../keyboard_shortcuts/WithDeactivatedKeyboardShortcuts";
import {MUIDialog} from './MUIDialog';
import {deepMemo} from "../../react/ReactUtils";
import {useHistory, useLocation} from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        cancelButton: {
            color: theme.palette.text.secondary,
        },
        textField: {
            maxWidth: '100vh',
        },
        description: {
            fontSize: '1.25rem'
        }
    }),
);

export interface PromptDialogProps {
    readonly title: string;
    readonly label?: string;
    readonly description?: string;
    readonly defaultValue?: string;
    readonly placeholder?: string;
    readonly autoFocus?: boolean;
    readonly autoHighlight?: boolean;
    readonly inputValidator?: InputValidator;
    readonly type?: 'email' | 'number' | 'search' | 'password'
    readonly onCancel: () => void;
    readonly onDone: (value: string) => void;
    readonly autoComplete?: string;
}

export interface PromptDialogPropsWithID extends PromptDialogProps {
    readonly id: string;
}

interface IState {
    readonly open: boolean;
    readonly validationError?: string;
}

export const PromptDialog = deepMemo(function PromptDialog(props: PromptDialogPropsWithID) {

    const classes = useStyles();

    let value: string = props.defaultValue || "";

    const autoFocus = props.autoFocus || true;

    const location = useLocation();
    const history = useHistory();

    const [state, setState] = React.useState<IState>({
        open: false
    });

    React.useEffect(() => {
        history.push({hash: `#prompt-${props.id}`});
    }, [history, props.id])

    React.useEffect(() => {

        const open = location.hash === `#prompt-${props.id}`;
        setState({open});

    }, [history, location, props.id, state.open]);

    const closeDialog = React.useCallback(() => {
        // this happens on Escape and clickaway...
        history.replace({hash: ''});
    }, [history]);

    // FIXME: make these all useCallback
    const handleClose = () => {
        props.onCancel();
        closeDialog();
    };

    const handleCancel = () => {
        props.onCancel();
        closeDialog();
    };

    const handleDone = () => {

        if (props.inputValidator) {

            const validationError = props.inputValidator(value);

            if (validationError) {

                setState({
                    ...state,
                    validationError: validationError.message
                });

                return;
            }

        }

        props.onDone(value);
        closeDialog();
    };

    const handleInput = (text: string) => {

        if (state.validationError) {
            setState({
                ...state,
                validationError: undefined
            })
        }

        value = text;
    };

    const inputRefCallback = React.useCallback((elem: HTMLInputElement | null) => {
        if (elem && props.autoHighlight) {
            elem.select();
        }
    }, [props.autoHighlight]);

    return (

        <MUIDialog open={state.open}
                   onClose={handleClose}
                   maxWidth="xs"
                   fullWidth={true}
                   aria-labelledby="form-dialog-title">

            <WithDeactivatedKeyboardShortcuts>
                <InputCompleteListener type='enter' noHint={true} onComplete={handleDone}>
                    <>
                        <DialogTitle id="form-dialog-title">{props.title}</DialogTitle>
                        <DialogContent>

                            {state.validationError &&
                                <InputValidationErrorSnackbar message={state.validationError}/>}

                            {props.description &&
                            <DialogContentText className={classes.description}>
                                {props.description}
                            </DialogContentText>}

                            <TextField className={classes.textField}
                                       autoFocus={autoFocus}
                                       onChange={event => handleInput(event.currentTarget.value)}
                                       margin="dense"
                                       id="name"
                                       inputRef={inputRefCallback}
                                       autoComplete={props.autoComplete}
                                       defaultValue={props.defaultValue}
                                       placeholder={props.placeholder}
                                       label={props.label}
                                       type={props.type}
                                       fullWidth/>

                        </DialogContent>

                        <DialogActions>
                            <Button onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button onClick={handleDone}
                                    size="large"
                                    variant="contained"
                                    color="primary">
                                Done
                            </Button>
                        </DialogActions>
                    </>
                </InputCompleteListener>
            </WithDeactivatedKeyboardShortcuts>

        </MUIDialog>
    );
});
