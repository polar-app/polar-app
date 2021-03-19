import {StringBuffer} from "polar-shared/src/util/StringBuffer";

export namespace CKEditors {

    import IElement = ckeditor5.IElement;
    import IDocumentFragment = ckeditor5.IDocumentFragment;
    import INode = ckeditor5.INode;
    import IText = ckeditor5.IText;

    /**
     * @Deprecated - I don't think I need this because CKEditor will give me the
     * raw HTML but I would need to figure out where in the HTML the anchor is
     * located.
     */
    export function toOuterHTML(node: INode | IElement |  IDocumentFragment): string {

        const buff = new StringBuffer();

        function isTextNode(node: INode): node is IText {
            return node.is('$text');
        }

        function isElement(node: INode): node is IElement {
            return node.is('element');
        }

        function isDocumentFragment(node: INode): node is IElement {
            return node.is('documentFragment');
        }

        if (isTextNode(node)) {
            buff.append(node.data)
        } else if (isElement(node)) {

            buff.append(`<${node.name}`);

            // don't I need to escape the attributes..?
            for (const attr of node.getAttributes()) {
                buff.append(` ${attr[0]}="${attr[1]}"`)
            }

            buff.append(`>`);

            for (const child of node.getChildren()) {
                buff.append(toOuterHTML(child));
            }

            buff.append(`</${node.name}>`);

        } else if (isDocumentFragment(node)) {
            for (const child of node.getChildren()) {
                buff.append(toOuterHTML(child));
            }
        }

        return buff.toString();

    }

}