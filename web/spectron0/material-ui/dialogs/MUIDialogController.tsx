import {Callback1} from "polar-shared/src/util/Functions";
import React, {useState} from "react";
import isEqual from "react-fast-compare";
import {
    ConfirmDialog,
    ConfirmDialogProps
} from "../../../js/ui/dialogs/ConfirmDialog";
import {
    PromptDialog,
    PromptDialogProps
} from "../../../js/ui/dialogs/PromptDialog";
import {Prompt} from "../../../js/ui/dialogs/Prompt";

export interface DialogManager {
    confirm: (props: ConfirmDialogProps) => void;
    prompt: (promptDialogProps: PromptDialogProps) => void;
}

interface DialogHostProps {
    readonly onDialogManager: Callback1<DialogManager>;
}

type DialogType = 'confirm' | 'prompt';

interface DialogState {
    readonly type: DialogType;
    readonly props: ConfirmDialogProps | PromptDialogProps;
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

        const dialogManager = {
            confirm,
            prompt
        };

        // tell the parent about the dialog manager now.
        props.onDialogManager(dialogManager);

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


    }

    return null;

}, isEqual);

interface IProps {
    readonly render: (dialogs: DialogManager) => JSX.Element;
}

/**
 * Component to use at the root to enable context to inject dialog components
 * with callbacks.
 */
export const MUIDialogController = (props: IProps) => {

    const [dialogManger, setDialogManager] = useState<DialogManager | undefined>(undefined);

    return (

        <>
            <DialogHost onDialogManager={dialogManger => setDialogManager(dialogManger)}/>

            {dialogManger && props.render(dialogManger)}
        </>
    );

};
