import * as React from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import {NoteIDStr, useNotesCallbacks, useNotesStore} from "./NotesStore";
import {useRefValue} from "../hooks/ReactHooks";
import {ckeditor5} from "../../../apps/stories/impl/ckeditor5/CKEditor5";
import { deepMemo } from '../react/ReactUtils';
import {useComponentWillUnmount} from "../hooks/ReactLifecycleHooks";

interface IProps {
    readonly parent: NoteIDStr;
    readonly id: NoteIDStr;
    readonly editor: ckeditor5.IEditor | undefined;
    readonly children: JSX.Element;
}

export const NoteNavigation = deepMemo((props: IProps) => {

    const {editor} = props;

    const {active} = useNotesStore(['active']);
    const activeRef = useRefValue(active);
    const {createNewNote, setActive, navPrev, navNext} = useNotesCallbacks();

    const [ref, setRef] = React.useState<HTMLDivElement | null>(null);

    const handleClickAway = React.useCallback(() => {

    }, []);

    React.useEffect(() => {

        if (activeRef.current === props.id) {
            if (editor !== undefined) {
                console.log("Focusing editor");
                editor.editing.view.focus();
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

    }, [createNewNote, navNext, navPrev, props.id, props.parent]);

    const handleKeyDownCapture =  React.useCallback((event: KeyboardEvent) => {

        // FIXME: allow shift + enter

        if (event.key === 'Enter') {
            console.log("FIXME: preventing enter with capture");
            event.stopPropagation();
            event.preventDefault();
            createNewNote(props.parent, props.id);

        }

    }, []);

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