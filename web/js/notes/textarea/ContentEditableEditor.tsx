import * as React from "react";
import {HTMLStr, MarkdownStr} from "polar-shared/src/util/Strings";
import {deepMemo} from "../../react/ReactUtils";
import {NodeTextBoundingClientRects} from "./NodeTextBoundingClientRects";
import {ContentEscaper, MinimalContentEditable} from "./MinimalContentEditable";

export type TextAreaEditorCursorPosition = number | 'start' | 'end';

/**
 * An editor activator does the following:
 *
 * - if the editor is not mounted, we mount it and load the editor
 * - if an offset is specified and jump to that offset
 * - focus the editor
 */
export type EditorActivator = (offset?: TextAreaEditorCursorPosition) => void;

function editorActivator(editor: HTMLDivElement, offset?: TextAreaEditorCursorPosition) {

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

            interface INodeOffset {
                readonly node: Node,
                readonly offset: number;
            }

            function computeEnd(node: Node): INodeOffset {

                if (node.nodeType === document.TEXT_NODE) {

                    return {
                        node,
                        offset: node.textContent !== null ? node.textContent.length : 0,
                    }

                }

                if (node.childNodes.length > 0) {
                    return computeEnd(node.childNodes[node.childNodes.length - 1]);
                }

                return {
                    node,
                    offset: 0
                };

            }

            const end = computeEnd(editor);

            const range = document.createRange();
            range.setStart(end.node, end.offset);
            range.setEnd(end.node, end.offset);

            defineNewRange(range);

        }

    }

}

interface ActiveProps {

    readonly content: HTMLStr;
    readonly offset: TextAreaEditorCursorPosition;

    readonly defaultFocus?: boolean;

    readonly innerRef: React.MutableRefObject<HTMLDivElement | null>;
    readonly onChange: (data: MarkdownStr) => void;

    readonly escaper?: ContentEscaper;
    readonly preEscaped?: boolean


}

const Active = React.memo(function Active(props: ActiveProps) {

    const [content, setContent] = React.useState(props.content);

    React.useEffect(() => {

        if (props.content !== content) {
            // update the content but only if it differ.
            setContent(content);
        }

    }, [content, props.content]);

    // TODO: we have to add another inner component that can see if we need to remount
    // but this really isn't a performance issue.

    return (

        <MinimalContentEditable innerRef={props.innerRef}
                                content={props.content}
                                escaper={props.escaper}
                                preEscaped={props.preEscaped}
                                onChange={props.onChange}/>

    );

});

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

        console.log("FIXME111")

        if (props.onClickWhileInactive) {
            props.onClickWhileInactive(event);
        }

        if (elementRef.current === null) {
            console.log("FIXME112")
            console.warn("No element yet");
            return;
        }

        function computeOffset(): number {

            if (elementRef.current === null) {
                console.log("FIXME113")
                return 0;
            }

            const nodes = NodeTextBoundingClientRects.compute(elementRef.current);
            const clickedNode = NodeTextBoundingClientRects.computeNearest(nodes, event.clientX, event.clientY);

            console.log("FIXME114")

            if (clickedNode) {
                console.log("FIXME115")

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
        <div style={{cursor: 'text'}}
             ref={elementRef}
             onClick={handleClick}
             dangerouslySetInnerHTML={{__html: content}}>

        </div>
    );
});

interface IProps {

    /**
     * True this should be active.
     */
    readonly active: boolean;

    /**
     * When active, the offset into the content where we should place the cursor.
     */
    readonly offset: number;

    readonly content: MarkdownStr;

    /**
     * Callback when the markdown is updated.
     */
    readonly onChange: (content: MarkdownStr) => void;

    readonly defaultFocus?: boolean;

    readonly onClickWhileInactive?: (event: React.MouseEvent) => void;

    /**
     * The offset in the content where it was activated
     */
    readonly onActivated: (offset: TextAreaEditorCursorPosition) => void;

    readonly escaper?: ContentEscaper;
    readonly preEscaped?: boolean

}

export const ContentEditableEditor = React.memo(function ContentEditableEditor(props: IProps) {

    const {active} = props;

    const offsetRef = React.useRef<TextAreaEditorCursorPosition>(0);
    const contentEditableRef = React.useRef<HTMLDivElement | null>(null);

    const handleActivation = React.useCallback((offset?: TextAreaEditorCursorPosition) => {

        if (active) {

            if (contentEditableRef.current) {
                editorActivator(contentEditableRef.current, offset);
            } else {
                console.warn("No editor");
            }

        } else {

            if (offset !== undefined) {
                offsetRef.current = offset;
                props.onActivated(offset);
            }

        }

    }, [active, props]);

    if (active) {

        return (
            <Active offset={offsetRef.current}
                    content={props.content}
                    onChange={props.onChange}
                    innerRef={contentEditableRef}
                    escaper={props.escaper}
                    preEscaped={props.preEscaped}
                    defaultFocus={props.defaultFocus}/>
        );

    } else {

        return (
            <Inactive onActivated={handleActivation}
                      onClickWhileInactive={props.onClickWhileInactive}
                      content={props.content}/>
        );

    }

});
