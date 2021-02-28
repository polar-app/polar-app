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

