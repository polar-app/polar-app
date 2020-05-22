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



function getContainer(page: number): HTMLElement | undefined {

    const pageElement = document.querySelector(`.page[data-page-number='${page}']`);

    if (! pageElement) {
        return undefined;
    }

    const textLayerElement = pageElement.querySelector(".textLayer");

    if (! textLayerElement) {
        return undefined;
    }

    return textLayerElement as HTMLElement;

}

export function useAnnotationContainer(pageNum: number) {

    const containerRef = React.useRef<HTMLElement | undefined>(undefined);
    const [, setContainer] = React.useState<HTMLElement | undefined>(undefined);

    function doUpdateDelegate() {

        const newContainer = getContainer(pageNum);
        const container = containerRef.current;

        if (container !== newContainer) {
            containerRef.current = newContainer;
            setContainer(newContainer);
        }

    }

    const doUpdate = React.useMemo(() => Debouncers.create(doUpdateDelegate), []);

    useComponentDidMount(() => {

        // call the delegate directly to force a draw when the component mounts
        doUpdateDelegate();

    });

    useSubscriber(createScrollSubscriber(doUpdate));
    useSubscriber(createResizeSubscriber(doUpdate));
    useSubscriber(createMutationObserverSubscriber(doUpdate));

    return containerRef.current;

}


export function getPageElement(page: number): HTMLElement{
    return document.querySelectorAll(".page")[page - 1] as HTMLElement;
}

export function computePageDimensions(pageNum: number): IDimensions {
    // TODO this is a bit of a hack.
    const pageElement = getPageElement(pageNum);
    return {
        width: pageElement.clientWidth,
        height: pageElement.clientHeight
    }
}
