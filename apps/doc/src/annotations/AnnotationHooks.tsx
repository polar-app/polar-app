import * as React from "react";
import {
    useComponentDidMount,
    useComponentWillUnmount
} from "../../../../web/js/hooks/lifecycle";
import {Debouncers} from "polar-shared/src/util/Debouncers";
import { IDimensions } from "polar-shared/src/util/IDimensions";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

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

        const viewerContainer = document.querySelector('#viewerContainer .pdfViewer')!;

        const observer = new MutationObserver((mutations) => {

            for (const mutation of mutations) {

                if (mutation.type === "attributes") {
                    delegate();
                }

                if (mutation.type === "childList") {
                    delegate();
                }

            }

        });

        if (viewerContainer) {

            // NOTE: I don't think 'attributes' is actually working here and that we
            // are in fact depending on scroll (for updates) and then childList (for
            // initial)
            observer.observe(viewerContainer, {
                // only monitor attributes.
                attributes: true,
                childList: true,
                // subtree: true
            });

            return () => {
                observer.disconnect();
            }

        }

        return () => NULL_FUNCTION;

    }

}

function getContainer(page: number): HTMLElement | undefined {

    const selector = `.page[data-page-number='${page}']`;
    const pageElement = document.querySelector(selector) as HTMLElement;

    if (! pageElement) {
        return undefined;
    }

    return getContainerFromPageElement(pageElement);

}

function getContainerFromPageElement(pageElement: HTMLElement): HTMLElement | undefined {

    const textLayerElement = pageElement.querySelector(".textLayer");

    if (! textLayerElement) {
        return undefined;
    }

    return textLayerElement as HTMLElement;

}


export interface AnnotationContainer {
    readonly pageNum: number;
    readonly container: HTMLElement;
}

export function useAnnotationContainers(): ReadonlyArray<AnnotationContainer> {

    // FIXME: this needs to be uppdated to use DocViewerElementsContext

    // TODO: another optimization, in the future, is going to be to only update
    // annotations on VISIBLE pages, not hidden ones that are under the screen.

    const [annotationContainers, setAnnotationContainers] = React.useState<ReadonlyArray<AnnotationContainer>>([]);

    function doUpdateDelegate() {

        // FIXME: need to figure out the pageNumber too...

        const pageElements = Array.from(document.querySelectorAll("#viewerContainer .page")) as ReadonlyArray<HTMLElement>;

        function toAnnotationContainer(pageElement: HTMLElement): AnnotationContainer {

            const pageNum = parseInt(pageElement.getAttribute('data-page-number') || '0');
            const container = getContainerFromPageElement(pageElement)!;

            return {
                pageNum, container
            };

        }

        const newAnnotationContainers
            = pageElements.filter(current => current.getAttribute('data-loaded') === 'true')
                          .map(toAnnotationContainer);

        setAnnotationContainers(newAnnotationContainers);

    }

    const doUpdate = React.useMemo(() => Debouncers.create(doUpdateDelegate), []);

    useComponentDidMount(() => {

        // call the delegate directly to force a draw when the component mounts
        doUpdateDelegate();

    });

    useSubscriber(createScrollSubscriber(doUpdate));
    useSubscriber(createResizeSubscriber(doUpdate));
    useSubscriber(createMutationObserverSubscriber(doUpdate));

    return annotationContainers;

}

export function getPageElement(page: number): HTMLElement {
    // FIXME: this is not portable to 2.0 with multiple PDFs loaded.
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
