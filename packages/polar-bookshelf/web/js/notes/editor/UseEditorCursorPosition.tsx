import * as React from "react";
import {useEditorStore} from "../EditorStoreProvider";
import IEditor = ckeditor5.IEditor;

export type EditorCursorPosition = 'start' | 'end' | 'within';

export function computeEditorCursorPosition(editor: IEditor) {

    if (!editor) {
        throw new Error("computeEditorCursorPosition: No editor");
    }

    const root = editor.model.document.getRoot();
    const firstPosition = editor?.model.document.selection.getFirstPosition();

    const rootStart = editor.model.createPositionAt(root, 0);
    const rootEnd = editor.model.createPositionAt(root, 'end');

    if (firstPosition && firstPosition.isTouching(rootEnd)) {
        return 'end'
    }

    if (firstPosition && firstPosition.isTouching(rootStart)) {
        return 'start'
    }

    return 'within';

}

export function useEditorCursorPosition() {

    const editor = useEditorStore();

    return React.useCallback((): EditorCursorPosition => {
        return computeEditorCursorPosition(editor!);
    }, [editor]);

}
