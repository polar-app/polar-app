import * as React from "react";
import {HTMLStr, MarkdownStr} from "polar-shared/src/util/Strings";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import {deepMemo} from "../../react/ReactUtils";
import {NodeTextBoundingClientRects} from "./NodeTextBoundingClientRects";
import { INoteEditorMutator, NoteEditorMutators } from "../store/NoteEditorMutator";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column'
        },
        textarea: {
            border: 'none',
            outline: 'none',
            background: 'inherit',
            color: 'inherit',

            fontFamily: 'inherit',
            fontSize: 'inherit',
            fontWeight: 'inherit',
            lineHeight: 'inherit',
            letterSpacing: 'inherit',
            whiteSpace: 'inherit',
            padding: '0px',

            resize: 'none'

            // -webkit-box-shadow: none;
            // -moz-box-shadow: none;
            // box-shadow: none;

        }
    }),
);

export type EditorCursorPosition = number | 'before' | 'end';

/**
 * An editor activator does the following:
 *
 * - if the editor is not mounted, we mount it and load the editor
 * - if an offset is specified and jump to that offset
 * - focus the editor
 */
export type EditorActivator = (offset?: EditorCursorPosition) => void;

function editorActivator(textarea: HTMLTextAreaElement, offset?: EditorCursorPosition) {

    if (offset !== undefined) {

        switch (offset) {

            case 'before':
                textarea.selectionStart = 0;
                textarea.selectionEnd = 0;
                break;

            case 'end':
                const len = textarea.textLength;
                const end = len - 1;
                textarea.selectionStart = end;
                textarea.selectionEnd = end;
                break;

            default:
                textarea.selectionStart = offset;
                textarea.selectionEnd = offset;
                break;
        }

    }

    textarea.focus();

}

interface ActiveProps {

    readonly content: MarkdownStr;
    readonly offset: EditorCursorPosition;

    readonly defaultFocus?: boolean;

    readonly ref: React.MutableRefObject<HTMLTextAreaElement | null>;
    readonly onChange: (data: MarkdownStr) => void;

}

const Active = (props: ActiveProps) => {

    const classes = useStyles();

    return (

        <textarea ref={props.ref}
                  className={classes.textarea}
                  defaultValue={props.content}
                  autoFocus={props.defaultFocus}
                  rows={1}/>

    );

}

interface InactiveProps {

    readonly content: HTMLStr;

    /**
     * Called when we've been activated by clicking.
     */
    readonly onActivated: (offset: number) => void;

    readonly onClickWhileInactive?: (event: React.MouseEvent) => void;

}

const Inactive = deepMemo((props: InactiveProps) => {

    const elementRef = React.useRef<HTMLDivElement |  null>(null);

    const handleClick = React.useCallback((event: React.MouseEvent) => {

        if (props.onClickWhileInactive) {
            props.onClickWhileInactive(event);
        }

        // TODO: for some reason we can't click on an empty node

        if (elementRef.current === null) {
            console.warn("No element yet");
            return;
        }

        function computeOffset(): number {

            if (elementRef.current === null) {
                return 0;
            }

            const nodes = NodeTextBoundingClientRects.compute(elementRef.current);
            const clickedNode = NodeTextBoundingClientRects.computeNearest(nodes, event.clientX, event.clientY);

            if (clickedNode) {
                const range = document.createRange();
                range.setStart(elementRef.current, 0);
                range.setEnd(clickedNode.text, clickedNode.end);
                return range.cloneContents().textContent?.length || 0;
            }

            return 0;

        }

        const offset = computeOffset();

        props.onActivated(offset);

    }, [props]);

    const content = React.useMemo((): string => {

        return props.content;

    }, [props.content]);

    return (
        <div ref={elementRef}
             onClick={handleClick}
             dangerouslySetInnerHTML={{__html: content}}>

        </div>
    );
});

interface IProps {

    /**
     * Callback to provide an 'activator' that allows the caller to activate the
     * given component.
     *
     */
    // readonly onEditorMutator: (editorMutator: INoteEditorMutator) => void;
    // readonly onEditor: (editor: ckeditor5.IEditor) => void;

    readonly content: MarkdownStr;

    readonly onChange: (content: MarkdownStr) => void;

    readonly defaultFocus?: boolean;

    readonly onClickWhileInactive?: (event: React.MouseEvent) => void;

}
export const TextAreaEditor = (props: IProps) => {

    const [active, setActive] = React.useState<boolean>(props.defaultFocus || false);
    const offsetRef = React.useRef<EditorCursorPosition>(0);
    const textAreaRef = React.useRef<HTMLTextAreaElement | null>(null);
    const mutatorRef = React.useRef<INoteEditorMutator | undefined>(undefined);

    const setCursorPosition = React.useCallback((offset?: EditorCursorPosition) => {

        if (active) {

            if (textAreaRef.current) {
                editorActivator(textAreaRef.current, offset);
            } else {
                console.warn("No editor");
            }

        } else {

            // this will trigger the initial mount with the right offset.

            if (offset !== undefined) {
                offsetRef.current = offset;
            }

            setActive(true);

        }

    }, [active]);


    const getCursorPosition = React.useCallback(() => {

        if (mutatorRef.current) {
            return mutatorRef.current.getCursorPosition();
        }

        throw new Error("No mutator: getCursorPosition");

    }, []);

    const split = React.useCallback(() => {

        if (mutatorRef.current) {
            return mutatorRef.current.split();
        }

        throw new Error("No mutator: split");

    }, []);

    const setData = React.useCallback((data: string) => {

        if (mutatorRef.current) {
            mutatorRef.current.setData(data);
        }

        throw new Error("No mutator: setData");

    }, []);

    const clearSelection = React.useCallback(() => {

        if (mutatorRef.current) {
            mutatorRef.current.clearSelection();
        }

    }, []);

    const focus = React.useCallback(() => {

        if (mutatorRef.current) {
            mutatorRef.current.focus();
        }

        throw new Error("No mutator: focus");

    }, []);

    // const handleEditor = React.useCallback((editor: ckeditor5.IEditor) => {
    //
    //     editorRef.current = editor;
    //     mutatorRef.current = NoteEditorMutators.createForEditor(editorRef.current);
    //
    //     props.onEditor(editor);
    //
    // }, [props]);

    // React.useEffect(() => {
    //
    //     props.onEditorMutator({getCursorPosition, setCursorPosition, setData, split, focus, clearSelection});
    //
    // }, [clearSelection, focus, getCursorPosition, props, setCursorPosition, setData, split]);

    if (active) {

        return (
            <Active offset={offsetRef.current}
                    content={props.content}
                    onChange={props.onChange}
                    ref={textAreaRef}
                    defaultFocus={props.defaultFocus}/>
        );

    } else {

        return (
            <Inactive onActivated={setCursorPosition}
                      onClickWhileInactive={props.onClickWhileInactive}
                      content={props.content}/>
        );

    }

}
