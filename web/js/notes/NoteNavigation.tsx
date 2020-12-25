import * as React from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { useEditorStore } from './EditorStoreProvider';
import IEventData = ckeditor5.IEventData;
import IKeyPressEvent = ckeditor5.IKeyPressEvent;
import IWriter = ckeditor5.IWriter;
import IIterable = ckeditor5.IIterable;
import {useEditorCursorPosition} from "./editor/UseEditorCursorPosition";
import { useNoteNavigationEnterHandler } from './NoteNavigationEnter';
import {useLifecycleTracer} from "../hooks/ReactHooks";
import {NoteIDStr, useNotesStore} from "./NotesStore2";
import { observer } from "mobx-react-lite"

interface IProps {
    readonly parent: NoteIDStr | undefined;
    readonly id: NoteIDStr;
    readonly children: JSX.Element;
}

function useNoteActivation(id: NoteIDStr) {

    useLifecycleTracer('useNoteActivation', {id});

    const editor = useEditorStore();

    const store = useNotesStore();
    const noteActivated = store.getNoteActivated(id);

    const hasFocusRef = React.useRef(true);

    const jumpToEditorRootPosition = React.useCallback((offset: number | 'before' | 'end') => {

        if (! editor) {
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

                if (! hasFocusRef.current) {

                    editorFocus();

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
            // console.log("No editor: ")
        }

    }, [editor, editorFocus, jumpToEditorEndPosition, jumpToEditorStartPosition, noteActivated, id]);

}

export const NoteNavigation = observer(function NoteNavigation(props: IProps) {

    useLifecycleTracer('NoteNavigation', {id: props.id});

    const store = useNotesStore();
    const editor = useEditorStore();

    useNoteActivation(props.id);

    const [ref, setRef] = React.useState<HTMLDivElement | null>(null);

    const hasActiveSelectionRef = React.useRef(false);

    const getEditorCursorPosition = useEditorCursorPosition();
    const handleEditorEnter = useNoteNavigationEnterHandler({parent: props.parent, id: props.id});

    const handleClickAway = React.useCallback(() => {
        // noop for now
    }, []);

    // TODO move to editor hook

    interface IEditorSplit {
        readonly prefix: string;
        readonly suffix: string;
    }

    // TODO move to editor hook

    // Split the editor at the cursor and return two HTML chunks (prefix and suffix)
    const splitEditorAtCursor = React.useCallback((): IEditorSplit => {

        if (! editor) {
            throw new Error("No editor");
        }

        const root = editor.model.document.getRoot();
        const firstPosition = editor?.model.document.selection.getFirstPosition();

        const rootStart = editor.model.createPositionAt(root, 0);
        const rootEnd = editor.model.createPositionAt(root, 'end');


        return null!;

    }, [editor])

    const handleClick = React.useCallback(() => {
        store.setActive(props.id);
    }, [props.id, store]);

    const handleEditorSelection = React.useCallback((eventData: IEventData, event: IKeyPressEvent) => {

        if (! editor) {
            return;
        }

        function toArray<T>(iterable: IIterable<T>): ReadonlyArray<T> {

            const result = [];

            for(const value of iterable) {
                result.push(value);
            }

            return result;

        }

        const range = toArray(editor.model.document.selection.getRanges())[0]

        hasActiveSelectionRef.current = ! range.isCollapsed;

    }, [editor]);

    const handleEditorKeyDown = React.useCallback((eventData: IEventData, event: IKeyPressEvent) => {

        function abortEvent() {
            event.domEvent.stopPropagation();
            event.domEvent.preventDefault();
            eventData.stop();
        }

        const editorCursorPosition = getEditorCursorPosition();

        switch (event.domEvent.key) {

            case 'ArrowUp':

                abortEvent();
                store.navPrev('start');
                break;

            case 'ArrowDown':

                abortEvent();
                store.navNext('start');
                break;

            case 'ArrowLeft':

                if (editorCursorPosition === 'start') {
                    abortEvent();
                    store.navPrev('end');
                }

                break;

            case 'ArrowRight':

                if (editorCursorPosition === 'end') {
                    abortEvent();
                    store.navNext('start');
                }

                break;

            case 'Tab':

                if (props.parent !== undefined) {

                    abortEvent();

                    if (event.domEvent.shiftKey) {
                        store.doUnIndent(props.id, props.parent);
                    } else {
                        store.doIndent(props.id, props.parent);
                    }

                }

                break;

            case 'Backspace':

                // TODO: backspace handling when there's an active selection
                // doesn't work. the issue is that by the time we get the event
                // click, the selection is removed.  One solution to fix this
                // would be to trace EVERY key so that we know that there WAS an
                // active selection as the we received no other key between
                // clicking and the selection.

                if (hasActiveSelectionRef.current) {
                    return;
                }

                // TODO: only do this if there aren't any modifiers I think...
                if (props.parent !== undefined && store.noteIsEmpty(props.id)) {

                    abortEvent();
                    store.doDelete([props.id]);

                }

                break;

            default:
                break;

        }

    }, [getEditorCursorPosition, props.id, props.parent, store]);

    React.useEffect(() => {

        if (! editor) {
            return;
        }

        function subscribe() {
            editor!.model.document.selection.on('change', handleEditorSelection);
            editor!.editing.view.document.on('keydown', handleEditorKeyDown);
            editor!.editing.view.document.on('enter', handleEditorEnter);
        }

        function unsubscribe() {
            if (editor) {
                editor!.model.document.selection.off('change', handleEditorSelection);
                editor.editing.view.document.off('keydown', handleEditorKeyDown);
                editor.editing.view.document.off('enter', handleEditorEnter);
            } else {
                console.warn("No editor in unsubscribe");
            }
        }

        unsubscribe();
        subscribe();

        return unsubscribe;

    }, [editor, handleEditorEnter, handleEditorKeyDown, handleEditorSelection]);

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <div ref={setRef} onClick={handleClick}>
                {ref !== null && props.children}
            </div>
        </ClickAwayListener>
    );

});
