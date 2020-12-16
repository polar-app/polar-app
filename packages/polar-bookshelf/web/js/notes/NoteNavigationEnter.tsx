import * as React from "react";
import {NewNotePosition, NoteIDStr, useNotesStoreCallbacks} from "./NotesStore";
import IEventData = ckeditor5.IEventData;
import IKeyPressEvent = ckeditor5.IKeyPressEvent;
import {useEditorCursorPosition} from "./editor/UseEditorCursorPosition";
import {useEditorSplitter} from "./editor/UseEditorSplitter";
import { useEditorSetContent } from "./editor/UseEditorSetContent";

interface IOpts {
    readonly parent: NoteIDStr | undefined;
    readonly id: NoteIDStr;
}

export function useNoteNavigationEnterHandler(opts: IOpts) {

    const {parent, id} = opts;

    const {createNewNote} = useNotesStoreCallbacks();
    const getEditorCursorPosition = useEditorCursorPosition();
    const editorSplitter = useEditorSplitter();
    const editorSetContent = useEditorSetContent();

    return React.useCallback((eventData: IEventData, event: IKeyPressEvent) => {

        eventData.stop();

        // FIXME: handle meta/shift/control

        if (parent) {

            function computeNewNotePosition(): NewNotePosition {

                const cursorPosition = getEditorCursorPosition();

                switch (cursorPosition) {

                    case "start":
                        return 'before';

                    case "end":
                        return 'after';

                    case "within":
                        return 'split';

                }

            }

            const pos = computeNewNotePosition();

            if (pos === 'split') {
                const editorSplit = editorSplitter();
                editorSetContent(editorSplit.prefix);
                createNewNote(parent, id, pos, editorSplit);
                return;
            }

            createNewNote(parent, id, pos);

        } else {
            createNewNote(id, undefined, 'before');
        }

    }, [createNewNote, editorSetContent, editorSplitter, getEditorCursorPosition, id, parent]);

}