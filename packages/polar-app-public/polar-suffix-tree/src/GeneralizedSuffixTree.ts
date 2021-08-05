import { STNode } from "./STNode";
import {ResultInfo} from "./ResultInfo";
import { STEdge } from "./STEdge";
import { Pair } from "./Pair";
import {StringUtils} from "./StringUtils";

/**
 * A Generalized Suffix Tree, based on the Ukkonen's paper "On-line construction of suffix trees"
 * http://www.cs.helsinki.fi/u/ukkonen/SuffixT1withFigs.pdf
 *
 * Allows for fast storage and fast(er) retrieval by creating a tree-based index out of a set of strings.
 * Unlike common suffix trees, which are generally used to build an index out of one (very) long string,
 * a Generalized Suffix Tree can be used to build an index over many strings.
 *
 * Its main operations are put and search:
 * Put adds the given key to the index, allowing for later retrieval of the given value.
 * Search can be used to retrieve the set of all the values that were put in the index with keys that contain a given input.
 *
 * In particular, after put(K, V), search(H) will return a set containing V for any string H that is substring of K.
 *
 * The overall complexity of the retrieval operation (search) is O(m) where m is the length of the string to search within the index.
 *
 * Although the implementation is based on the original design by Ukkonen, there are a few aspects where it differs significantly.
 *
 * The tree is composed of a set of nodes and labeled edges. The labels on the edges can have any length as long as it's greater than 0.
 * The only constraint is that no two edges going out from the same node will start with the same character.
 *
 * Because of this, a given (startNode, stringSuffix) pair can denote a unique path within the tree, and it is the path (if any) that can be
 * composed by sequentially traversing all the edges (e1, e2, ...) starting from startNode such that (e1.label + e2.label + ...) is equal
 * to the stringSuffix.
 * See the search method for details.
 *
 * The union of all the edge labels from the root to a given leaf node denotes the set of the strings explicitly contained within the GST.
 * In addition to those Strings, there are a set of different strings that are implicitly contained within the GST, and it is composed of
 * the strings built by concatenating e1.label + e2.label + ... + $end, where e1, e2, ... is a proper path and $end is prefix of any of
 * the labels of the edges starting from the last node of the path.
 *
 * This kind of "implicit path" is important in the testAndSplit method.
 *
 */
export class GeneralizedSuffixTree {

    /**
     * The index of the last item that was added to the GST
     */
    private last = 0;
    /**
     * The root of the suffix tree
     */
    private root = new STNode();
    /**
     * The last leaf that was added during the update operation
     */
    private activeLeaf = this.root;

    /**
     * Searches for the given word within the GST.
     *
     * Returns all the indexes for which the key contains the <tt>word</tt> that was
     * supplied as input.
     *
     * @param word the key to search for
     * @return the collection of indexes associated with the input <tt>word</tt>
     */
    public search(word: string) {
        return this.searchWithLimit(word, -1);
    }

    /**
     * Searches for the given word within the GST and returns at most the given number of matches.
     *
     * @param word the key to search for
     * @param results the max number of results to return
     * @return at most <tt>results</tt> values for the given word
     */
    public searchWithLimit(word: string, results: number) {
        const tmpNode = this.searchNode(word);
        if (tmpNode === null) {
            return [];
        }
        return tmpNode.getDataWithLimit(results);
    }

    /**
     * Searches for the given word within the GST and returns at most the given number of matches.
     *
     * @param word the key to search for
     * @param to the max number of results to return
     * @return at most <tt>results</tt> values for the given word
     * @see GeneralizedSuffixTree#ResultInfo
     */
    public searchWithCount(word: string, to: number): ResultInfo {
        const tmpNode = this.searchNode(word);
        if (tmpNode == null) {
            return new ResultInfo([], 0);
        }

        return new ResultInfo([...tmpNode.getDataWithLimit(to)], tmpNode.getResultCount());
    }

    /**
     * Returns the tree node (if present) that corresponds to the given string.
     */
    private searchNode(word: string): STNode | null {
        /*
         * Verifies if exists a path from the root to a node such that the concatenation
         * of all the labels on the path is a superstring of the given word.
         * If such a path is found, the last node on it is returned.
         */
        let currentNode = this.root;
        let currentEdge: STEdge;


        for (let i = 0; i < word.length; ++i) {

            const ch = word.charAt(i);
            // follow the edge corresponding to this char
            currentEdge = currentNode.getEdge(ch);
            if (null == currentEdge) {
                // there is no edge starting with this char
                return null;
            } else {
                const label = currentEdge.getLabel();
                const lenToMatch = Math.min(word.length - i, label.length);

                // if (!word.regionMatches(i, label, 0, lenToMatch)) {
                //     // the label on the edge does not correspond to the one in the string to search
                //     return null;
                // }

                if (!StringUtils.regionMatches(word, i, label, 0, lenToMatch)) {
                    // the label on the edge does not correspond to the one in the string to search
                    return null;
                }

                if (label.length >= word.length - i) {
                    return currentEdge.getDest();
                } else {
                    // advance to next node
                    currentNode = currentEdge.getDest();
                    i += lenToMatch - 1;
                }
            }
        }

        return null;
    }

    /**
     * Adds the specified <tt>index</tt> to the GST under the given <tt>key</tt>.
     *
     * Entries must be inserted so that their indexes are in non-decreasing order,
     * otherwise an IllegalStateException will be raised.
     *
     * @param key the string key that will be added to the index
     * @param index the value that will be added to the index
     * @throws IllegalStateException if an invalid index is passed as input
     */
    public put(key: string, index: number) {

        if (index < this.last) {
            throw new Error("The input index must not be less than any of the previously inserted ones. Got " + index + ", expected at least " + this.last);
        } else {
            this.last = index;
        }

        // reset activeLeaf
        this.activeLeaf = this.root;

        const remainder = key;
        let s = this.root;

        // proceed with tree construction (closely related to procedure in
        // Ukkonen's paper)
        let text = "";
        // iterate over the string, one char at a time

        for (let i = 0; i < remainder.length; i++) {
            // line 6
            text += remainder.charAt(i);
            // use intern to make sure the resulting string is in the pool.
            // text = text.intern();

            // line 7: update the tree with the new transitions due to this new char
            let active = this.update(s, text, remainder.substring(i), index);
            // line 8: make sure the active pair is canonical
            active = this.canonize(active.getFirst(), active.getSecond());

            s = active.getFirst();
            text = active.getSecond();
        }

        // add leaf suffix link, is necessary
        if (null == this.activeLeaf.getSuffix() && this.activeLeaf !== this.root && this.activeLeaf !== s) {
            this.activeLeaf.setSuffix(s);
        }

    }

    /**
     * Tests whether the string stringPart + t is contained in the subtree that has inputs as root.
     * If that's not the case, and there exists a path of edges e1, e2, ... such that
     *     e1.label + e2.label + ... + $end = stringPart
     * and there is an edge g such that
     *     g.label = stringPart + rest
     *
     * Then g will be split in two different edges, one having $end as label, and the other one
     * having rest as label.
     *
     * @param inputs the starting node
     * @param stringPart the string to search
     * @param t the following character
     * @param remainder the remainder of the string to add to the index
     * @param value the value to add to the index
     * @return a pair containing
     *                  true/false depending on whether (stringPart + t) is contained in the subtree starting in inputs
     *                  the last node that can be reached by following the path denoted by stringPart starting from inputs
     *
     */
    private testAndSplit(inputs: STNode, stringPart: string, t: string, remainder: string, value: number): Pair<boolean, STNode> {

        // descend the tree as far as possible
        const ret = this.canonize(inputs, stringPart);
        const s = ret.getFirst();
        const str = ret.getSecond();

        if ("" !== str) {
            const g = s.getEdge(str.charAt(0));

            const label = g.getLabel();
            // must see whether "str" is substring of the label of an edge
            if (label.length > str.length && label.charAt(str.length) === t) {
                return new Pair(true, s);
            } else {
                // need to split the edge
                const newlabel = label.substring(str.length);
                // assert (label.startsWith(str));

                // build a new node
                const r = new STNode();
                // build a new edge
                const newedge = new STEdge(str, r);

                g.setLabel(newlabel);

                // link s -> r
                r.addEdge(newlabel.charAt(0), g);
                s.addEdge(str.charAt(0), newedge);

                return new Pair(false, r);
            }

        } else {
            const e = s.getEdge(t);

            if (null === e) {
                // if there is no t-transtion from s
                return new Pair(false, s);
            } else {

                // if (remainder.equals(e.getLabel())) {
                if (remainder === e.getLabel()) {
                    // update payload of destination node
                    e.getDest().addRef(value);
                    return new Pair(true, s);
                } else if (remainder.startsWith(e.getLabel())) {
                    return new Pair(true, s);
                } else if (e.getLabel().startsWith(remainder)) {
                    // need to split as above
                    const newNode = new STNode();
                    newNode.addRef(value);

                    const newEdge = new STEdge(remainder, newNode);

                    e.setLabel(e.getLabel().substring(remainder.length));

                    newNode.addEdge(e.getLabel().charAt(0), e);

                    s.addEdge(t, newEdge);

                    return new Pair(false, s);
                } else {
                    // they are different words. No prefix. but they may still share some common substr
                    return new Pair(true, s);
                }

            }
        }

    }

    /**
     * Return a (Node, String) (n, remainder) pair such that n is a farthest descendant of
     * s (the input node) that can be reached by following a path of edges denoting
     * a prefix of inputstr and remainder will be string that must be
     * appended to the concatenation of labels from s to n to get inpustr.
     */
    private canonize(s: STNode, inputstr: string): Pair<STNode, string> {

        if ("" === inputstr) {
            return new Pair(s, inputstr);
        } else {
            let currentNode = s;
            let str = inputstr;
            let g = s.getEdge(str.charAt(0));
            // descend the tree as long as a proper label is found
            while (g != null && str.startsWith(g.getLabel())) {
                str = str.substring(g.getLabel().length);
                currentNode = g.getDest();
                if (str.length > 0) {
                    g = currentNode.getEdge(str.charAt(0));
                }
            }

            return new Pair(currentNode, str);
        }
    }

    /**
     * Updates the tree starting from inputNode and by adding stringPart.
     *
     * Returns a reference (Node, String) pair for the string that has been added so far.
     * This means:
     * - the Node will be the Node that can be reached by the longest path string (S1)
     *   that can be obtained by concatenating consecutive edges in the tree and
     *   that is a substring of the string added so far to the tree.
     * - the String will be the remainder that must be added to S1 to get the string
     *   added so far.
     *
     * @param inputNode the node to start from
     * @param stringPart the string to add to the tree
     * @param rest the rest of the string
     * @param value the value to add to the index
     */
    private update(inputNode: STNode, stringPart: string, rest: string, value: number): Pair<STNode, string> {

        let s = inputNode;
        let tempstr = stringPart;
        const newChar = stringPart.charAt(stringPart.length - 1);

        // line 1
        let oldroot = this.root;

        // line 1b
        let ret = this.testAndSplit(s, tempstr.substring(0, tempstr.length - 1), newChar, rest, value);

        let r = ret.getSecond();
        let endpoint = ret.getFirst();

        let leaf: STNode;
        // line 2
        while (!endpoint) {
            // line 3
            const tempEdge = r.getEdge(newChar);
            if (null != tempEdge) {
                // such a node is already present. This is one of the main differences from Ukkonen's case:
                // the tree can contain deeper nodes at this stage because different strings were added by previous iterations.
                leaf = tempEdge.getDest();
            } else {
                // must build a new leaf
                leaf = new STNode();
                leaf.addRef(value);
                const newedge = new STEdge(rest, leaf);
                r.addEdge(newChar, newedge);
            }

            // update suffix link for newly created leaf
            if (this.activeLeaf !== this.root) {
                this.activeLeaf.setSuffix(leaf);
            }
            this.activeLeaf = leaf;

            // line 4
            if (oldroot !== this.root) {
                oldroot.setSuffix(r);
            }

            // line 5
            oldroot = r;

            // line 6
            if (null == s.getSuffix()) { // root node
                // assert (root == s);
                // this is a special case to handle what is referred to as node _|_ on the paper
                tempstr = tempstr.substring(1);
            } else {
                const canret = this.canonize(s.getSuffix()!, this.safeCutLastChar(tempstr));
                s = canret.getFirst();
                // use intern to ensure that tempstr is a reference from the string pool
                // tempstr = (canret.getSecond() + tempstr.charAt(tempstr.length - 1)).intern();
                tempstr = (canret.getSecond() + tempstr.charAt(tempstr.length - 1));
            }

            // line 7
            ret = this.testAndSplit(s, this.safeCutLastChar(tempstr), newChar, rest, value);
            r = ret.getSecond();
            endpoint = ret.getFirst();

        }

        // line 8
        if (oldroot !== this.root) {
            oldroot.setSuffix(r);
        }
        oldroot = this.root;

        return new Pair(s, tempstr);
    }

    getRoot(): STNode {
        return this.root;
    }

    private safeCutLastChar(seq: string): string {

        if (seq.length === 0) {
            return "";
        }
        return seq.substring(0, seq.length - 1);

    }

    public computeCount(): number {
        return this.root.computeAndCacheCount();
    }

}
