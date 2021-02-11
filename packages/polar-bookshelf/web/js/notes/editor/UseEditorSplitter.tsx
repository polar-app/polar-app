import * as React from "react";
import {useEditorStore} from "../EditorStoreProvider";
import IEditor = ckeditor5.IEditor;
import {HTMLToMarkdown} from "polar-markdown-parser/src/HTMLToMarkdown";
import html2markdown = HTMLToMarkdown.html2markdown;

interface IEditorSplit {
    readonly prefix: string;
    readonly suffix: string;
}

/**
 * Takes the active cursor position, and splits the editor into before and after HTML.
 */
export type EditorSplitter = () => IEditorSplit;

export function doEditorSplit(editor: IEditor): IEditorSplit {

    if (! editor) {
        throw new Error("doEditorSplit: No editor");
    }

    interface Cursor {
        readonly container: Node;
        readonly offset: number;
    }

    function computeCursorFromSelection(): Cursor | undefined {

        const selection = window.getSelection();

        if (selection) {

            const range = selection.getRangeAt(0);

            return {
                container: range.startContainer,
                offset: range.startOffset
            }
        }

        return undefined;

    }

    function fragmentToHTML(fragment: DocumentFragment): string {

        const div = document.createElement('div');
        div.append(fragment);

        return div.innerHTML;

    }

    const root = editor.editing.view.getDomRoot();
    const cursor = computeCursorFromSelection();

    if (! cursor) {
        throw new Error("No cursor");
    }

    function rangeToHTML(range: Range) {
        const contents = range.cloneContents();
        return fragmentToHTML(contents);
    }

    function computePrefix() {
        const range = document.createRange();
        range.setStart(root, 0);
        range.setEnd(cursor!.container, cursor!.offset);
        return rangeToHTML(range);
    }

    function computeSuffix() {
        const range = document.createRange();
        range.setStart(cursor!.container, cursor!.offset);
        range.setEndAfter(root.firstChild!);
        return rangeToHTML(range);
    }

    const prefix = html2markdown(computePrefix());
    const suffix = html2markdown(computeSuffix());

    return {
        prefix,
        suffix
    }

}

export function useEditorSplitter(): EditorSplitter {

    const editor = useEditorStore();

    // split the editor at the cursor and return two HTML chunks (prefix and
    // suffix)
    return React.useCallback((): IEditorSplit => {

        if (! editor) {
            throw new Error("useEditorSplitter: No editor");
        }

        return doEditorSplit(editor);

    }, [editor])

}
