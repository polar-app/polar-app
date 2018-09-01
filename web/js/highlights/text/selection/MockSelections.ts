import {NodeTypes} from './NodeTypes';

export class MockSelections {

    /**
     *
     */
    static createSyntheticSelection(start: NodeOffset, end: NodeOffset) {

        let selection = window.getSelection();

        selection.empty();

        let range = document.createRange();

        range.setStart(start.node, start.offset);

        console.log("end.node type is: " + NodeTypes.toSymbol(end.node.nodeType))

        range.setEnd(end.node, end.offset);

        selection.addRange(range);

        return selection;

    }

}

export interface NodeOffset {

    node: Node;
    offset: number;

}
