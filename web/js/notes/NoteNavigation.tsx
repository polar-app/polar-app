import * as React from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import {useComponentDidMount, useComponentWillUnmount} from "../hooks/ReactLifecycleHooks";
import {NoteIDStr, useNotesCallbacks, useNotesStore} from "./NotesStore";
import {useRefValue} from "../hooks/ReactHooks";

interface IProps {
    readonly parent: NoteIDStr;
    readonly id: NoteIDStr;
    readonly children: JSX.Element;
}

export const NoteNavigation = React.memo((props: IProps) => {

    const {active} = useNotesStore(['active']);
    const activeRef = useRefValue(active);
    const {createNewNote, setActive} = useNotesCallbacks();

    const handleClickAway = React.useCallback(() => {

    }, []);

    const handleClick = React.useCallback(() => {
        setActive(props.id);
    }, [props.id, setActive]);

    const onKeyDownCapture = React.useCallback((event: KeyboardEvent) => {

        if (activeRef.current !== props.id) {
            return;
        }

        switch (event.key) {

            case 'ArrowDown':
                event.stopPropagation();
                event.preventDefault();
                break;

            case 'ArrowUp':
                event.stopPropagation();
                event.preventDefault();
                break;

            case 'Enter':
                createNewNote(props.parent, props.id);
                event.stopPropagation();
                event.preventDefault();
                break;
            default:
                break;
        }

    }, [activeRef, createNewNote, props.id, props.parent]);

    useComponentDidMount(() => {
        document.addEventListener('keydown', event => onKeyDownCapture(event), {capture: true});
    })

    useComponentWillUnmount(() => {
        document.removeEventListener('keydown', event => onKeyDownCapture(event), {capture: true});
    })

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <div onClick={handleClick}>
                {props.children}
            </div>
        </ClickAwayListener>
    );

});