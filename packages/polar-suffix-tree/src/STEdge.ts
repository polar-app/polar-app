import { STNode } from "./STNode";

/**
 * Represents an Edge in the Suffix Tree.
 * It has a label and a destination Node
 */
export class STEdge {

    constructor(private readonly label: string,
                private readonly dest: STNode) {
    }

    public getLabel(): string {
        return this.label;
    }

    public setLabel(label: string) {
        this.label = label;
    }

    public getDest(): STNode {
        return this.dest;
    }

    public setDest(dest: STNode) {
        this.dest = dest;
    }

}
