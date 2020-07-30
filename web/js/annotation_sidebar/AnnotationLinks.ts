import {IDocAnnotationRef} from "./DocAnnotation";
import {ResourcePaths} from "../electron/webresource/ResourcePaths";
import {Optional} from "polar-shared/src/util/ts/Optional";

export namespace AnnotationLinks {

    export function createHash(annotation: IDocAnnotationRef) {
        return `?page=${annotation.pageNum}&annotation=${annotation.id}`;
    }

    export function createURL(annotation: IDocAnnotationRef) {
        const docID = annotation.docMetaRef.id;
        return ResourcePaths.resourceURLFromRelativeURL(`/doc/${docID}#?page=${annotation.pageNum}&annotation=${annotation.id}`);
    }

    export interface IAnnotationLink {
        readonly page?: number;
        readonly annotation?: string;
    }

    export function parse(query: string): IAnnotationLink {

        function tokenize(query: string) {

            if (query.startsWith('#')) {
                return query.substring(1);
            }

            return query;

        }

        const params = new URLSearchParams(tokenize(query));

        const page = Optional.of(params.get('page')).map(parseInt).getOrUndefined();
        const annotation = params.get('annotation') || undefined;

        return {
            page, annotation
        };

    }

}
