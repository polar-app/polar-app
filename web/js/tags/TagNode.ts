import {Tag} from 'polar-shared/src/tags/Tags';
import {IDStr} from "polar-shared/src/util/Strings";

export interface MutableTagNode<V> {

    id: string;

    name: string;

    path: string;

    children: Array<MutableTagNode<V>>;

    value: V;

    count: number;

}

export interface TagNode<V> {

    readonly id: string;

    readonly name: string;

    readonly path: string;

    readonly children: ReadonlyArray<TagNode<V>>;

    readonly count: number;

    readonly value: V;

}

/**
 * A tag but also the data about the number of records that match this tag.
 */
export interface TagDescriptor extends Tag {

    /**
     * Total number of items in this tag.
     */
    readonly count: number;

    /**
     * The IDs of all the documents that are a member of this tag.
     */
    readonly members: ReadonlyArray<IDStr>;

}

