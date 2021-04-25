import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {InputValidator} from "../../ui/dialogs/InputValidators";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {InputValidationErrorSnackbar} from "./InputValidationErrorSnackbar";
import {InputCompleteListener} from "../complete_listeners/InputCompleteListener";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        cancelButton: {
            color: theme.palette.text.secondary,
        },
        textField: {
            minWidth: '350px'
        },
        description: {
            fontSize: '1.25rem'
        }
    }),
);

interface IProps {
    title: string;
    label: string;
    description?: string;
    defaultValue?: string;
    placeholder?: string;
    autoFocus?: boolean;
    inputValidator?: InputValidator;
    type?: 'email' | 'number' | 'search' | 'password'
    onCancel: () => void;
    onDone: (value: string) => void;
}

interface IState {
    readonly open: boolean;
    readonly validationError?: string;
}

export const PromptDialog = (props: IProps) => {

    const classes = useStyles();

    let value: string = props.defaultValue || "";

    const [state, setState] = React.useState<IState>({
        open: true
    });

    const closeDialog = () => {
        setState({open: false});
    };

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

    return (

        <Dialog open={state.open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title">

            <InputCompleteListener onComplete={handleDone} type='enter' noHint={true}>
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
                                   autoFocus={props.autoFocus}
                                   onChange={event => handleInput(event.currentTarget.value)}
                                   margin="dense"
                                   id="name"
                                   defaultValue={props.defaultValue}
                                   placeholder={props.placeholder}
                                   label={props.label}
                                   type={props.type}
                                   // fullWidth
                                    />

                    </DialogContent>

                    <DialogActions>
                        <Button onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button onClick={handleDone}
                                size="large"
                                variant="contained"
                                color="primary">
                            Subscribe
                        </Button>
                    </DialogActions>
                </>
            </InputCompleteListener>

        </Dialog>
    );
};

export const PromptDialogDemo = () => {

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    return <>
        <Button variant="outlined" color="primary" onClick={handleClickOpen}>
            Open prompt dialog
        </Button>

        {open && <PromptDialog title="Enter a title"
                               placeholder="Enter a title for this document: "
                               // defaultValue="Fahrenheit 451"
                               label="Title"
                               autoFocus
                               // inputValidator={() => ({
                               //     message: 'bad input bro'
                               // })}
                               onCancel={() => console.log('cancel')}
                               onDone={(value) => console.log('done: ', value)}/>}
    </>;

};

