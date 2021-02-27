import {AnnotationContainer} from "./AnnotationHooks";
import {PageAnnotation} from "./PageAnnotations";

export namespace AnnotationContainers {

    export interface PageAnnotationWithContainer<A> extends PageAnnotation<A> {
        readonly container: HTMLElement;
    }

    export function visible<A>(annotationContainers: ReadonlyArray<AnnotationContainer>,
                               annotations: ReadonlyArray<PageAnnotation<A>>): ReadonlyArray<PageAnnotationWithContainer<A>> {

        function createLookup(): ReadonlyArray<AnnotationContainer | undefined> {

            const result: AnnotationContainer[] = [];

            for (const annotationContainer of annotationContainers) {
                result[annotationContainer.pageNum] = annotationContainer;
            }

            return result;

        }

        function toPageAnnotationWithContainer(pageAnnotation: PageAnnotation<A>): PageAnnotationWithContainer<A> | undefined {

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

        const lookup = createLookup();

        return annotations.map(toPageAnnotationWithContainer)
                          .filter(current => current !== undefined)
                          .map(current => current!);

    }

}
