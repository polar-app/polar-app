import * as React from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import IEventData = ckeditor5.IEventData;
import IKeyPressEvent = ckeditor5.IKeyPressEvent;
import { useNoteNavigationEnterHandler } from './NoteNavigationEnter';
import {NavOpts, NoteIDStr, useNotesStore} from "./store/NotesStore";
import { observer } from "mobx-react-lite"
import { NoteActivation } from './NoteActivation';

interface IProps {
    readonly parent: NoteIDStr | undefined;
    readonly id: NoteIDStr;
    readonly children: JSX.Element;
}

export const NoteNavigation = observer(function NoteNavigation(props: IProps) {

    const store = useNotesStore();

    const [ref, setRef] = React.useState<HTMLDivElement | null>(null);

    const hasActiveSelectionRef = React.useRef(false);

    const handleEditorEnter = useNoteNavigationEnterHandler({parent: props.parent, id: props.id});

    const handleClickAway = React.useCallback(() => {
        // noop for now
    }, []);

    // TODO move to editor hook

    // TODO move to editor hook

    const handleClick = React.useCallback(() => {
        store.setActiveWithPosition(props.id, undefined);
    }, [props.id, store]);

    //
    // const handleEditorSelection = React.useCallback((eventData: IEventData, event: IKeyPressEvent) => {
    //
    //     function toArray<T>(iterable: IIterable<T>): ReadonlyArray<T> {
    //
    //         const result = [];
    //
    //         for(const value of iterable) {
    //             result.push(value);
    //         }
    //
    //         return result;
    //
    //     }
    //
    //     const range = Arrays.first(toArray(editor.model.document.selection.getRanges()));
    //
    //     if (range) {
    //         hasActiveSelectionRef.current = ! range.isCollapsed;
    //     }
    //
    // }, [editor]);
    //

    const hasEditorSelection = React.useCallback((): boolean => {

        const selection = window.getSelection();

        if (selection) {
            const range = selection.getRangeAt(0);
            return range.cloneContents().textContent !== '';
        } else {
            return false;
        }

    }, []);

    const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {

        function abortEvent() {
            event.stopPropagation();
            event.preventDefault();
        }

        // const editorCursorPosition = getEditorCursorPosition();


        switch (event.key) {

            case 'Tab':

                if (props.parent !== undefined) {

                    abortEvent();

                    if (event.shiftKey) {
                        store.doUnIndent(props.id);
                    } else {
                        store.doIndent(props.id);
                    }

                }

                break;

            default:
                break;

        }

    }, [props.id, props.parent, store]);

    return (
        <>
            <NoteActivation id={props.id}/>
            <ClickAwayListener onClickAway={handleClickAway}>
                <div style={{flexGrow: 1}}
                     ref={setRef}
                     onKeyDown={handleKeyDown}
                     onClick={handleClick}>

                    {ref !== null && props.children}

                </div>
            </ClickAwayListener>
        </>
    );

});
