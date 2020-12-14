import * as React from "react";
import {useEditorStore} from "../EditorStoreProvider";

export type EditorCursorPosition = 'start' | 'end' | 'within';

export function useEditorCursorPosition() {

    const editor = useEditorStore();

    return React.useCallback((): EditorCursorPosition => {

        if (!editor) {
            throw new Error("No editor");
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

    }, [editor]);

}
