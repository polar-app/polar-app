import * as React from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import {NoteIDStr, useNotesStoreCallbacks, useNotesStore, NavPosition, NewNotePosition} from "./NotesStore";
import { deepMemo } from '../react/ReactUtils';
import {useComponentWillUnmount} from "../hooks/ReactLifecycleHooks";
import { useEditorStore } from './EditorStoreProvider';
import {ckeditor5} from "../../../apps/stories/impl/ckeditor5/CKEditor5BalloonEditor";
import IEventData = ckeditor5.IEventData;
import IKeyPressEvent = ckeditor5.IKeyPressEvent;
import IWriter = ckeditor5.IWriter;
import IPosition = ckeditor5.IPosition;
import { useRefValue } from '../hooks/ReactHooks';
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

interface IProps {
    readonly parent: NoteIDStr | undefined;
    readonly id: NoteIDStr;
    readonly children: JSX.Element;
}

interface INoteActivated {
    readonly id: NoteIDStr;
    readonly activePos: NavPosition;
}

/**
 * Listen to the active note in the store and only fire when WE are active.
 */
function useNoteActivatedListener(id: NoteIDStr): INoteActivated | undefined {

    const lastActiveRef = React.useRef<NoteIDStr | undefined>();

    const {active, activePos} = useNotesStore(['active', 'activePos'], {
        filter: store => (lastActiveRef.current === id || store.active === id) && lastActiveRef.current !== store.active
    });

    lastActiveRef.current = active;

    if (lastActiveRef.current === id) {
        return {
            id,
            activePos
        }
    }

    return undefined;

}

export const NoteNavigation = deepMemo(function NoteNavigation(props: IProps) {

    const editor = useEditorStore();

    const noteActive = useNoteActivatedListener(props.id);

    const {createNewNote, setActive, navPrev, navNext, doIndent, doUnIndent, noteIsEmpty, doDelete} = useNotesStoreCallbacks();

    const [ref, setRef] = React.useState<HTMLDivElement | null>(null);

    const handleClickAway = React.useCallback(() => {
        // noop for now
    }, []);

    const editorFocus = React.useCallback(() => {
        editor!.editing.view.focus();
    }, [editor]);

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

    type CursorPosition = 'start' | 'end';

    const getEditorCursorPosition = React.useCallback((): CursorPosition | undefined => {

        if (! editor) {
            return undefined;
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

        return undefined;

    }, [editor])


    const getEditorHasActiveSelection = React.useCallback((): boolean => {

        if (! editor) {
            return false;
        }

        function debugPosition(position: IPosition | null) {

            if (position) {
                console.log("FIXME: parent ", position.parent);
                console.log("FIXME: offset ", position.offset);

            } else {
                console.log("FIXME: none")
            }

        }

        console.log("FIXME selection range count: " + editor.model.document.selection.rangeCount)
        console.log("FIXME selection ranges: " , editor.model.document.selection.getRanges())

        console.log("FIXME selection ranges: " , editor.model.document.selection.getRanges())

        for (const range of editor.model.document.selection.getRanges()) {
            console.log("FIXME: range is collapsed: ", range.isCollapsed)
        }

        // console.log("FIXME selection range count: " + editor.model.document.selection.)

        console.log("FIXME: first position: ");
        debugPosition(editor.model.document.selection.getFirstPosition());

        console.log("FIXME: last position: ", );
        debugPosition(editor.model.document.selection.getLastPosition());

        return false;

    }, [editor])

    React.useEffect(() => {

        if (editor !== undefined) {

            if (noteActive) {
                editorFocus();

                switch (noteActive.activePos) {
                    case "start":
                        jumpToEditorStartPosition();
                        break;
                    case "end":
                        jumpToEditorEndPosition();
                        break;
                }

            } else {
                // different editor
            }

        } else {
            // console.log("No editor: ")
        }

    }, [editor, editorFocus, jumpToEditorEndPosition, jumpToEditorStartPosition, noteActive, props.id]);

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
                navPrev('start');
                break;

            case 'ArrowDown':
                abortEvent();
                navNext('start');
                break;

            case 'ArrowLeft':

                if (getEditorCursorPosition() === 'start') {
                    abortEvent();
                    navPrev('end');
                }

                break;

            case 'ArrowRight':

                if (getEditorCursorPosition() === 'end') {
                    abortEvent();
                    navNext('start');
                }

                break;

            case 'Tab':

                if (props.parent !== undefined) {

                    abortEvent();

                    if (event.domEvent.shiftKey) {
                        doUnIndent(props.id, props.parent);
                    } else {
                        doIndent(props.id, props.parent);
                    }

                }

                break;

            case 'Backspace':

                getEditorHasActiveSelection();

                function hasActiveSelection() {
                    const selection = window.getSelection();

                    if (selection) {

                        if (selection.rangeCount >= 1) {
                            const range = selection.getRangeAt(0);
                            const contents = range.cloneContents();

                            const div = document.createElement('div');
                            div.append(contents);

                            console.log("FIXME: : "+ div.innerHTML);

                            return div.innerHTML.trim() !== '';

                        }

                    }

                    return false;

                }

                // TODO: only do this if there aren't any modifiers I think...
                if (props.parent !== undefined && noteIsEmpty(props.id)) {

                    if (! hasActiveSelection()) {
                        abortEvent();
                        doDelete([{parent: props.parent, id: props.id}]);
                    }

                }

                break;

            default:
                break;

        }

    }, [doDelete, doIndent, doUnIndent, getEditorCursorPosition, getEditorHasActiveSelection, navNext, navPrev, noteIsEmpty, props.id, props.parent]);

    const handleEditorEnter = React.useCallback((eventData: IEventData, event: IKeyPressEvent) => {

        eventData.stop();

        // FIXME: handle meta/shift/control

        // FIXME: to split the node we need to call

        // writer.split at firstPosition
        // create a selection from the firstPosition to the end of the document root
        // getSelectedContent on the selection
        // deleteContent on that selection
        // create a new node with the DocumentFragment as markdown...

        if (props.parent) {

            function computeNewNotePosition(): NewNotePosition {
                const cursorPosition = getEditorCursorPosition();

                switch (cursorPosition) {

                    case "start":
                        return 'before';

                    case "end":
                        return 'after';

                }

                return 'after';

            }

            const pos = computeNewNotePosition();

            createNewNote(props.parent, props.id, pos);

        } else {
            createNewNote(props.id, undefined, 'before');
        }

    }, [createNewNote, getEditorCursorPosition, props.id, props.parent]);

    React.useEffect(() => {

        if (! editor) {
            return;
        }

        function subscribe() {
            editor!.editing.view.document.on('keydown', handleEditorKeyDown);
            editor!.editing.view.document.on('enter', handleEditorEnter);
        }

        function unsubscribe() {
            if (editor) {
                editor.editing.view.document.off('keydown', handleEditorKeyDown);
                editor.editing.view.document.off('enter', handleEditorEnter);
            } else {
                console.warn("No editor in unsubscribe");
            }
        }

        unsubscribe();
        subscribe();

        return unsubscribe;

    }, [editor, handleEditorEnter, handleEditorKeyDown]);

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <div ref={setRef} onClick={handleClick}>
                {ref !== null && props.children}
            </div>
        </ClickAwayListener>
    );

});
