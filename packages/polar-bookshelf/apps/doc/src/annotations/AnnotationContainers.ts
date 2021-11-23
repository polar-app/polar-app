import {AnnotationContainer} from "./AnnotationHooks";
import {PageAnnotation} from "./PageAnnotations";

export namespace AnnotationContainers {

    export interface PageAnnotationWithContainer<A> extends PageAnnotation<A> {
        readonly container: HTMLElement;
    }

    export function visible<A>(annotationContainers: ReadonlyArray<AnnotationContainer>,
                               annotations: ReadonlyArray<PageAnnotation<A>>): ReadonlyArray<PageAnnotationWithContainer<A>> {

        const lookup = createLookup(annotationContainers);

        return annotations.map(item => toPageAnnotationWithContainer<A>(lookup, item))
                          .filter(current => current !== undefined)
                          .map(current => current!);

    }

    export function visibleAnnotation<A>(annotationContainers: ReadonlyArray<AnnotationContainer>,
                                         annotation: PageAnnotation<A>): PageAnnotationWithContainer<A> | undefined {

        const lookup = createLookup(annotationContainers);

        return toPageAnnotationWithContainer(lookup, annotation);
    }

    function toPageAnnotationWithContainer<A>(lookup: ReadonlyArray<AnnotationContainer | undefined>,
                                              pageAnnotation: PageAnnotation<A>): PageAnnotationWithContainer<A> | undefined {

        const annotationContainer = lookup[pageAnnotation.pageNum];

        if (annotationContainer) {
            return {
                ...pageAnnotation,
                container: annotationContainer.container
            };
        } else {
            return undefined;
        }

    }

    function createLookup(annotationContainers: ReadonlyArray<AnnotationContainer>): ReadonlyArray<AnnotationContainer | undefined> {

        const result: AnnotationContainer[] = [];

        for (const annotationContainer of annotationContainers) {
            result[annotationContainer.pageNum] = annotationContainer;
        }

        return result;

    }

}
