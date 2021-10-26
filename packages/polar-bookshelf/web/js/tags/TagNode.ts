export interface MutableTagNode<V> {

    readonly id: string;

    readonly name: string;

    readonly path: string;

    readonly children: ReadonlyArray<MutableTagNode<V>>;

    readonly value: V;

    readonly count: number;

}

export interface TagNode<V> {

    readonly id: string;

    readonly name: string;

    readonly path: string;

    readonly children: ReadonlyArray<TagNode<V>>;

    readonly count: number;

    readonly value: V;

}

