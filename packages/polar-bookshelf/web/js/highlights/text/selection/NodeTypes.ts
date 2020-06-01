export class NodeTypes {

    static toSymbol(nodeType: number): string | undefined {

        let nodeTypes = [
            { name: "ELEMENT", value: Node.ELEMENT_NODE},
            { name: "TEXT", value: Node.TEXT_NODE},
            { name: "PROCESSING_INSTRUCTION", value: Node.PROCESSING_INSTRUCTION_NODE},
            { name: "COMMENT", value: Node.COMMENT_NODE},
            { name: "DOCUMENT", value: Node.DOCUMENT_NODE},
            { name: "DOCUMENT_FRAGMENT", value: Node.DOCUMENT_FRAGMENT_NODE},
            { name: "DOCUMENT_TYPE", value: Node.DOCUMENT_TYPE_NODE},
        ];

        for (let idx = 0; idx < nodeTypes.length; idx++) {

            let currentType = nodeTypes[idx];

            if(currentType.value === nodeType) {
                return currentType.name;
            }

        }

        return undefined;

    }

}
