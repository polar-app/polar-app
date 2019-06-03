import * as React from 'react';
import {TreeNode} from './TreeNode';
import {Dictionaries} from '../../util/Dictionaries';
import {TagStr} from '../../tags/Tag';
import {TagDescriptor} from '../../tags/TagNode';
import {isPresent} from '../../Preconditions';
import {Tag} from '../../tags/Tag';

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
    readonly treeState: TreeState<V>;
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
    public readonly selected: {[id: string]: boolean} = {};

    public readonly index: {[id: string]: TreeNode<V>} = {};

    /**
     * Just the user tags that the user has selected.
     */
    public tags: readonly Tag[] = [];

    public dispatchSelected() {

        const selectedFolders = Object.keys(this.selected);
        const selectedTags = this.tags.map(current => current.id);

        const selected = [...selectedTags, ...selectedFolders];

        this.onSelected(selected);

    }

}


export class Marked {

    public readonly data: {[id: string]: boolean} = {};

    public mark(id: string) {
        this.data[id] = true;
    }

    public clear(id: string) {
        delete this.data[id];
    }

    public toggle(id: string) {
        this.data[id] = ! this.data[id];
        return this.data[id];
    }

    public contains(id: string): boolean {
        return isPresent(this.data[id]);
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
    readonly id: string;

    readonly value: V;

}


