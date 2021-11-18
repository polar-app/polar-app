import {OrphanFinder} from "./OrphanFinder";

export namespace PathRegexFilterPredicates {

    import PathRegexStr = OrphanFinder.PathRegexStr;

    /**
     * Create a predicate where we turn true if any of the filters match.
     */
    export function createMatchAny(filters: ReadonlyArray<PathRegexStr>) {

        return (path: string): boolean => {
            return filters.filter(filter => path.match(filter)).length > 0;
        }

    }

    /**
     * Match all the given filters.
     */
    export function createMatchAll(filters: ReadonlyArray<PathRegexStr>) {

        return (path: string): boolean => {
            return filters.filter(filter => path.match(filter)).length === filters.length;
        }

    }


}
