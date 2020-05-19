import * as React from "react";
import {
    useComponentDidMount,
    useComponentWillUnmount
} from "../../../../web/js/hooks/lifecycle";
import {Debouncers} from "polar-shared/src/util/Debouncers";
import {SnapshotUnsubscriber} from "../../../../web/js/firebase/SnapshotSubscribers";


/**
 * Unsubscribes to the action created by the subscriber.
 */
export type Unsubscriber = () => void;

/**
 * Subscribe to some type of activity/event listener.
 */
export type Subscriber = () => Unsubscriber

function useSubscription(subscriber: Subscriber) {
    
    const unsubscriberRef = React.useRef<Unsubscriber | undefined>(undefined);

    useComponentDidMount(() => {
        unsubscriberRef.current = subscriber();
    })

    useComponentWillUnmount(() => {

        const unsubscriber = unsubscriberRef.current;

        if (unsubscriber) {
            unsubscriber();
        }

    })

}


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

        const doUpdateDebouncer = Debouncers.create(() => doUpdate());

        function registerScrollListener(): Unsubscriber {

            const viewerContainer = document.getElementById('viewerContainer');

            function handleScroll() {
                doUpdateDebouncer()
            }

            viewerContainer!.addEventListener('scroll', handleScroll);

            return () => {
                viewerContainer!.removeEventListener('scroll', handleScroll);
            }

        }

        function registerResizeListener(): Unsubscriber {

            function handleResize() {
                doUpdateDebouncer();
            }

            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
            }

        }

        function registerMutationObserver(): SnapshotUnsubscriber {

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

            return () => {
                observer.disconnect();
            }

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
