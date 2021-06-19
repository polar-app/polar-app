/**
 * The starting size of the int[] array containing the payload
 */
import {STEdge} from "./STEdge";


const START_SIZE = 0;
/**
 * The increment in size used when the payload array is full
 */
const INCREMENT = 1;

/**
 * Represents a node of the generalized suffix tree graph
 * @see GeneralizedSuffixTree
 */
export class STNode {

    /**
     * The payload array used to store the data (indexes) associated with this node.
     * In this case, it is used to store all property indexes.
     *
     * As it is handled, it resembles an ArrayList: when it becomes full it
     * is copied to another bigger array (whose size is equals to data.length +
     * INCREMENT).
     *
     * Originally it was a List<Integer> but it took too much memory, changing
     * it to int[] take less memory because indexes are stored using native
     * types.
     */
    private data: number[];

    /**
     * Represents index of the last position used in the data int[] array.
     *
     * It should always be less than data.length
     */
    private lastIdx = 0;

    /**
     * The set of edges starting from this node
     */
    private edges: {[ch: string]: STEdge };
    /**
     * The suffix link as described in Ukkonen's paper.
     * if str is the string denoted by the path from the root to this, this.suffix
     * is the node denoted by the path that corresponds to str without the first char.
     */
    private suffix: STNode | null;

    /**
     * The total number of <em>different</em> results that are stored in this
     * node and in underlying ones (i.e. nodes that can be reached through paths
     * starting from <tt>this</tt>.
     *
     * This must be calculated explicitly using computeAndCacheCount
     * @see Node#computeAndCacheCount()
     */
    private resultCount = -1;

    /**
     * Creates a new Node
     */
    constructor() {
        this.edges = {};
        this.suffix = null;
        this.data = [];
    }

    /**
     * Returns all the indexes associated to this node and its children.
     * @return all the indexes associated to this node and its children
     */
    public getData() {
        return this.getDataWithLimit(-1);
    }

    /**
     * Returns the first <tt>numElements</tt> elements from the ones associated to this node.
     *
     * Gets data from the payload of both this node and its children, the string representation
     * of the path to this node is a substring of the one of the children nodes.
     *
     * @param numElements the number of results to return. Use -1 to get all
     * @return the first <tt>numElements</tt> associated to this node and children
     */
    public getDataWithLimit(numElements: number) {

        const ret = new Set<number>();
        for (const num of this.data) {
            ret.add(num);
            if (ret.size === numElements) {
                return ret;
            }
        }

        // need to get more matches from child nodes. This is what may waste time
        for (const e of Object.values(this.edges)) {
            if (-1 === numElements || ret.size < numElements) {
                for (const num of e.getDest().getData()) {
                    ret.add(num);
                    if (ret.size === numElements) {
                        return ret;
                    }
                }
            }
        }

        return ret;

    }

    /**
     * Adds the given <tt>index</tt> to the set of indexes associated with <tt>this</tt>
     */
    public addRef(index: number) {

        if (this.contains(index)) {
            return;
        }

        this.addIndex(index);

        // add this reference to all the suffixes as well
        let iter = this.suffix;

        while (iter != null) {
            if (iter.contains(index)) {
                break;
            }
            iter.addRef(index);
            iter = iter.suffix;
        }

    }

    /**
     * Tests whether a node contains a reference to the given index.
     *
     * <b>IMPORTANT</b>: it works because the array is sorted by construction
     *
     * @param index the index to look for
     * @return true <tt>this</tt> contains a reference to index
     */
    private contains(index: number): boolean {

        // Java 5 equivalent to
        // return java.util.Arrays.binarySearch(data, 0, lastIdx, index) >= 0;

        let low = 0;
        let high = this.lastIdx - 1;

        while (low <= high) {
            // tslint:disable-next-line:no-bitwise
            const mid = (low + high) >>> 1;
            const midVal = this.data[mid];

            if (midVal < index)
            low = mid + 1;
            else if (midVal > index)
            high = mid - 1;
            else
            return true;
        }

        return false;

    }

    /**
     * Computes the number of results that are stored on this node and on its
     * children, and caches the result.
     *
     * Performs the same operation on subnodes as well
     * @return the number of results
     */
    public computeAndCacheCount(): number {
        this.computeAndCacheCountRecursive();
        return this.resultCount;
    }

    private computeAndCacheCountRecursive() {

        const ret = new Set<number>();

        for (const num of this.data) {
            ret.add(num);
        }

        for (const e of Object.values(this.edges)) {
            for (const num of e.getDest().computeAndCacheCountRecursive()) {
                ret.add(num);
            }
        }

        this.resultCount = ret.size;
        return ret;
    }

    /**
     * Returns the number of results that are stored on this node and on its
     * children.
     * Should be called after having called computeAndCacheCount.
     *
     * @throws IllegalStateException when this method is called without having called
     * computeAndCacheCount first
     * @see Node#computeAndCacheCount()
     * @todo this should raise an exception when the subtree is changed but count
     * wasn't updated
     */
    public getResultCount(): number {

        if (-1 === this.resultCount) {
            throw new Error("getResultCount() shouldn't be called without calling computeCount() first");
        }

        return this.resultCount;
    }

    addEdge(ch: string, e: STEdge) {
        this.edges[ch] = e;
    }

    getEdge(ch: string) {
        return this.edges[ch] || null;
    }

    getEdges() {
        return this.edges;
    }

    getSuffix() {
        return this.suffix;
    }

    setSuffix(suffix: STNode) {
        this.suffix = suffix;
    }

    private addIndex(index: number) {

        // if (this.lastIdx === this.data.length) {
        //     // int[] copy = new int[data.length + INCREMENT];
        //     // System.arraycopy(data, 0, copy, 0, data.length);
        //     // data = copy;
        // }

        this.data[this.lastIdx++] = index;

    }
}
