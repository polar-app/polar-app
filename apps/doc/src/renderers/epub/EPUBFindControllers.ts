import {Finder, FindHandler, IFindOpts} from "../../Finders";
import {EPUBFinder} from "./EPUBFinder";
import {DOMTextHitWithIndex, useEPUBFinderCallbacks} from "./EPUBFinderStore";
import {useHistory} from "react-router-dom";

export namespace EPUBFindControllers {

    import useEPUBRoot = EPUBFinder.useEPUBRoot;

    export function useEPUBFindController(): Finder {

        const history = useHistory();
        const callbacks = useEPUBFinderCallbacks();

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

            // TODO: I think this should/could go into the store
            const hits = EPUBFinder.exec({
                query: opts.query,
                caseInsensitive: false
            });

            callbacks.setHits(hits);

            opts.onMatches({total: hits.length, current: hits.length > 0 ? 1 : 0});

            return {opts, cancel, next, prev};

        };

        return {exec};

    }
}
