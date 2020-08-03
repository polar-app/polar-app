import * as React from "react";
import {
    useComponentDidMount,
    useComponentWillUnmount
} from "../../../../web/js/hooks/lifecycle";
import {Debouncers} from "polar-shared/src/util/Debouncers";
import { IDimensions } from "polar-shared/src/util/IDimensions";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {
    IPageDescriptor,
    useDocViewerElementsContext
} from "../renderers/DocViewerElementsContext";
import { useDocViewerStore } from "../DocViewerStore";

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

        // FIXME: this isn't porable to polar 2.0 plus viewerContainer isn't
        // setup in EPUB...
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

export interface AnnotationContainer {
    readonly pageNum: number;
    readonly pageElement: HTMLElement;
    readonly container: HTMLElement;
}

export function useAnnotationContainers(): ReadonlyArray<AnnotationContainer> {

    // TODO: another optimization, in the future, is going to be to only update
    // annotations on VISIBLE pages, not hidden ones that are under the screen.

    // this just tricks us to re-render for the EPUB viewer so we get new
    // pageElements .
    const {page} = useDocViewerStore(['page']);

    const docViewerElementsContext = useDocViewerElementsContext();

    const [annotationContainers, setAnnotationContainers] = React.useState<ReadonlyArray<AnnotationContainer>>([]);

    function doUpdateDelegate() {

        function toAnnotationContainer(pageElement: IPageDescriptor): AnnotationContainer {

            const container = docViewerElementsContext.getContainerFromPageElement(pageElement.element)!;

            return {
                pageNum: pageElement.pageNum,
                pageElement: pageElement.element,
                container
            };

        }

        const pageDescriptors = docViewerElementsContext.getPageDescriptors();

        const newAnnotationContainers
            = pageDescriptors.filter(current => current.loaded)
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

export function computePageDimensions(pageElement: HTMLElement): IDimensions {
    return {
        width: pageElement.clientWidth,
        height: pageElement.clientHeight
    }
}
