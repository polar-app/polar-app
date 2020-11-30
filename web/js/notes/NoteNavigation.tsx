import * as React from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import {NoteIDStr, useNotesStoresCallbacks, useNotesStore} from "./NotesStore";
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

export const NoteNavigation = deepMemo(function NoteNavigation(props: IProps) {

    const editor = useEditorStore();

    const {active} = useNotesStore(['active']);
    const activeRef = useRefValue(active);
    const {createNewNote, setActive, navPrev, navNext, doIndent} = useNotesStoresCallbacks();

    const [ref, setRef] = React.useState<HTMLDivElement | null>(null);

    const handleClickAway = React.useCallback(() => {
        // noop for now
    }, []);

    React.useEffect(() => {

        if (editor !== undefined) {

            if (activeRef.current === props.id) {
                console.log("Focusing editor");
                editor.editing.view.focus();
            } else {
                // different editor
            }

        } else {
            console.log("No editor: ")
        }

    }, [active, activeRef, editor, props.id]);

    const handleClick = React.useCallback(() => {
        setActive(props.id);
    }, [props.id, setActive]);

    const handleKeyDown = React.useCallback((eventData: IEventData, event: IKeyPressEvent) => {

        console.log("FIXME: ", event);

        function abortEvent() {
            event.domEvent.stopPropagation();
            event.domEvent.preventDefault();
            eventData.stop();
        }

        switch (event.domEvent.key) {

            case 'ArrowUp':
                console.log('FIXME: handling ArrowUp');
                abortEvent();

                navPrev(props.parent, props.id);

                break;

            case 'ArrowDown':
                console.log('FIXME: handling ArrowDown');

                abortEvent();

                navNext(props.parent, props.id);

                break;

            case 'Tab':
                console.log('FIXME: handling Tab');
                abortEvent();

                doIndent(props.id, props.parent);
                break;

            default:
                break;

        }

    }, [doIndent, navNext, navPrev, props.id, props.parent]);

    if (editor) {

        editor?.editing.view.document.on('keydown', (data, event) => {
            handleKeyDown(data, event);
        });

        (editor as any).editing.view.document.on('enter', (eventInfo: any) => {

            eventInfo.stop();
            createNewNote(props.parent, props.id);

        });

    }

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <div ref={setRef} onClick={handleClick}>
                {ref !== null && props.children}
            </div>
        </ClickAwayListener>
    );

});
