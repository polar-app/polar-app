import {IDocAnnotationRef} from "./DocAnnotation";
import {ResourcePaths} from "../electron/webresource/ResourcePaths";
import {Optional} from "polar-shared/src/util/ts/Optional";
import {URLStr} from "polar-shared/src/util/Strings";
import {HashURLs} from "polar-shared/src/util/HashURLs";

export namespace AnnotationLinks {

    import QueryOrLocation = HashURLs.QueryOrLocation;

    export function createHash(docAnnotationRef: IDocAnnotationRef) {
        const nonce = Math.floor(Math.random() * 100000);
        return `?page=${docAnnotationRef.pageNum}&target=${docAnnotationRef.id}&n=${nonce}`;
    }

    export function createURL(docAnnotationRef: IDocAnnotationRef): URLStr {
        const docID = docAnnotationRef.docMetaRef.id;
        const hash = createHash(docAnnotationRef)
        return ResourcePaths.resourceURLFromRelativeURL(`/doc/${docID}#${hash}`);
    }

    export interface IAnnotationLink {
        readonly page?: number;
        readonly target?: string;
    }

    export function parse(queryOrLocation: QueryOrLocation): IAnnotationLink | undefined{

        const params = HashURLs.parse(queryOrLocation);

        const page = Optional.of(params.get('page')).map(parseInt).getOrUndefined();
        const target = params.get('target') || undefined;

        if (page === undefined && target === undefined) {
            return undefined;
        }

        return {
            page, target
        };

    }

}

