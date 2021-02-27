import { HTMLStr } from 'polar-shared/src/util/Strings';
import React from 'react';
import {ContentEditableWhitespace} from "../ContentEditableWhitespace";
import { observer } from "mobx-react-lite"
import {NavOpts, NoteIDStr, useNotesStore} from '../store/NotesStore';
import {ContentEditables} from "../ContentEditables";
import {useActions} from "../../mui/action_menu/UseActions";
import {createActionsProvider} from "../../mui/action_menu/ActionStore";

interface IProps {

    readonly id: NoteIDStr;

    readonly parent: NoteIDStr | undefined;

    readonly content: HTMLStr;

    readonly onChange: (content: HTMLStr) => void;

    readonly className?: string;

    readonly spellCheck?: boolean;

    readonly style?: React.CSSProperties;

    readonly innerRef?: React.MutableRefObject<HTMLDivElement | null>;

    readonly onClick?: (event: React.MouseEvent) => void;

    readonly onKeyDown?: (event: React.KeyboardEvent) => void;

}

/**
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand
 *
 */
export const NoteContentEditable = observer((props: IProps) => {

    const [content, setContent] = React.useState(props.content);

    const divRef = React.useRef<HTMLDivElement | null>(null);

    const contentRef = React.useRef(props.content);

    const store = useNotesStore();

    const noteLinkActions = store.getNamedNodes().map(current => {
        return {
            id: current,
            text: current
        }
    });

    const [noteLinkEventHandler] = useActions({
        trigger: '[[',
        actionsProvider: createActionsProvider(noteLinkActions),
        onAction: (id) => {
            return {
                type: 'note-link',
                target: id
            }
        }
    });

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

                switch (store.activePos) {
                    case 'start':
                    case 'end':

                        updateCursorPosition(divRef.current, store.activePos)

                        break;
                    default:

                }

                divRef.current.focus();

            }

        }

    }, [props.id, store.active, store.activePos]);

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

        if (noteLinkEventHandler(event, divRef.current)) {
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

                if (event.shiftKey && ! ContentEditables.selectionAtStart(divRef.current)) {
                    if (! store.hasSelected()) {
                        // don't handle shift until we allow the range to be selected.
                        break;
                    }
                }

                abortEvent();
                store.navPrev('start', opts);
                break;

            case 'ArrowDown':

                if (event.shiftKey && ! ContentEditables.selectionAtEnd(divRef.current)) {
                    if (! store.hasSelected()) {
                        // don't handle shift until we allow the range to be selected.
                        break;
                    }
                }

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


function updateCursorPosition(editor: HTMLDivElement, offset: 'start' | 'end') {

    if (offset !== undefined) {

        function defineNewRange(range: Range) {

            const sel = window.getSelection();

            editor.focus();

            if (sel) {
                sel.removeAllRanges();
                sel.addRange(range);
            }

        }

        if (offset === 'start') {
            const range = document.createRange();
            range.setStartAfter(editor)
            range.setEndAfter(editor)
        }

        if (offset === 'end') {

            const end = ContentEditables.computeEndNodeOffset(editor);

            const range = document.createRange();
            range.setStart(end.node, end.offset);
            range.setEnd(end.node, end.offset);

            defineNewRange(range);

        }

    }

}
