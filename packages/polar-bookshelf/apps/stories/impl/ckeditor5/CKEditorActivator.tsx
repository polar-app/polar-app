import * as React from "react";
import {CKEditor5BalloonEditor, ContentEscaper, DataStr} from "./CKEditor5BalloonEditor";
import {HTMLStr} from "polar-shared/src/util/Strings";
import { Numbers } from "polar-shared/src/util/Numbers";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {INoteEditorMutator, NoteEditorMutators} from "../../../../web/js/notes/store/NoteEditorMutator";
import {deepMemo} from "../../../../web/js/react/ReactUtils";

export type EditorCursorPosition = number | 'before' | 'end';

/**
 * An editor activator does the following:
 *
 * - if the editor is not mounted, we mount it and load the editor
 * - if an offset is specified and jump to that offset
 * - focus the editor
 */
export type EditorActivator = (offset?: EditorCursorPosition) => void;

function editorActivator(editor: ckeditor5.IEditor, offset?: EditorCursorPosition) {

    const doc = editor.model.document;

    editor.model.change((writer) => {

        const root = doc.getRoot();

        if (offset !== undefined) {

            switch (offset) {

                case 'before':
                case 'end':
                    writer.setSelection(root, offset)
                    break;

                default:
                    const position = writer.createPositionFromPath(root, [0, offset]);
                    const range = writer.createRange(position, position);

                    writer.setSelection(range);
                    break;
            }

        }

    });

    editor.editing.view.focus();

}

interface ActiveProps {
    readonly content: HTMLStr;
    readonly offset: EditorCursorPosition;
    readonly onEditor: (editor: ckeditor5.IEditor) => void;

    readonly onChange: (content: DataStr) => void;
    readonly escaper?: ContentEscaper;
    readonly noToolbar?: boolean;
    readonly preEscaped?: boolean
    readonly defaultFocus?: boolean;

}

const Active = (props: ActiveProps) => {

    const handleEditor = React.useCallback((editor: ckeditor5.IEditor) => {
        editorActivator(editor, props.offset);

        props.onEditor(editor);

    }, [props]);

    return (

        <CKEditor5BalloonEditor content={props.content}
                                onEditor={handleEditor}
                                onChange={props.onChange}
                                escaper={props.escaper}
                                noToolbar={props.noToolbar}
                                preEscaped={props.preEscaped}
                                defaultFocus={props.defaultFocus}/>

    );

}


interface INodeTextBoundingClientRect {

    readonly text: Text;
    readonly start: number;
    readonly end: number;

    readonly left: number;
    readonly top: number;
    readonly width: number;
    readonly height: number;

}

namespace NodeTextBoundingClientRects {

    // https://javascript.info/selection-range
    // https://stackoverflow.com/questions/1461059/is-there-an-equivalent-to-getboundingclientrect-for-text-nodes
    export function compute(element: HTMLElement): ReadonlyArray<INodeTextBoundingClientRect> {

        const childNodes = Array.from(element.childNodes);

        const result: INodeTextBoundingClientRect[] = [];

        for (const childNode of childNodes) {

            switch (childNode.nodeType) {
                case Node.ELEMENT_NODE:
                    result.push(...compute(childNode as HTMLElement));
                    break;
                case Node.TEXT_NODE:
                    result.push(...computeForTextNode(childNode as Text));
                    break;
            }

        }

        return result;

    }

    function computeNodeTextBoundingClientRect(text: Text,
                                               start: number,
                                               end: number): INodeTextBoundingClientRect {

        const range = document.createRange();
        range.setStart(text, start);
        range.setEnd(text, end);

        const bcr = range.getBoundingClientRect();

        return {
            text, start, end,
            left: bcr.left,
            top: bcr.top,
            width: bcr.width,
            height: bcr.height
        };

    }

    function computeForTextNode(text: Text) {

        return Numbers.range(0, text.length - 1)
                      .map(start => computeNodeTextBoundingClientRect(text, start, start + 1));

    }

    export function computeNearest(nodes: ReadonlyArray<INodeTextBoundingClientRect>,
                                   left: number,
                                   top: number): INodeTextBoundingClientRect | undefined {

        interface IDistance {
            readonly node: INodeTextBoundingClientRect,
            readonly distance: number;
        }

        function computeDistance(node: INodeTextBoundingClientRect): IDistance {
            const distance = Math.abs(left - node.left) + Math.abs(top - node.top);
            return {distance, node};
        }

        return arrayStream(nodes)
                   .map(computeDistance)
                   .sort((a, b) => a.distance - b.distance)
                   .first()?.node;

    }

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

        if (props.content === '') {
            return '<p></p>';
        }

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
    readonly onEditorMutator: (editorMutator: INoteEditorMutator) => void;
    readonly onEditor: (editor: ckeditor5.IEditor) => void;

    readonly content: DataStr;

    readonly onChange: (content: DataStr) => void;
    readonly escaper?: ContentEscaper;
    readonly noToolbar?: boolean;
    readonly preEscaped?: boolean
    readonly defaultFocus?: boolean;

    readonly onClickWhileInactive?: (event: React.MouseEvent) => void;

}

export const CKEditorActivator = (props: IProps) => {

    const [active, setActive] = React.useState<boolean>(props.defaultFocus || false);
    const offsetRef = React.useRef<EditorCursorPosition>(0);
    const editorRef = React.useRef<ckeditor5.IEditor | undefined>(undefined);
    const mutatorRef = React.useRef<INoteEditorMutator | undefined>(undefined);

    const setCursorPosition = React.useCallback((offset?: EditorCursorPosition) => {

        if (active) {

            if (editorRef.current) {
                editorActivator(editorRef.current, offset);
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

    const handleEditor = React.useCallback((editor: ckeditor5.IEditor) => {

        editorRef.current = editor;
        // mutatorRef.current = NoteEditorMutators.createForEditor(editorRef.current);

        props.onEditor(editor);

    }, [props]);

    React.useEffect(() => {

        props.onEditorMutator({getCursorPosition, setCursorPosition, setData, split, focus, clearSelection});

    }, [clearSelection, focus, getCursorPosition, props, setCursorPosition, setData, split]);

    if (active) {

        return (
            <Active offset={offsetRef.current}
                    content={props.content}
                    onEditor={handleEditor}
                    onChange={props.onChange}
                    escaper={props.escaper}
                    noToolbar={props.noToolbar}
                    preEscaped={props.preEscaped}
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
