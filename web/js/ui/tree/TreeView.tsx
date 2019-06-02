import * as React from 'react';
import {TreeNode} from './TreeNode';
import {Dictionaries} from '../../util/Dictionaries';
import {TagStr} from '../../tags/Tag';
import {TagDescriptor} from '../../tags/TagNode';

export class TreeView<V> extends React.Component<IProps<V>, IState> {

    constructor(props: IProps<V>, context: any) {
        super(props, context);
    }

    public render() {

        const {roots, treeState} = this.props;

        return <div>
            {roots.map(node =>
                   <TreeNode node={node}
                             key={node.id}
                             treeState={treeState}/>)}
        </div>;

    }

}

interface IProps<V> {
    readonly roots: ReadonlyArray<TNode<V>>;
    readonly treeState: TreeState<TagDescriptor>;
    readonly onSelected: (nodes: ReadonlyArray<TagStr>) => void;
}

interface IState {

}


/**
 * A state object for the entire tree to keep an index of expanded/collapsed
 * nodes, etc.
 */
export class TreeState<V> {

    constructor(public readonly onSelected: (nodes: ReadonlyArray<TagStr>) => void) {
    }

    public readonly closed = new Marked();

    /**
     * The currently applied filter for the path we're searching for.
     */
    public readonly filter = "";

    /**
     * The list of the nodes that are selected by id
     */
    public readonly selected: {[id: number]: number} = [];

    public readonly index: {[id: number]: TreeNode<V>} = [];

}


export class Marked {

    public readonly data: {[id: number]: boolean} = {};

    public mark(id: number) {
        this.data[id] = true;
    }

    public clear(id: number) {
        delete this.data[id];
    }

    public toggle(id: number) {
        this.data[id] = ! this.data[id];
        return this.data[id];
    }

    public contains(id: number) {
        return this.data[id];
    }

    public reset() {
        Dictionaries.empty(this.data);
    }

}

export interface TNode<V> {

    readonly name: string;

    readonly path: string;

    readonly children: ReadonlyArray<TNode<V>>;

    /**
     * The number of items under this node and all children.
     */
    readonly count: number;

    /**
     * The UNIQUE id for this node.
     */
    readonly id: number;

    readonly value: V;

}


