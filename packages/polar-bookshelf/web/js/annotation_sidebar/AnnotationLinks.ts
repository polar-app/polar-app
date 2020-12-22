import {ResourcePaths} from "../electron/webresource/ResourcePaths";
import {Optional} from "polar-shared/src/util/ts/Optional";
import {IDStr, URLStr} from "polar-shared/src/util/Strings";
import {HashURLs} from "polar-shared/src/util/HashURLs";

export interface IAnnotationPtr {
    readonly target: IDStr;
    readonly docID: IDStr;
    readonly pageNum: number;
    readonly pos?: 'top' | 'bottom';
    readonly b?: number;
}

export namespace AnnotationLinks {

    import QueryOrLocation = HashURLs.QueryOrLocation;

    export function createHash(ptr: IAnnotationPtr): string {
        const nonce = Math.floor(Math.random() * 100000);
        const pos = ptr.pos || 'top';
        return `?page=${ptr.pageNum}&target=${ptr.target}&pos=${pos}&n=${nonce}`;
    }

    export function createURL(ptr: IAnnotationPtr): URLStr {
        const docID = ptr.docID;
        const hash = createHash(ptr)
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

