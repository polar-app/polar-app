import React from "react";
import {useComponentDidMount} from "../../web/js/hooks/ReactLifecycleHooks";
import {deepMemo} from "../../web/js/react/ReactUtils";

/**
 * Passes the element that was mounted.
 */
export interface ElementFinderComponentProps {
    readonly element: HTMLIFrameElement;
}

export interface ElementFinderProps {
    readonly component: (props: ElementFinderComponentProps) => JSX.Element;
}

/**
 * We have to wait for the element to be mounted and then look for the iframe
 * so we just have to call a child component after.
 */
export const ElementFinder = deepMemo((props: ElementFinderProps): JSX.Element | null => {

    const [element, setElement] = React.useState<HTMLIFrameElement | undefined>();

    useComponentDidMount(() => {

        // TODO: we need to generify this a bit more probably providing a function
        // that returns the element directly and might want to call this something
        // like QuerySelector
        const iframe = document.querySelector('iframe');

        if (! iframe) {
            throw new Error("No iframe");
        }

        setElement(iframe);

    });

    if (element) {
        return props.component({element});
    }

    return null;

});
