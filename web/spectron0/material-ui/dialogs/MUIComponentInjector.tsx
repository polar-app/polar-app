import {Callback1, NULL_FUNCTION} from "polar-shared/src/util/Functions";
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
import {
    AutocompleteDialog,
    AutocompleteDialogProps
} from "../../../js/ui/dialogs/AutocompleteDialog";

type InjectedComponent = JSX.Element;

export interface ComponentInjector {
    inject: (component: InjectedComponent) => void;
}

interface InjectedComponentHostProps {
    readonly onComponentInjector: Callback1<ComponentInjector>;
}

interface InjectedComponentState {
    readonly component: InjectedComponent;
    readonly iter: number;
}

/**
 * Hosts the actual dialogs so that we don't ever re-render sub-components.
 */
const InjectedComponentHost = React.memo((props: InjectedComponentHostProps) => {

    const [state, setState] = useState<InjectedComponentState | undefined>(() => {

        let iter = 0;

        const inject = (component: InjectedComponent): void => {
            setState({
                component,
                iter: iter++
            });
        };

        const componentInjector: ComponentInjector = {
            inject
        };

        // WARN: not sure if this is the appropriate way to do this but we need
        // to have this run after the component renders and this way it can
        // continue
        setTimeout(() => props.onComponentInjector(componentInjector), 1);

        return undefined;

    });

    if (state === undefined) {
        return null;
    }

    return state.component;

}, isEqual);

interface IProps {
    readonly render: (injector: ComponentInjector) => JSX.Element;
}

/**
 * Component to use at the root to enable context to inject dialog components
 * with callbacks.
 */
export const MUIComponentInjector = (props: IProps) => {

    const [injector, setInjector] = useState<ComponentInjector | undefined>(undefined);

    return (

        <>
            <InjectedComponentHost onComponentInjector={injector => setInjector(injector)}/>

            {injector && props.render(injector)}
        </>
    );

};
