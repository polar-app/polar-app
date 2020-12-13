import * as React from "react";
import {useEditorStore} from "../EditorStoreProvider";
import {TreeWalker} from "@ckeditor/ckeditor5-engine/src/view/treewalker";
import IRange = ckeditor5.IRange;
import {StringBuffer} from "polar-shared/src/util/StringBuffer";
import IElement = ckeditor5.IElement;
import ITextProxy = ckeditor5.ITextProxy;

interface IEditorSplit {
    readonly prefix: string;
    readonly suffix: string;
}

/**
 * Takes the active cursor position, and splits the editor into before and after HTML.
 */
export type EditorSplitter = () => IEditorSplit;

export function useEditorSplitter(): EditorSplitter {

    const editor = useEditorStore();

    // Split the editor at the cursor and return two HTML chunks (prefix and suffix)
    return React.useCallback((): IEditorSplit => {

        if (! editor) {
            throw new Error("No editor");
        }

        const root = editor.model.document.getRoot();
        const firstPosition = editor?.model.document.selection.getFirstPosition();

        if (! firstPosition) {
            throw new Error("No first position");
        }

        const rootStart = editor.model.createPositionAt(root, 0);
        const rootEnd = editor.model.createPositionAt(root, 'end');


        function toHTML(boundaries: IRange) {

            const treeWalker = new TreeWalker({
                direction: 'forward',
                shallow: false,
                singleCharacters: false,
                ignoreElementEnd: false,
                boundaries

            });

            const buff = new StringBuffer();

            function handleElementStart(element: IElement) {

                buff.append(`<${element.name}`);

                for (const attr of element.getAttributes()) {
                    buff.append(` ${attr[0]}="${attr[1]}"`)
                }

            }

            function handleElementEnd(element: IElement) {
                buff.append(`</${element.name}>`);
            }

            function handleText(node: ITextProxy) {
                buff.append(node.data);
            }

            for (const current of treeWalker) {

                switch(current.type) {

                    case 'elementStart':
                        handleElementStart(current.item as IElement);
                        break;

                    case 'elementEnd':
                        handleElementEnd(current.item as IElement);
                        break;

                    case 'character':
                        handleText(current.item as ITextProxy)
                        break;

                    case 'text':
                        handleText(current.item as ITextProxy)
                        break;

                }

            }

            return buff.toString();

        }

        const prefix = toHTML(editor.model.createRange(rootStart, firstPosition));
        const suffix = toHTML(editor.model.createRange(firstPosition, rootEnd));

        return {prefix, suffix}

    }, [editor])

}
