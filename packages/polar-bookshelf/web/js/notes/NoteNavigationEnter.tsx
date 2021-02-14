import * as React from "react";
import IEventData = ckeditor5.IEventData;
import IKeyPressEvent = ckeditor5.IKeyPressEvent;
import {useEditorSplitter} from "./editor/UseEditorSplitter";
import { useEditorSetContent } from "./editor/UseEditorSetContent";
import {NoteIDStr, useNotesStore } from "./store/NotesStore";
import {MarkdownToHTML} from "polar-markdown-parser/src/MarkdownToHTML";
import markdown2html = MarkdownToHTML.markdown2html;

interface IOpts {
    readonly parent: NoteIDStr | undefined;
    readonly id: NoteIDStr;
}

export function useNoteNavigationEnterHandler(opts: IOpts) {

    const {parent, id} = opts;

    const store = useNotesStore();

    const editorSplitter = useEditorSplitter();
    const editorSetContent = useEditorSetContent();

    return React.useCallback((eventData: IEventData, event: IKeyPressEvent) => {

        eventData.stop();

        const editorSplit = editorSplitter();
        editorSetContent(markdown2html(editorSplit.prefix));
        store.createNewNote(id, editorSplit);

    }, [editorSetContent, editorSplitter, id, store]);

}
