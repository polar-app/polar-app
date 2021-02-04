import {NoteIDStr, useNotesStore} from "./store/NotesStore";
import {useLifecycleTracer} from "../hooks/ReactHooks";
import {useEditorStore} from "./EditorStoreProvider";
import * as React from "react";
import IWriter = ckeditor5.IWriter;

export function useNoteActivation(id: NoteIDStr) {

    // useLifecycleTracer('useNoteActivation', {id});

    const editor = useEditorStore();
    const store = useNotesStore();

    // const [noteActivated, setNoteActivated] = React.useState<INoteActivated | undefined>();

    // autorun(() => {
    //     setNoteActivated(store.getNoteActivated(id))
    // });

    const noteActivated = store.getNoteActivated(id);

    const hasFocusRef = React.useRef(true);

    const jumpToEditorRootPosition = React.useCallback((offset: number | 'before' | 'end') => {

        if (!editor) {
            return;
        }

        const doc = editor.model.document;

        // https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_model_document-Document.html#function-getRoot
        const root = doc.getRoot();

        editor.model.change((writer: IWriter) => {
            writer.setSelection(root, offset)
        });

    }, [editor]);

    const jumpToEditorStartPosition = React.useCallback(() => {
        jumpToEditorRootPosition(0);
    }, [jumpToEditorRootPosition]);

    const jumpToEditorEndPosition = React.useCallback(() => {
        jumpToEditorRootPosition('end');
    }, [jumpToEditorRootPosition]);

    const editorFocus = React.useCallback(() => {
        editor!.editing.view.focus();
    }, [editor]);

    React.useEffect(() => {

        if (editor !== undefined) {

            if (noteActivated) {

                if (!hasFocusRef.current) {

                    // FIXME: move this to the store so that all manipulation of
                    // the editors is done there too.

                    editorFocus();

                    // console.log("Focusing editor for note: " + id, noteActivated.note.content)

                    switch (noteActivated.activePos) {
                        case "start":
                            jumpToEditorStartPosition();
                            break;
                        case "end":
                            jumpToEditorEndPosition();
                            break;
                    }

                    hasFocusRef.current = true;

                }

            } else {
                // we are no longer active.
                hasFocusRef.current = false;
            }

        } else {
            // console.warn("Can not focus - no editor: " + id);
        }

    }, [editor, editorFocus, jumpToEditorEndPosition, jumpToEditorStartPosition, noteActivated, id]);

}
