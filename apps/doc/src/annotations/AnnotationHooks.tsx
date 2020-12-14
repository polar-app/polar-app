import * as React from "react";
import {
    useComponentDidMount,
    useComponentWillUnmount
} from "../../../../web/js/hooks/ReactLifecycleHooks";
import {Debouncers} from "polar-shared/src/util/Debouncers";
import { IDimensions } from "polar-shared/src/util/IDimensions";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {
    IPageDescriptor,
    useDocViewerElementsContext
} from "../renderers/DocViewerElementsContext";
import { useDocViewerStore } from "../DocViewerStore";
import isEqual from "react-fast-compare";
import {useRefProvider} from "../../../../web/js/hooks/ReactHooks";
import {useDocViewerContext} from "../renderers/DocRenderer";

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

function useScrollSubscriber(delegate: () => void): Subscriber {

    const docViewerElements = useDocViewerElementsContext();

    return React.useCallback(() => {

        const docViewer = docViewerElements.getDocViewerElement();
        const viewerContainer = docViewer.querySelector('#viewerContainer');

        function handleScroll() {
            delegate();
        }

        const listenerOpts = {passive: true};

        if (! viewerContainer) {
            return NULL_FUNCTION;
        }

        viewerContainer.addEventListener('scroll', handleScroll, listenerOpts);

        function unsubscribe () {

            if (viewerContainer) {
                viewerContainer.removeEventListener('scroll', handleScroll);
            }
        }

        return unsubscribe;

    }, [delegate, docViewerElements]);

}

function createResizeSubscriber(delegate: () => void): Subscriber {

    return () => {

        function handleResize() {
            delegate();
        }

        window.addEventListener('resize', handleResize, {passive: true});

        function unsubscribe() {
            window.removeEventListener('resize', handleResize);
        }

        return unsubscribe;

    }

}



function useMutationObserverSubscriber(delegate: () => void): Subscriber {

    const docViewerElements = useDocViewerElementsContext();
    const {fileType} = useDocViewerContext();

    return () => {

        if (fileType !== 'pdf') {
            // nothing to do when we're not working with PDF documents...
            return NULL_FUNCTION;
        }

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

        function doObserve(target: HTMLElement): Unsubscriber {

            // NOTE: I don't think 'attributes' is actually working here and that we
            // are in fact depending on scroll (for updates) and then childList (for
            // initial)
            observer.observe(target, {
                // only monitor attributes.
                attributes: true,
                childList: true,
                // subtree: true
            });

            return () => {
                observer.disconnect();
            }

        }

        const pageElements = docViewerElements.getPageElements();
        const unsubscribers = pageElements.map(doObserve);

        return () => {
            // we have to unsubscribe to every single one of the unsubscribers
            // now.
            unsubscribers.map(unsubscriber => unsubscriber());
        }

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
    // pageElements and annotation containers when we change pages.
    const {page} = useDocViewerStore(['page']);

    const docViewerElementsContext = useRefProvider(useDocViewerElementsContext);
    const [annotationContainers, setAnnotationContainers] = React.useState<ReadonlyArray<AnnotationContainer>>([]);

    const doUpdateDelegate = React.useCallback(() => {

        function toAnnotationContainer(pageDescriptor: IPageDescriptor): AnnotationContainer | undefined {

            const container = docViewerElementsContext.current.getContainerFromPageElement(pageDescriptor.element)!;

            if (! container) {
                return undefined;
            }

            return {
                pageNum: pageDescriptor.pageNum,
                pageElement: pageDescriptor.element,
                container
            };

        }

        const pageDescriptors = docViewerElementsContext.current.getPageDescriptors();

        const newAnnotationContainers
            = pageDescriptors.filter(current => current.loaded)
                             .map(toAnnotationContainer)
                             .filter(current => current !== undefined)
                             .map(current => current!);

        if (! isEqual(annotationContainers, newAnnotationContainers)) {
            // only update the annotation containers if they differ
            setAnnotationContainers(newAnnotationContainers);
        }

    }, [annotationContainers, docViewerElementsContext]);

    const doUpdate = React.useMemo(() => Debouncers.create(doUpdateDelegate), [doUpdateDelegate]);

    doUpdateDelegate();

    useSubscriber(useScrollSubscriber(doUpdate));
    useSubscriber(createResizeSubscriber(doUpdate));
    useSubscriber(useMutationObserverSubscriber(doUpdate));

    return annotationContainers;

}

export function computePageDimensions(pageElement: HTMLElement): IDimensions {
    return {
        width: pageElement.clientWidth,
        height: pageElement.clientHeight
    }
}
