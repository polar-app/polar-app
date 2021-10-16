import {ArrayListMultimap} from "polar-shared/src/util/Multimap";
import {PathStr} from "polar-shared/src/util/Strings";
import {ISourceReference} from "./ISourceReference";

export namespace DependencyIndex {

    export interface IDependencyIndex {
        readonly registerDependency: (source: ISourceReference, target: ISourceReference) => void;
    }

    export function create() {

        const multimap = new ArrayListMultimap<PathStr, ISourceReference>();



    }

}
