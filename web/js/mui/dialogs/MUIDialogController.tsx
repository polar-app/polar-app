import {Callback1, NULL_FUNCTION} from "polar-shared/src/util/Functions";
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
import {
    TaskbarDialog,
    TaskbarDialogProps, TaskbarDialogPropsWithCallback,
    TaskbarProgressCallback
} from "../../ui/dialogs/TaskbarDialog";
import {Latch} from "polar-shared/src/util/Latch";
import {SelectDialog, SelectDialogProps} from "../../ui/dialogs/SelectDialog";

export interface DialogManager {
    confirm: (props: ConfirmDialogProps) => void;
    prompt: (promptDialogProps: PromptDialogProps) => void;
    autocomplete: (autocompleteProps: AutocompleteDialogProps<any>) => void;
    snackbar: (snackbarDialogProps: SnackbarDialogProps) => void;
    taskbar: (taskbarDialogProps: TaskbarDialogProps) => Promise<TaskbarProgressCallback>;
    dialog: (dialogProps: IDialogProps) => void;
    select: <V>(selectProps: SelectDialogProps<V>) => void;
}

function nullDialog() {
    console.warn("WARNING using null dialog manager");
}

export const NullDialogManager: DialogManager = {
    confirm: nullDialog,
    prompt: nullDialog,
    autocomplete: nullDialog,
    snackbar: nullDialog,
    taskbar: async () => NULL_FUNCTION,
    dialog: nullDialog,
    select: nullDialog,
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

type DialogType = 'confirm' | 'prompt' | 'autocomplete' | 'snackbar' | 'dialog' | 'taskbar' | 'select';

interface DialogState {
    readonly type: DialogType;
    readonly props: ConfirmDialogProps | PromptDialogProps | AutocompleteDialogProps<any> | SnackbarDialogProps | IDialogProps | SelectDialogProps<any>;
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

        const taskbar = async function(taskbarProps: TaskbarDialogProps): Promise<TaskbarProgressCallback> {

            const latch = new Latch<TaskbarProgressCallback>();

            function onProgressCallback(callback: TaskbarProgressCallback) {
                latch.resolve(callback);
            }

            const props: TaskbarDialogPropsWithCallback = {
                ...taskbarProps,
                onProgressCallback,
            };

            setState({
                 type: 'taskbar',
                 props,
                 iter: iter++
            });

            return latch.get();

        };

        const select = function(selectProps: SelectDialogProps<any>) {
            setState({
                type: 'select',
                props: selectProps,
                iter: iter++
            });
        };

        const dialogManager: DialogManager = {
            confirm,
            prompt,
            autocomplete,
            snackbar,
            dialog,
            taskbar,
            select
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
                <SnackbarDialog key={state.iter}
                                {...(state.props as SnackbarDialogProps)}/>
            );

        case "dialog":

            const dialogProps = state.props as IDialogProps;

            return (
                dialogProps.dialog
            );

        case "taskbar":
            return (
                <TaskbarDialog key={state.iter}
                               {...(state.props as TaskbarDialogPropsWithCallback)}/>
            );

        case "select":
            return (
                <SelectDialog key={state.iter}
                              {...(state.props as SelectDialogProps<any>)}/>
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
