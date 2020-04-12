import {DocMetas} from "../../../../web/js/metadata/DocMetas";
import {Numbers} from "polar-shared/src/util/Numbers";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {IPageMeta} from "polar-shared/src/metadata/IPageMeta";

export interface PageAnnotation<A> {
    readonly page: number;
    readonly annotation: A;
}

export type AnnotationProvider<A> = (pageMeta: IPageMeta) => ReadonlyArray<A>;

export namespace PageAnnotations {

    export function compute<A>(docMeta: IDocMeta,
                               annotationProvider: AnnotationProvider<A>): ReadonlyArray<PageAnnotation<A>> {

        const pages = Numbers.range(1, docMeta.docInfo.nrPages);

        return arrayStream(pages)
                .map((page): ReadonlyArray<PageAnnotation<A>> => {

                    const pageMeta = DocMetas.getPageMeta(docMeta, page);

                    const annotations = annotationProvider(pageMeta);

                    return annotations.map(annotation => {
                        return {
                            page, annotation
                        }
                    });

                })
                .flatMap(current => current)
                .collect();

    }

}
