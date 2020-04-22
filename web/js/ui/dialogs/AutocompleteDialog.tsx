import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {InputValidator} from "./InputValidators";
import {InputCompleteListener} from "../../../spectron0/material-ui/complete_listeners/InputCompleteListener";
import {InputValidationErrorSnackbar} from "../../../spectron0/material-ui/dialogs/InputValidationErrorSnackbar";
import MUICreatableAutocomplete, {MUICreatableAutocompleteProps} from "../../../spectron0/material-ui/autocomplete/MUICreatableAutocomplete";
import {AutocompleteBody} from "./AutocompleteBody";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        cancelButton: {
            color: theme.palette.text.secondary,
        },
        textField: {
            minWidth: '350px',
            width: '450px',
            maxWidth: '100vh',
        },
        description: {
            fontSize: '1.25rem'
        }
    }),
);

export interface AutocompleteDialog<T> extends MUICreatableAutocompleteProps<T> {
    readonly onCancel: () => void;
    readonly onDone: (values: ReadonlyArray<T>) => void;

}

interface IState {
    readonly open: boolean;
    readonly validationError?: string;
}

export function AutocompleteDialog<T>(props: AutocompleteDialog<T>) {

    const classes = useStyles();

    // let value: string = props.defaultValue || "";

    const [state, setState] = React.useState<IState>({
        open: true
    });

    const closeDialog = () => {
        setState({open: false});
    };
    //
    const handleClose = () => {
        props.onCancel();
        closeDialog();
    };
    //
    const handleCancel = () => {
        props.onCancel();
        closeDialog();
    };

    let selectedOptions: ReadonlyArray<T>
        = props.defaultOptions ? props.defaultOptions.map(current => current.value) : [];

    const handleDone = () => {
        closeDialog();
        props.onDone(selectedOptions);
    };

    const handleChange = (newOptions: ReadonlyArray<T>) => {
        selectedOptions = newOptions;
    };

    return (

        <Dialog open={state.open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title">

            <InputCompleteListener onComplete={handleDone}>
                <>
                    <DialogContent>

                        <MUICreatableAutocomplete {...props}
                                                  onChange={handleChange}/>

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

        </Dialog>
    );
};
