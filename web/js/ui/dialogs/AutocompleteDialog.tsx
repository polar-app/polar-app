import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {InputCompleteListener} from "../../mui/complete_listeners/InputCompleteListener";
import MUICreatableAutocomplete, {MUICreatableAutocompleteProps} from "../../../spectron0/material-ui/autocomplete/MUICreatableAutocomplete";
import DialogTitle from "@material-ui/core/DialogTitle";
import Box from "@material-ui/core/Box";
import DialogContentText from "@material-ui/core/DialogContentText";

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

export interface AutocompleteDialogProps<T> extends MUICreatableAutocompleteProps<T> {
    readonly title?: string;
    readonly description?: string | JSX.Element;
    readonly onCancel: () => void;
    readonly onDone: (values: ReadonlyArray<T>) => void;

}

interface IState {
    readonly open: boolean;
    readonly validationError?: string;
}

export function AutocompleteDialog<T>(props: AutocompleteDialogProps<T>) {

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

                    {props.title &&
                        <DialogTitle>{props.title}</DialogTitle>}

                    <DialogContent>

                        {props.description &&
                            <Box pt={1}>
                                <DialogContentText className={classes.description}>
                                    {props.description}
                                </DialogContentText>
                            </Box>}

                        <MUICreatableAutocomplete {...props}
                                                  autoFocus={true}
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
