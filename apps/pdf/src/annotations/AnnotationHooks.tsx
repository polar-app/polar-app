import * as React from "react";
import {
    useComponentDidMount,
    useComponentWillUnmount
} from "../../../../web/js/hooks/lifecycle";
import {Debouncers} from "polar-shared/src/util/Debouncers";
import { IDimensions } from "polar-shared/src/util/IDimensions";

/**
 * Unsubscribes to the action created by the subscriber.
 */
export type Unsubscriber = () => void;

/**
 * Subscribe to some type of activity/event listener.
 */
export type Subscriber = () => Unsubscriber

function useSubscriber(subscriber: Subscriber) {
    
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

function createScrollSubscriber(delegate: () => void): Subscriber {

    return () => {

        const viewerContainer = document.getElementById('viewerContainer');

        function handleScroll() {
            delegate();
        }

        viewerContainer!.addEventListener('scroll', handleScroll);

        return () => {
            viewerContainer!.removeEventListener('scroll', handleScroll);
        }

    }

}

function createResizeSubscriber(delegate: () => void): Subscriber {

    return () => {

        function handleResize() {
            delegate();
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);

        }
    }

}



function createMutationObserverSubscriber(delegate: () => void): Subscriber {

    return () => {

        const viewerContainer = document.getElementById('viewerContainer')!;

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === "attributes") {
                    delegate();
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

}



export function useAnnotationContainer(page: number) {

    const [container, setContainer] = React.useState<HTMLElement | undefined>();

    const doUpdateDelegate = React.useCallback(() => {

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

    }, []);

    const doUpdate = React.useMemo(() => Debouncers.create(() => doUpdateDelegate()), []);

    useComponentDidMount(() => {

        // call the delegate directly to force a draw when the component mounts
        doUpdateDelegate();

    });

    useSubscriber(createScrollSubscriber(doUpdate));
    useSubscriber(createResizeSubscriber(doUpdate));
    useSubscriber(createMutationObserverSubscriber(doUpdate));

    return container;

}


export function getPageElement(page: number) {
    return document.querySelectorAll(".page")[page - 1];
}

export function computePageDimensions(page: number): IDimensions {
    // TODO this is a bit of a hack.
    const pageElement = getPageElement(page);
    return {
        width: pageElement.clientWidth,
        height: pageElement.clientHeight
    }
}
