import * as React from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import {NoteIDStr, useNotesStoreCallbacks, useNotesStore} from "./NotesStore";
import {useRefValue} from "../hooks/ReactHooks";
import { deepMemo } from '../react/ReactUtils';
import {useComponentWillUnmount} from "../hooks/ReactLifecycleHooks";
import { useEditorStore } from './EditorStoreProvider';
import {ckeditor5} from "../../../apps/stories/impl/ckeditor5/CKEditor5BalloonEditor";
import IEventData = ckeditor5.IEventData;
import IKeyPressEvent = ckeditor5.IKeyPressEvent;

interface IProps {
    readonly parent: NoteIDStr;
    readonly id: NoteIDStr;
    readonly children: JSX.Element;
}

/**
 * Listen to the active note in the store and only fire when WE are active.
 */
function useNoteActivatedListener(id: NoteIDStr) {

    const lastActiveRef = React.useRef<NoteIDStr | undefined>();

    const {active} = useNotesStore(['active'], {filter: store => (lastActiveRef.current === id || store.active === id) && lastActiveRef.current !== store.active});

    lastActiveRef.current = active;

    return lastActiveRef.current === id;

    // const {active} = useNotesStore(['active'], {filter: store => store.active === id});
    // return active === id;

}

export const NoteNavigation = deepMemo(function NoteNavigation(props: IProps) {

    const editor = useEditorStore();

    const noteActive = useNoteActivatedListener(props.id);
    const {createNewNote, setActive, navPrev, navNext, doIndent} = useNotesStoreCallbacks();

    const [ref, setRef] = React.useState<HTMLDivElement | null>(null);

    const handleClickAway = React.useCallback(() => {
        // noop for now
    }, []);

    const editorFocus = React.useCallback(() => {
        editor!.editing.view.focus();
    }, [editor]);

    const jumpToEditorStart = React.useCallback(() => {

        if (! editor) {
            return;
        }

        const doc = editor.model.document;

        // https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_model_document-Document.html#function-getRoot
        const root = doc.getRoot();

        editor.model.change((writer: any) => {
            writer.setSelection(root, 0)
        });

    }, [editor]);

    React.useEffect(() => {

        if (editor !== undefined) {

            if (noteActive) {
                editorFocus();
                jumpToEditorStart();

            } else {
                // different editor
            }

        } else {
            console.log("No editor: ")
        }

    }, [editor, editorFocus, jumpToEditorStart, noteActive, props.id]);

    const handleClick = React.useCallback(() => {
        setActive(props.id);
    }, [props.id, setActive]);

    const handleEditorKeyDown = React.useCallback((eventData: IEventData, event: IKeyPressEvent) => {

        function abortEvent() {
            event.domEvent.stopPropagation();
            event.domEvent.preventDefault();
            eventData.stop();
        }

        switch (event.domEvent.key) {

            case 'ArrowUp':
                abortEvent();

                navPrev();

                break;

            case 'ArrowDown':

                abortEvent();

                navNext();

                break;

            case 'Tab':
                abortEvent();

                doIndent(props.id, props.parent);
                break;

            default:
                break;

        }

    }, [doIndent, navNext, navPrev, props.id, props.parent]);

    const handleEditorEnter = React.useCallback((eventData: IEventData, event: IKeyPressEvent) => {
        eventData.stop();
        createNewNote(props.parent, props.id);
    }, [createNewNote, props.id, props.parent]);

    React.useEffect(() => {

        if (editor) {

            // *** off first
            editor.editing.view.document.off('keydown', handleEditorKeyDown);
            editor.editing.view.document.off('enter', handleEditorEnter);

            // *** then on
            editor.editing.view.document.on('keydown', handleEditorKeyDown);
            editor.editing.view.document.on('enter', handleEditorEnter);

        } else {
            // console.warn("No editor");
        }

    }, [editor, handleEditorEnter, handleEditorKeyDown]);

    useComponentWillUnmount(() => {
        if (editor) {
            editor.editing.view.document.off('keydown', handleEditorKeyDown);
            editor.editing.view.document.off('enter', handleEditorEnter);
        }
    });

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <div ref={setRef} onClick={handleClick}>
                {ref !== null && props.children}
            </div>
        </ClickAwayListener>
    );

});
