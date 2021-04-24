import * as React from "react";
import {Callback} from "polar-shared/src/util/Functions";
import {deepMemo} from "../../react/ReactUtils";
import {Providers} from "polar-shared/src/util/Providers";
import {
    useComponentDidMount,
    useComponentWillUnmount
} from "../../hooks/ReactLifecycleHooks";
import useTheme from "@material-ui/core/styles/useTheme";
import { Platforms, Platform } from "polar-shared/src/util/Platforms";

export function isInputCompleteEvent(type: InputCompletionType, event: KeyboardEvent) {

    switch (type) {

        case "enter":
            return event.key === 'Enter';
        case "meta+enter":
            return (event.ctrlKey || event.metaKey) && event.key === 'Enter';

    }

}

interface InputCompleteListenerOpts {

    readonly onComplete: () => void;

    readonly onCancel?: Callback;

    /**
     * Provide a function which returns true if input is completable.
     */
    readonly completable?: () => boolean;

    readonly type: InputCompletionType;

}

export function useInputCompleteListener(opts: InputCompleteListenerOpts) {

    const completable = opts.completable || Providers.of(true);

    // TODO: I think this is technically wrong because we have to
    // listen and unmount the key listeners on both unmount but also
    // when dependencies change.

    const onKeyDown = React.useCallback((event: KeyboardEvent) => {

        if (! completable()) {
            return;
        }

        // note that react-hotkeys is broken when you listen to 'Enter' on
        // ObserveKeys when using an <input> but it doesn't matter because we
        // can just listen to the key directly

        if (isInputCompleteEvent(opts.type, event)) {
            opts.onComplete();
            event.preventDefault();
            event.stopPropagation();
            return;
        }

        if (event.key === 'Escape' && opts.onCancel) {
            opts.onCancel();
            event.preventDefault();
            event.stopPropagation();
            return;
        }

    }, [completable, opts]);

    useComponentDidMount(() => {
        window.addEventListener('keydown', onKeyDown, {capture: true});
    });

    useComponentWillUnmount(() => {
        window.removeEventListener('keydown', onKeyDown, {capture: true});
    });

}

const InputCompleteSuggestion = () => {

    const theme = useTheme();

    const platform = Platforms.get();

    // if ([Platform.MACOS, Platform.LINUX, Platform.WINDOWS].includes(platform)) {
    //     // only do this on desktop platforms
    //     return null;
    // }

    function computeShortcut() {

        if (platform === Platform.MACOS) {
            return "command + enter";
        } else {
            return "control + enter"
        }

    }

    const shortcut = computeShortcut();

    return (
        <div style={{
                 textAlign: 'center',
                 color: theme.palette.text.hint
             }}>

            {shortcut} to complete input

        </div>
    )
};

export type InputCompletionType = 'enter' | 'meta+enter';

interface IProps extends InputCompleteListenerOpts {

    readonly children: JSX.Element;

    readonly type: InputCompletionType;

    readonly noHint?: boolean;

}

export const InputCompleteListener = deepMemo(function InputCompleteListener(props: IProps) {

    useInputCompleteListener(props);

    return (
        <>
            {props.children}
            {! props.noHint && <InputCompleteSuggestion/>}
        </>
    );

});
