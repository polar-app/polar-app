import {Finder, FindHandler, IFindOpts} from "../../Finders";
import {EPUBFinder} from "./EPUBFinder";
import { useEPUBFinderCallbacks } from "./EPUBFinderStore";

export namespace EPUBFindControllers {

    export function createFinder(): Finder {

        const callbacks = useEPUBFinderCallbacks();

        const exec = (opts: IFindOpts): FindHandler => {

            const cancel = () => {
                // cancel the hits we're working with.
                callbacks.reset();
            };

            function next() {
                callbacks.next();
            }

            function prev() {
                callbacks.prev();
            }

            // TODO: I think this should/could go into the store
            const hits = EPUBFinder.exec({
                query: opts.query,
                caseInsensitive: opts.caseSensitive
            });

            callbacks.setHits(hits);

            return {opts, cancel, next, prev};

        };

        return {exec};

    }
}
