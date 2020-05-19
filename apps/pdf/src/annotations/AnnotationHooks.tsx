import * as React from "react";
import {Debouncers} from "polar-shared/src/util/Debouncers";
import {useComponentDidMount} from "../../../../web/js/hooks/lifecycle";
import {ContainerLifecycleState} from "../../../../web/js/components/containers/lifecycle/ContainerLifecycleState";

export function useAnnotationContainer(page: number) {

    const [container, setContainer] = React.useState<HTMLElement | undefined>();

    useComponentDidMount(() => {

        // update and get the container...
        const doUpdate = () => {

            const getContainer = (): HTMLElement | undefined => {

                const pageElement = document.querySelector(`.page[data-page-number='${page}']`);

                if (! pageElement) {
                    return undefined;
                }

                const textLayerElement = pageElement.querySelector(".textLayer");

                if (! textLayerElement) {
                    return undefined;
                }

                return textLayerElement as HTMLElement;

            };

            const newContainer = getContainer();

            if (container !== newContainer) {
                setContainer(newContainer);
            }

        };

        doUpdate();

        // const doUpdateDebouncer = Debouncers.create(() => doUpdate());
        const doUpdateDebouncer = doUpdate;

        function registerScrollListener() {
            const viewerContainer = document.getElementById('viewerContainer');
            viewerContainer!.addEventListener('scroll', () => doUpdateDebouncer());
        }

        function registerResizeListener() {
            window.addEventListener('resize', () => doUpdateDebouncer());
        }

        function registerMutationObserver() {

            // FIXME: how do we unregister these listeners? if an annotaiton
            // vanishes these aren't going to be cleaned up I think...

            // FIXME: there are also TOO MANY listeners already.

            // FIXME: I need componentWillUnmount too..

            const viewerContainer = document.getElementById('viewerContainer')!;

            const observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.type === "attributes") {
                        doUpdateDebouncer();
                    }
                }

            });

            observer.observe(viewerContainer, {
                // only monitor attributes.
                attributes: true
            });

        }

        // FIXME: mutation listener here would solve the problem... I think we
        // have to go with this even though it's nasty...

        // FIXME: should I use effect?
        // FIXME: remove event listeners on unmount...

        registerScrollListener();
        registerResizeListener();
        registerMutationObserver();

    });

    return container;

}
