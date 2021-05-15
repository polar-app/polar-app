import {TNode} from "./TNode";

/**
 * Like a node but specifically for the root
 */
export interface TRoot<V> extends TNode<V> {
    readonly title?: string;
}
