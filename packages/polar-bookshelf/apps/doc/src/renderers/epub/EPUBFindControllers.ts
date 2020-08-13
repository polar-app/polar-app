import {Finder, FindHandler, IFindOpts} from "../../Finders";
import {DOMTextHitWithIndex, useEPUBFinderCallbacks} from "./EPUBFinderStore";
import {useHistory} from "react-router-dom";
import {EPUBFinders, useEPUBRoot} from "./EPUBFinders";
import EPUBFinder = EPUBFinders.EPUBFinder;

export namespace EPUBFindControllers {

    export function useEPUBFindController(): Finder {

        const history = useHistory();
        const callbacks = useEPUBFinderCallbacks();

        const epubFinderCache = EPUBFinderCaches.create();

        const exec = (opts: IFindOpts): FindHandler => {

            const cancel = () => {
                history.replace({hash: ""});
                // cancel the hits we're working with.
                callbacks.reset();
            };

            function updateHit(hit: DOMTextHitWithIndex | undefined) {

                if (! hit) {
                    return;
                }

                function scrollTo() {
                    const {root} = useEPUBRoot();

                    history.replace({hash: hit!.id});
                    root.querySelector('#' + hit!.id)!.scrollIntoView();
                }

                function updateMatches() {
                    opts.onMatches({total: hits.length, current: hit!.idx + 1});
                }

                scrollTo();
                updateMatches();

            }

            function next() {
                updateHit(callbacks.next());
            }

            function prev() {
                updateHit(callbacks.prev());
            }

            const finder = epubFinderCache.get();

            // TODO: I think this should/could go into the store
            const hits = finder.exec({
                query: opts.query,
                caseInsensitive: true
            });

            callbacks.setHits(hits);

            opts.onMatches({total: hits.length, current: hits.length > 0 ? 1 : 0});

            return {opts, cancel, next, prev};

        };

        return {exec};

    }
}

interface EPUBFinderCache {
    get(): EPUBFinder;
}

export namespace EPUBFinderCaches {

    export function create(): EPUBFinderCache {

        function getLocation() {
            const {root} = useEPUBRoot();
            return root.ownerDocument!.location.href;
        }

        interface CacheEntry {
            readonly location: string;
            readonly finder: EPUBFinder;
        }

        let cache: CacheEntry | undefined;

        function get() {

            if (cache?.location !== getLocation()) {
                const location = getLocation();
                const finder = EPUBFinders.create();
                cache = {
                    location, finder
                }
            }

            return cache.finder;

        }

        return {get};

    }

}
