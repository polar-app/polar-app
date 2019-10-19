import {BaseType} from "./BaseType";
import {ReverseMap} from "./Reverse";
import {SparseArray, SparseArrays} from "polar-shared/src/util/Arrays";

/**
 */
export interface IGraphInit {
    "@graph": ReadonlyArray<BaseType | ReverseMap>,
}

export interface IGraph extends IGraphInit {
    readonly "@context": string,
}

export interface GraphEntry extends BaseType {
    readonly "@reverse": ReverseMap;
}

export class Graphs {

    public static create(entries: SparseArray<BaseType | ReverseMap>): IGraph {

        return {
            "@context": "https://schema.org",
            "@graph": SparseArrays.presentOnly(entries),
        };

    }

}
