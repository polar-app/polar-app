export interface MutableNodeTextRegion {
    readonly nodeID: number;
    readonly start: number;

    /**
     * End of the region (inclusive)
     */
    readonly end: number;
    readonly node: Node;
}


export interface NodeTextRegion extends Readonly<MutableNodeTextRegion> {
}
