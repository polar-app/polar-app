import React from 'react';
import {Finder, FindHandler, IFindOpts} from "../../Finders";
import {DOMTextHitWithIndex, useEPUBFinderCallbacks} from "./EPUBFinderStore";
import {useHistory} from "react-router-dom";
import {EPUBFinders, useEPUBRoot, useEPUBRootProvider} from "./EPUBFinders";
import {URLStr} from 'polar-shared/src/util/Strings';
import {Provider} from 'polar-shared/src/util/Providers';
import EPUBFinder = EPUBFinders.EPUBFinder;

export namespace EPUBFindControllers {

    export function useEPUBFindController(): Finder {

        const history = useHistory();
        const callbacks = useEPUBFinderCallbacks();
        const epubFinderCacheProvider = useEPUBFinderCache();

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

            const finder = epubFinderCacheProvider();

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

interface EPUBFinderCacheEntry {
    readonly location: string;
    readonly finder: EPUBFinder;
}

export function useEPUBFinderCache(): Provider<EPUBFinder> {

    const cacheRef = React.useRef<EPUBFinderCacheEntry | undefined>();

    const epubRootProvider = useEPUBRootProvider();

    const getLocation = React.useCallback((): URLStr => {
        const {root} = epubRootProvider();
        return root.ownerDocument!.location.href;
    }, [epubRootProvider]);

    return React.useCallback((): EPUBFinder => {

        if (cacheRef.current?.location !== getLocation()) {

            const location = getLocation();
            const finder = EPUBFinders.create(epubRootProvider);
            cacheRef.current = {
                location, finder
            }

        }

        return cacheRef.current.finder;

    }, [epubRootProvider, getLocation])

}
