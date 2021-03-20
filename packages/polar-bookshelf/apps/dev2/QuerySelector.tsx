import React from "react";
import {useComponentDidMount} from "../../web/js/hooks/ReactLifecycleHooks";
import {deepMemo} from "../../web/js/react/ReactUtils";

/**
 * Passes the element that was mounted.
 */
export interface ComponentProps<E extends HTMLElement> {
    readonly element: E;
}

export interface QuerySelectorProps<E extends HTMLElement> {
    readonly selector: () => E | null | undefined;
    readonly component: (props: ComponentProps<E>) => JSX.Element;
}

/**
 * Create a QuerySelector for pulling out the type of element we want.
 *
 * Note that we have to do this as a HoC because React.memo and React in general
 * doesn't work well with components that use generics.
 */
export function createQuerySelector<E extends HTMLElement>() {

    return deepMemo(function(props: QuerySelectorProps<E>) {

        const [element, setElement] = React.useState<E | undefined>();

        useComponentDidMount(() => {

            // TODO: we need to generify this a bit more probably providing a function
            // that returns the element directly and might want to call this something
            // like QuerySelector
            const newElement = props.selector();

            if (! newElement) {
                throw new Error("No element for selector");
            }

            setElement(newElement);

        });

        if (element) {
            return props.component({element});
        }

        return null;

    });

}

