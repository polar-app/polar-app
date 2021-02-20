import { HTMLStr } from 'polar-shared/src/util/Strings';
import React from 'react';
import {ContentEditableWhitespace} from "../ContentEditableWhitespace";
import { observer } from "mobx-react-lite"
import {NavOpts, NoteIDStr, useNotesStore} from '../store/NotesStore';
import {ContentEditables} from "../ContentEditables";

interface IProps {

    readonly id: NoteIDStr;

    readonly parent: NoteIDStr | undefined;

    readonly spellCheck?: boolean;

    readonly content: HTMLStr;

    readonly className?: string;

    readonly style?: React.CSSProperties;

    readonly innerRef?: React.MutableRefObject<HTMLDivElement | null>;

    readonly onChange: (content: HTMLStr) => void;

    readonly onClick?: (event: React.MouseEvent) => void;

    readonly onKeyDown?: (event: React.KeyboardEvent) => void;

}

/**
 * Just a minimal contenteditable control that we can use to allow the suer to
 * delete content.
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand
 *
 */
export const MinimalContentEditable = observer((props: IProps) => {

    const [content, setContent] = React.useState(props.content);

    const divRef = React.useRef<HTMLDivElement | null>();

    const contentRef = React.useRef(props.content);

    const store = useNotesStore();

    const handleKeyUp = React.useCallback((event: React.KeyboardEvent) => {

        // note that we have to first use trim on this because sometimes
        // chrome uses &nbsp; which is dumb

        const newContent = ContentEditableWhitespace.trim(event.currentTarget.innerHTML);

        contentRef.current = newContent;
        props.onChange(newContent);

    }, [props]);

    React.useEffect(() => {

        if (store.active === props.id) {

            if (divRef.current) {
                divRef.current.focus();
            }

        }

    }, [props.id, store.active]);

    React.useEffect(() => {

        if (props.content.valueOf() !== contentRef.current.valueOf()) {

            // console.log("content differs: ");
            // console.log(`    props.content:      '${props.content}'`);
            // console.log(`    contentRef.current: '${contentRef.current}'`);
            // console.log(`    value of equals:    `, props.content.valueOf() === contentRef.current.valueOf());

            contentRef.current = props.content;

            setContent(props.content);
        }

    }, [props.content]);

    const handleRef = React.useCallback((current: HTMLDivElement | null) => {

        divRef.current = current;

        if (props.innerRef) {
            props.innerRef.current = current;
        }

    }, [props]);

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

        if (! divRef.current) {
            return;
        }

        const cursorPosition = ContentEditables.computeCursorPosition(divRef.current);

        function abortEvent() {
            event.stopPropagation();
            event.preventDefault();
        }

        const opts: NavOpts = {
            shiftKey: event.shiftKey
        }

        switch (event.key) {

            case 'ArrowUp':

                abortEvent();
                store.navPrev('start', opts);
                break;

            case 'ArrowDown':

                abortEvent();
                store.navNext('start', opts);
                break;

            case 'ArrowLeft':

                if (cursorPosition === 'start') {
                    abortEvent();
                    store.navPrev('end', opts);
                }

                break;

            case 'ArrowRight':

                if (cursorPosition === 'end') {
                    abortEvent();
                    store.navNext('start', opts);
                }

                break;

            case 'Backspace':

                if (hasEditorSelection()) {
                    console.log("Not handling Backspace");
                    break;
                }

                // TODO: only do this if there aren't any modifiers I think...
                if (props.parent !== undefined && store.noteIsEmpty(props.id)) {

                    abortEvent();
                    store.doDelete([props.id]);

                }

                if (cursorPosition === 'start') {

                    // we're at the beginning of a note...

                    const mergeTarget = store.canMerge(props.id);

                    if (mergeTarget) {
                        store.mergeNotes(mergeTarget.target, mergeTarget.source);
                    }

                }

                break;
        }

        if (props.onKeyDown) {
            props.onKeyDown(event);
        }

    }, [hasEditorSelection, props, store]);

    return (

        <div ref={handleRef}
             onKeyDown={handleKeyDown}
             onKeyUp={handleKeyUp}
             contentEditable={true}
             spellCheck={props.spellCheck}
             className={props.className}
             onClick={props.onClick}
             style={{
                 outline: 'none',
                 ...props.style
             }}
             dangerouslySetInnerHTML={{__html: content}}/>

    );

});
