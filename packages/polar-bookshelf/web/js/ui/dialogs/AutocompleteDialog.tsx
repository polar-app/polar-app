import React from 'react';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import MUICreatableAutocomplete, {MUICreatableAutocompleteProps} from "../../mui/autocomplete/MUICreatableAutocomplete";
import DialogTitle from "@material-ui/core/DialogTitle";
import Box from "@material-ui/core/Box";
import DialogContentText from "@material-ui/core/DialogContentText";
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import {InputCompleteListener} from "../../mui/complete_listeners/InputCompleteListener";
import {WithDeactivatedKeyboardShortcuts} from "../../keyboard_shortcuts/WithDeactivatedKeyboardShortcuts";
import {MUIDialog} from "./MUIDialog";
import {useHistory, useLocation} from 'react-router-dom';

const useStyles = makeStyles((theme) =>
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
export interface AutocompleteDialogPropsWithID<T> extends AutocompleteDialogProps<T>{
    readonly id: string;
}

interface IState {
    readonly open: boolean;
    readonly validationError?: string;
}

export function AutocompleteDialog<T>(props: AutocompleteDialogPropsWithID<T>) {

    const classes = useStyles();
    const location = useLocation();
    const history = useHistory();

    const [state, setState] = React.useState<IState>({
        open: true
    });

    React.useEffect(() => {
        history.push({hash: `#autocomplete-${props.id}`});
    }, [history, props.id])

    React.useEffect(() => {

        const open = location.hash === `#autocomplete-${props.id}`;
        setState({open});

    }, [history, location, props.id, state.open]);

    const activeRef = React.useRef(false);

    const closeDialog =  React.useCallback(() => {
        // this happens on Escape and clickaway...
        history.replace({hash: ''});

        setState({open: false});
    },[history]);

    const handleCancel = () => {
        props.onCancel();
        closeDialog();
    };

    let selectedOptions: ReadonlyArray<T>
        = props.defaultOptions ? props.defaultOptions.map(current => current.value) : [];

    const handleComplete = () => {
        closeDialog();
        props.onDone(selectedOptions);
    };

    const handleChange = (newOptions: ReadonlyArray<T>) => {
        selectedOptions = newOptions;
    };

    // useInputCompleteWindowListener({onComplete: handleComplete, onCancel: handleCancel});

    function handleOpen(open: boolean) {
        setTimeout(() => activeRef.current = open, 1);
    }

    return (

        <MUIDialog open={state.open}
                   onClose={handleCancel}
                   maxWidth="md"
                   fullWidth={true}
                   aria-labelledby="form-dialog-title">

            <WithDeactivatedKeyboardShortcuts>
                <InputCompleteListener type='enter'
                                       noHint={true}
                                       onComplete={handleComplete}
                                       onCancel={handleCancel}
                                       completable={() => ! activeRef.current}>
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
                                                      onOpen={handleOpen}
                                                      autoFocus={true}
                                                      onChange={handleChange}/>

                        </DialogContent>

                        <DialogActions>
                            <Button onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button onClick={handleComplete}
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
};
