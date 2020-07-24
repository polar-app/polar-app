import {DOMTextSearch} from "polar-dom-text-search/src/DOMTextSearch";

export namespace EPUBFinder {

    interface Opts {
        readonly query: string;
        readonly caseInsensitive?: boolean;
    }

    /**
     * Execute an EPUB search against the document.
     */
    export function exec(opts: Opts) {

        const {query} = opts;

        if (query.trim() === '') {
            return [];
        }

        const index = createIndex();

        return index.search(query, 0, {caseInsensitive: opts.caseInsensitive});

    }

    function createIndex() {

        const {doc, root} = useEPUBRoot();

        return DOMTextSearch.createIndex(doc, root);

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

}
