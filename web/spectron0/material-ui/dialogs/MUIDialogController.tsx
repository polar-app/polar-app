import {Callback1} from "polar-shared/src/util/Functions";
import React, {useState} from "react";
import isEqual from "react-fast-compare";
import {
    ConfirmDialog,
    ConfirmDialogProps
} from "../../../js/ui/dialogs/ConfirmDialog";


export interface DialogManager {
    confirm: (props: ConfirmDialogProps) => void;
}

interface DialogHostProps {
    readonly onDialogManager: Callback1<DialogManager>;
}

type DialogType = 'confirm';

interface DialogState {
    readonly type: DialogType;
    readonly props: ConfirmDialogProps;
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
                props:
                confirmDialogProps,
                iter: iter++
            });
        };

        const dialogManager = {
            confirm
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
                <ConfirmDialog key={state.iter} {...state.props}/>
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
