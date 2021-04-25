import {DocMetas} from "../../../../web/js/metadata/DocMetas";
import {Numbers} from "polar-shared/src/util/Numbers";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {IPageMeta} from "polar-shared/src/metadata/IPageMeta";
import {IDStr} from "polar-shared/src/util/Strings";

export interface PageAnnotation<A> {
    readonly fingerprint: IDStr;
    readonly pageNum: number;
    readonly annotation: A;
}

export type AnnotationProvider<A> = (pageMeta: IPageMeta) => ReadonlyArray<A>;

export namespace PageAnnotations {

    export function compute<A>(docMeta: IDocMeta,
                               annotationProvider: AnnotationProvider<A>): ReadonlyArray<PageAnnotation<A>> {

        const pages = Numbers.range(1, docMeta.docInfo.nrPages);

        return arrayStream(pages)
                .map((pageNum): ReadonlyArray<PageAnnotation<A>> => {

                    const pageMeta = DocMetas.getPageMeta(docMeta, pageNum);

                    const annotations = annotationProvider(pageMeta);

                    return annotations.map(annotation => {
                        return {
                            fingerprint: docMeta.docInfo.fingerprint,
                            pageNum, annotation
                        }
                    });

                })
                .flatMap(current => current)
                .collect();

    }

}
