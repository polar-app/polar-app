import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {TreeNode} from "./TreeNode";
import {Tag, TagStr} from "polar-shared/src/tags/Tags";
import {MarkSet} from "./TreeView";

/**
 * A state object for the entire tree to keep an index of expanded/collapsed
 * nodes, etc.
 */
export class TreeState<V> {

    /**
     */
    constructor(private readonly onSelected: (nodes: ReadonlyArray<TagStr>) => void,
                private readonly onDropped: (node: V) => void = NULL_FUNCTION) {

    }

    public readonly closed = new MarkSet();


    /**
     * The list of the nodes that are selected by id
     */
    public readonly selected = new MarkSet();

    /**
     * The currently applied filter for the path we're searching for.
     */
    public readonly filter = "";

    public readonly index: { [id: string]: TreeNode<V> } = {};

    /**
     * Just the user tags that the user has selected.
     */
    public tags: ReadonlyArray<Tag> = [];

    public dispatchSelected() {

        const selectedFolders = this.selected.keys();
        const selectedTags = this.tags.map(current => current.id);

        const selected = [...selectedTags, ...selectedFolders];

        this.onSelected(selected);

    }

    public dispatchDropped(node: V) {
        this.onDropped(node);
    }

}
