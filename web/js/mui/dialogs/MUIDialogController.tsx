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
import {deepMemo} from "../../react/ReactUtils";

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

interface DialogElement {
    readonly element: JSX.Element;
}

interface DialogElementWithKey extends DialogElement {
    readonly key: string;
}

interface DialogState {
    readonly iter: number;
}

function createKey() {
    return '' + Math.floor(Math.random() * 1000000);
}

/**
 * Hosts the actual dialogs so that we don't ever re-render sub-components.
 */
const DialogHost = (props: DialogHostProps) => {

    const dialogElements = React.useRef<ReadonlyArray<JSX.Element>>([]);

    const registerDialogElement = React.useCallback((element: JSX.Element) => {
        dialogElements.current = [...dialogElements.current, element];
    }, []);

    // TODO we need a way to handle GCing the dialog boxes so they're removed

    const [state, setState] = useState<DialogState | undefined>(() => {

        let iter = 0;

        function doIncr() {
            setState({
                iter: iter++
            });
        }

        const confirm = (confirmDialogProps: ConfirmDialogProps) => {
            registerDialogElement(<ConfirmDialog key={createKey()}
                                                 {...confirmDialogProps}/>);
            doIncr();
        };

        const prompt = (promptDialogProps: PromptDialogProps) => {
            registerDialogElement(<PromptDialog key={createKey()}
                                                {...promptDialogProps}/>);
            doIncr();
        };

        const autocomplete = function<T>(autocompleteProps: AutocompleteDialogProps<T>) {
            registerDialogElement(<AutocompleteDialog key={createKey()}
                                                      {...autocompleteProps}/>);
            doIncr();
        };

        const snackbar = function(snackbarProps: SnackbarDialogProps) {
            registerDialogElement(<SnackbarDialog key={createKey()}
                                                  {...snackbarProps}/>);
            doIncr();
        };

        // const dialog = function(dialogProps: IDialogProps) {
        //     registerDialogElement({
        //         type: 'dialog',
        //         props: dialogProps,
        //     });
        //     doIncr();
        // };

        const taskbar = async function(taskbarProps: TaskbarDialogProps): Promise<TaskbarProgressCallback> {

            const latch = new Latch<TaskbarProgressCallback>();

            function onProgressCallback(callback: TaskbarProgressCallback) {
                latch.resolve(callback);
            }

            const props: TaskbarDialogPropsWithCallback = {
                ...taskbarProps,
                onProgressCallback,
            };

            registerDialogElement(<TaskbarDialog key={createKey()}
                                                 { ...props}/>);
            doIncr();

            return latch.get();

        };

        const select = function(selectProps: SelectDialogProps<any>) {
            registerDialogElement(<SelectDialog key={createKey()}
                                                {...selectProps}/>);
            doIncr();
        };

        const dialogManager: DialogManager = {
            confirm,
            prompt,
            autocomplete,
            snackbar,
            dialog: NULL_FUNCTION,
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

    console.log("FIXME: we now have N elements: " + dialogElements.current.length);

    // FIXME: this isn't working... not sure why...
    // the key isn't being preserved...
    return (
        <>
            {dialogElements.current}
        </>
    );

};

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
