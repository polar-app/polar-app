import * as React from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import {NoteIDStr, useNotesStoresCallbacks, useNotesStore} from "./NotesStore";
import {useRefValue} from "../hooks/ReactHooks";
import { deepMemo } from '../react/ReactUtils';
import {useComponentWillUnmount} from "../hooks/ReactLifecycleHooks";
import { useEditorStore } from './EditorStoreProvider';

interface IProps {
    readonly parent: NoteIDStr;
    readonly id: NoteIDStr;
    readonly children: JSX.Element;
}

export const NoteNavigation = deepMemo((props: IProps) => {

    const editor = useEditorStore();

    const {active} = useNotesStore(['active']);
    const activeRef = useRefValue(active);
    const {createNewNote, setActive, navPrev, navNext} = useNotesStoresCallbacks();

    const [ref, setRef] = React.useState<HTMLDivElement | null>(null);

    const handleClickAway = React.useCallback(() => {

    }, []);

    React.useEffect(() => {

        if (activeRef.current === props.id) {
            if (editor !== undefined) {
                console.log("Focusing editor");
                editor.editing.view.focus();
            } else {
                console.log("No editor: ")
            }
        }

    }, [active, activeRef, editor, props.id]);

    const handleClick = React.useCallback(() => {
        setActive(props.id);
    }, [props.id, setActive]);

    const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {

        switch (event.key) {

            case 'ArrowUp':
                event.stopPropagation();
                event.preventDefault();

                navPrev(props.parent, props.id);

                break;

            case 'ArrowDown':
                event.stopPropagation();
                event.preventDefault();

                navNext(props.parent, props.id);

                break;

            default:
                break;

        }

    }, [navNext, navPrev, props.id, props.parent]);

    const handleKeyDownCapture =  React.useCallback((event: KeyboardEvent) => {

        // FIXME: allow shift + enter

        if (event.key === 'Enter') {
            console.log("FIXME: preventing enter with capture");
            event.stopPropagation();
            event.preventDefault();
            createNewNote(props.parent, props.id);
        }

    }, [createNewNote, props.id, props.parent]);

    React.useEffect(() => {

        if (ref) {
            ref.addEventListener('keydown', handleKeyDownCapture, {capture: true})
        }

    }, [handleKeyDownCapture, ref])

    useComponentWillUnmount(() => {
        if (ref) {
            ref.removeEventListener('keydown', handleKeyDownCapture, {capture: true})
        }
    });

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <div ref={setRef} onClick={handleClick} onKeyDown={handleKeyDown}>
                {ref !== null && props.children}
            </div>
        </ClickAwayListener>
    );

});