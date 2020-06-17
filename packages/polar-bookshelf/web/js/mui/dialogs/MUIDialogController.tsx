import {Callback1} from "polar-shared/src/util/Functions";
import React, {useState} from "react";
import isEqual from "react-fast-compare";
import {
    ConfirmDialog,
    ConfirmDialogProps
} from "../../ui/dialogs/ConfirmDialog";
import {
    PromptDialog,
    PromptDialogProps
} from "../../ui/dialogs/PromptDialog";
import {
    AutocompleteDialog,
    AutocompleteDialogProps
} from "../../ui/dialogs/AutocompleteDialog";
import {
    SnackbarDialog,
    SnackbarDialogProps
} from "../../ui/dialogs/SnackbarDialog";

export interface DialogManager {
    confirm: (props: ConfirmDialogProps) => void;
    prompt: (promptDialogProps: PromptDialogProps) => void;
    autocomplete: (autocompleteProps: AutocompleteDialogProps<any>) => void;
    snackbar: (snackbarDialogProps: SnackbarDialogProps) => void;
    dialog: (dialogProps: IDialogProps) => void;
}

function nullDialog() {
    console.warn("WARNING using null dialog manager");
}

export const NullDialogManager: DialogManager = {
    confirm: nullDialog,
    prompt: nullDialog,
    autocomplete: nullDialog,
    snackbar: nullDialog,
    dialog: nullDialog,
}

interface DialogHostProps {
    readonly onDialogManager: Callback1<DialogManager>;
}

/**
 * Inject a raw dialog
 */
interface IDialogProps {
    readonly dialog: JSX.Element;
}

type DialogType = 'confirm' | 'prompt' | 'autocomplete' | 'snackbar' | 'dialog';

interface DialogState {
    readonly type: DialogType;
    readonly props: ConfirmDialogProps | PromptDialogProps | AutocompleteDialogProps<any> | SnackbarDialogProps | IDialogProps;
    readonly iter: number;
}

/**
 * Hosts the actual dialogs so that we don't ever re-render sub-components.
 */
const DialogHost = React.memo((props: DialogHostProps) => {

    const [state, setState] = useState<DialogState | undefined>(() => {

        let iter = 0;

        const confirm = (confirmDialogProps: ConfirmDialogProps) => {
            setState({
                type: 'confirm',
                props: confirmDialogProps,
                iter: iter++
            });
        };

        const prompt = (promptDialogProps: PromptDialogProps) => {
            setState({
                type: 'prompt',
                props: promptDialogProps,
                iter: iter++
            });
        };

        const autocomplete = function<T>(autocompleteProps: AutocompleteDialogProps<T>) {
            setState({
                type: 'autocomplete',
                props: autocompleteProps,
                iter: iter++
            });
        };

        const snackbar = function(snackbarProps: SnackbarDialogProps) {
            setState({
                type: 'snackbar',
                props: snackbarProps,
                iter: iter++
            });
        };

        const dialog = function(dialogProps: IDialogProps) {
            setState({
                type: 'dialog',
                props: dialogProps,
                iter: iter++
            });
        };

        const dialogManager: DialogManager = {
            confirm,
            prompt,
            autocomplete,
            snackbar,
            dialog
        };

        // WARN: not sure if this is the appropriate way to do this but we need
        // to have this run after the component renders and this way it can
        // continue
        setTimeout(() => props.onDialogManager(dialogManager), 1);

        return undefined;

    });

    if (state === undefined) {
        return null;
    }

    switch (state.type) {

        case "confirm":
            return (
                <ConfirmDialog key={state.iter}
                               {...(state.props as ConfirmDialogProps)}/>
            );

        case "prompt":
            return (
                <PromptDialog key={state.iter}
                              {...(state.props as PromptDialogProps)}/>
            );

        case "autocomplete":
            return (
                <AutocompleteDialog key={state.iter}
                                    {...(state.props as AutocompleteDialogProps<any>)}/>
            );

        case "snackbar":
            return (
                <SnackbarDialog {...(state.props as SnackbarDialogProps)}/>
            );

        case "dialog":

            const dialogProps = state.props as IDialogProps;

            return (
                dialogProps.dialog
            );

    }

    return null;

}, isEqual);

interface IProps {
    readonly children: React.ReactNode;
}

export const MUIDialogControllerContext = React.createContext<DialogManager>(NullDialogManager);

/**
 * Component to allow us to inject new components like snackbars, dialog boxes,
 * modals, etc but still use the react tree.
 */
export const MUIDialogController = React.memo((props: IProps) => {

    // FIXME this should be the ROOT of the app so that we replace it with a
    // REAL dialog manager before anything else starts.
    const [dialogManager, setDialogManager] = useState<DialogManager>(NullDialogManager);

    return (
        <>

            <DialogHost onDialogManager={dialogManger => setDialogManager(dialogManger)}/>

            <MUIDialogControllerContext.Provider value={dialogManager}>
                {props.children}
            </MUIDialogControllerContext.Provider>

        </>
    );

}, isEqual);
