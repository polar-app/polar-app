import * as React from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { useEditorStore } from './EditorStoreProvider';
import IEventData = ckeditor5.IEventData;
import IKeyPressEvent = ckeditor5.IKeyPressEvent;
import IIterable = ckeditor5.IIterable;
import {useEditorCursorPosition} from "./editor/UseEditorCursorPosition";
import { useNoteNavigationEnterHandler } from './NoteNavigationEnter';
import {useLifecycleTracer} from "../hooks/ReactHooks";
import {NavOpts, NoteIDStr, useNotesStore} from "./store/NotesStore";
import { observer } from "mobx-react-lite"
import { NoteActivation } from './NoteActivation';

interface IProps {
    readonly parent: NoteIDStr | undefined;
    readonly id: NoteIDStr;
    readonly children: JSX.Element;
}

export const NoteNavigation = observer(function NoteNavigation(props: IProps) {

    // useLifecycleTracer('NoteNavigation', {id: props.id});

    const store = useNotesStore();
    const editor = useEditorStore();

    const [ref, setRef] = React.useState<HTMLDivElement | null>(null);

    const hasActiveSelectionRef = React.useRef(false);

    const getEditorCursorPosition = useEditorCursorPosition();
    const handleEditorEnter = useNoteNavigationEnterHandler({parent: props.parent, id: props.id});

    const handleClickAway = React.useCallback(() => {
        // noop for now
    }, []);

    // TODO move to editor hook

    // TODO move to editor hook

    const handleClick = React.useCallback(() => {
        store.setActiveWithPosition(props.id, undefined);
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

        const opts: NavOpts = {
            shiftKey: event.domEvent.shiftKey
        }

        switch (event.domEvent.key) {

            case 'ArrowUp':

                abortEvent();
                store.navPrev('start', opts);
                break;

            case 'ArrowDown':

                abortEvent();
                store.navNext('start', opts);
                break;

            case 'ArrowLeft':

                if (editorCursorPosition === 'start') {
                    abortEvent();
                    store.navPrev('end', opts);
                }

                break;

            case 'ArrowRight':

                if (editorCursorPosition === 'end') {
                    abortEvent();
                    store.navNext('start', opts);
                }

                break;

            case 'Tab':

                if (props.parent !== undefined) {

                    abortEvent();

                    if (event.domEvent.shiftKey) {
                        store.doUnIndent(props.id);
                    } else {
                        store.doIndent(props.id);
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

                if (editorCursorPosition === 'start') {

                    // we're at the beginning of a note...

                    const mergeTarget = store.canMerge(props.id);

                    if (mergeTarget) {
                        store.mergeNotes(mergeTarget.target, mergeTarget.source);
                    }

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
        <>
            <NoteActivation id={props.id}/>
            <ClickAwayListener onClickAway={handleClickAway}>
                <div ref={setRef} onClick={handleClick}>
                    {ref !== null && props.children}
                </div>
            </ClickAwayListener>
        </>
    );

});
