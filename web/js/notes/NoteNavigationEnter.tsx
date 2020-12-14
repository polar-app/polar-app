import * as React from "react";
import {NewNotePosition, NoteIDStr, useNotesStoreCallbacks} from "./NotesStore";
import IEventData = ckeditor5.IEventData;
import IKeyPressEvent = ckeditor5.IKeyPressEvent;
import {useEditorCursorPosition} from "./editor/UseEditorCursorPosition";
import {useEditorSplitter} from "./editor/UseEditorSplitter";

interface IOpts {
    readonly parent: NoteIDStr | undefined;
    readonly id: NoteIDStr;
}

export function useNoteNavigationEnterHandler(opts: IOpts) {

    const {parent, id} = opts;

    const {createNewNote} = useNotesStoreCallbacks();
    const getEditorCursorPosition = useEditorCursorPosition();
    const editorSplitter = useEditorSplitter();

    return React.useCallback((eventData: IEventData, event: IKeyPressEvent) => {

        eventData.stop();

        // FIXME: handle meta/shift/control

        // FIXME: to split the node we need to call

        // writer.split at firstPosition
        // create a selection from the firstPosition to the end of the document root
        // getSelectedContent on the selection
        // deleteContent on that selection
        // create a new node with the DocumentFragment as markdown...

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
                createNewNote(parent, id, pos, editorSplit);
                return;
            }

            createNewNote(parent, id, pos);

        } else {
            createNewNote(id, undefined, 'before');
        }

    }, [createNewNote, editorSplitter, getEditorCursorPosition, id, parent]);

}