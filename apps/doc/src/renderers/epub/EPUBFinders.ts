import {DOMTextSearch} from "polar-dom-text-search/src/DOMTextSearch";
import {DOMTextHit} from "polar-dom-text-search/src/DOMTextHit";

export namespace EPUBFinders {

    interface Opts {
        readonly query: string;
        readonly caseInsensitive?: boolean;
    }

    export interface EPUBFinder {
        readonly exec: (opts: Opts) => ReadonlyArray<DOMTextHit>
    }

    export function create(): EPUBFinder {

        const index = createIndex();

        function exec(opts: Opts) {

            const {query} = opts;

            if (query.trim() === '') {
                return [];
            }

            return index.search(query, 0, {caseInsensitive: opts.caseInsensitive});

        }

        return {exec};

    }

    function createIndex() {

        const {doc, root} = useEPUBRoot();

        return DOMTextSearch.createIndex(doc, root);

    }

}

export interface EPUBRoot {
    readonly doc: Document;
    readonly root: HTMLElement;
}

export function useEPUBRoot(): EPUBRoot {

    // FIXME: this is not portable to Polar 2.0 as we have no way to know
    // that we're working with the right iframe.

    const iframe = document.querySelector('iframe');

    if (! iframe) {
        throw new Error("No iframe - epub probably not mounted yet");
    }

    if (! iframe.contentDocument) {
        throw new Error("No iframe contentDocument - epub probably not mounted yet");
    }

    const doc = iframe!.contentDocument!;
    const root = doc.body;

    return {doc, root};

}
