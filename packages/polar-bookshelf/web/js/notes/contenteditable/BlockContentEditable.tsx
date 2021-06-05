import { HTMLStr } from 'polar-shared/src/util/Strings';
import React from 'react';
import {ContentEditableWhitespace} from "../ContentEditableWhitespace";
import { observer } from "mobx-react-lite"
import {NavOpts, BlockIDStr, useBlocksStore, IActiveBlock} from '../store/BlocksStore';
import {ContentEditables} from "../ContentEditables";
import {createActionsProvider} from "../../mui/action_menu/ActionStore";
import {NoteFormatPopper} from "../NoteFormatPopper";
import {BlockContentCanonicalizer} from "./BlockContentCanonicalizer";
import {BlockAction} from "./BlockAction";
import {CursorPositions} from "./CursorPositions";
import {IPasteImageData, usePasteHandler } from '../clipboard/PasteHandlers';
import {IImageContent} from "../content/IImageContent";
import {MarkdownContentConverter} from "../MarkdownContentConverter";
import {useMutationObserver} from '../../../../web/js/hooks/ReactHooks';
import {MarkdownContent} from '../content/MarkdownContent';
import {useBlockKeyDownHandler} from './BlockHooks';

// NOT we don't need this yet as we haven't turned on collaboration but at some point
// this will be needed
const ENABLE_CURSOR_RESET = true;
const ENABLE_CURSOR_RESET_TRACE = false;

interface IProps {

    readonly id: BlockIDStr;

    readonly parent: BlockIDStr | undefined;

    readonly content: HTMLStr;

    readonly onChange: (content: HTMLStr) => void;

    readonly className?: string;

    readonly spellCheck?: boolean;

    readonly style?: React.CSSProperties;

    readonly innerRef?: React.MutableRefObject<HTMLDivElement | null>;

    readonly onClick?: (event: React.MouseEvent) => void;

    readonly onKeyDown?: (event: React.KeyboardEvent) => void;

    readonly readonly?: boolean;
}

const NoteContentEditableElementContext = React.createContext<React.RefObject<HTMLElement | null>>({current: null});

export function useBlockContentEditableElement() {
    return React.useContext(NoteContentEditableElementContext);
}

/**
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand
 *
 */
export const BlockContentEditable = observer((props: IProps) => {

    const [content] = React.useState(() => MarkdownContentConverter.toHTML(props.content));
    const divRef = React.useRef<HTMLDivElement | null>(null);
    const contentRef = React.useRef(props.content);
    const blocksStore = useBlocksStore();

    const updateCursorPosition = useUpdateCursorPosition();

    const onPasteImage = React.useCallback((image: IPasteImageData) => {
        console.log("Got paste: ", image);

        const content: IImageContent = {
            type: 'image',
            src: image.url,
            width: image.width,
            height: image.height,
            naturalWidth: image.width,
            naturalHeight: image.height
        };

        blocksStore.createNewBlock(props.id, {content});

    }, [blocksStore, props.id]);

    const onPasteError = React.useCallback((err: Error) => {
        console.error("Got paste error: ", err);


    }, []);

    const handlePaste = usePasteHandler({onPasteImage, onPasteError});

    const noteLinkActions = blocksStore.getNamedNodes().map(current => ({
        id: current,
        text: current
    }));

    const createNoteActionsProvider = React.useMemo(() => createActionsProvider(noteLinkActions), [noteLinkActions]);


    const handleChange = React.useCallback(() => {

        if (! divRef.current) {
            return;
        }

        function computeNewContent() {

            if (! divRef.current) {
                throw new Error("No element");
            }

            const div = BlockContentCanonicalizer.canonicalizeElement(divRef.current)
            return ContentEditableWhitespace.trim(div.innerHTML);

        }

        const newContent = MarkdownContentConverter.toMarkdown(computeNewContent());

        if (newContent === contentRef.current) {
            // there was no change so skip this.
            return;
        }

        if (ENABLE_CURSOR_RESET_TRACE) {
            console.log("==== update handleChange: ")
            console.log(`    contentRef.current:  '${contentRef.current}'`, );
            console.log(`    newContent:          '${newContent}'`, );
        }

        contentRef.current = newContent;
        props.onChange(newContent);
    }, [props]);

    const updateMarkdownFromEditable = React.useCallback(() => {
        handleChange();
    }, [handleChange]);

    const handleKeyUp = React.useCallback((event: React.KeyboardEvent) => {

        // note that we have to first use trim on this because sometimes
        // chrome uses &nbsp; which is dumb
        handleChange();

    }, [handleChange]);

    React.useEffect(() => {
        if (blocksStore.active?.id === props.id) {
            if (divRef.current) {

                if (blocksStore.active.pos !== undefined) {
                    updateCursorPosition(divRef.current, blocksStore.active)
                }

                divRef.current.focus();

            }
        } else if (divRef.current) {
            insertEmptySpacer(divRef.current);
        }
    }, [props.id, updateCursorPosition, blocksStore.active]);

    React.useEffect(() => {

        if (props.content.valueOf() !== contentRef.current.valueOf()) {

            if (ENABLE_CURSOR_RESET_TRACE) {

                console.log(`=== content differs for ${props.id} (cursor will be reset): `);
                console.log(`    props.content:      '${props.content}'`);
                console.log(`    contentRef.current: '${contentRef.current}'`);

            }

            contentRef.current = props.content;

            // https://stackoverflow.com/questions/30242530/dangerouslysetinnerhtml-doesnt-update-during-render/38548616

            // We have to set the content in two place, trigger a re-render
            // (though this might be optional) and then set the innerHTML
            // directly.  React has a bug which won't work on empty strings.

            if (divRef.current && ENABLE_CURSOR_RESET) {
                const pos = CursorPositions.computeCurrentOffset(divRef.current);

                divRef.current.innerHTML = MarkdownContentConverter.toHTML(props.content);
                insertEmptySpacer(divRef.current!);


                // TODO: only update if WE are active so the cursor doesn't jump.
                if (blocksStore.active) {
                    updateCursorPosition(divRef.current, {...blocksStore.active, pos}, true);
                }

            }

        }

    }, [props.content, props.id, blocksStore.active, updateCursorPosition]);

    const handleRef = React.useCallback((current: HTMLDivElement | null) => {

        divRef.current = current;

        if (props.innerRef) {
            props.innerRef.current = current;
        }

    }, [props]);

    const {onKeyDown} = useBlockKeyDownHandler({
        contentEditableRef: divRef,
        blockID: props.id,
        parent: props.parent,
        onKeyDown: props.onKeyDown,
        allowEdits: props.readonly,
    });

    useHandleLinkDeletion({ elem: divRef.current, blockID: props.id });

    return (
        <NoteContentEditableElementContext.Provider value={divRef}>

            <div onKeyDown={onKeyDown}
                 onKeyUp={handleKeyUp}>

                <BlockAction id={props.id}
                             trigger="[["
                             actionsProvider={createNoteActionsProvider}
                             onAction={(id) => ({
                                type: 'link-to-block',
                                target: id
                            })}>

                    <NoteFormatPopper onUpdated={updateMarkdownFromEditable} id={props.id}>
                        <div ref={handleRef}
                             onPaste={event => handlePaste(event)}
                             onClick={props.onClick}
                             contentEditable={true}
                             spellCheck={props.spellCheck}
                             className={props.className}
                             style={{
                                 outline: 'none',
                                 ...props.style
                             }}
                             dangerouslySetInnerHTML={{__html: content}}/>
                    </NoteFormatPopper>

                </BlockAction>

            </div>

        </NoteContentEditableElementContext.Provider>
    );

});

/**
 * Hook which keeps track of the last nonce we updated to avoid double updates.
 */
function useUpdateCursorPosition() {

    const nonceRef = React.useRef(-1);

    return React.useCallback((editor: HTMLDivElement, activeBlock: IActiveBlock, force?: boolean) => {

        if (force || nonceRef.current !== activeBlock.nonce) {

            try {

                if (activeBlock.pos !== undefined) {

                    doUpdateCursorPosition(editor, activeBlock.pos)
                }

            } finally {
                nonceRef.current = activeBlock.nonce;
            }

        }

    }, []);

}

const insertEmptySpacer = (elem: HTMLElement) => {
    const isFocusable = (node: Node | null): boolean => {
        if (!node) {
            return true;
        }
        if (!node.textContent?.length) {
            return isFocusable(node.previousSibling);
        }
        if (node.nodeType === Node.ELEMENT_NODE) {
            const elem = node as Element;
            return elem.getAttribute('contenteditable') !== 'false';
        }
        return true;
    };
    if (!isFocusable(elem.lastChild)) {
        elem.appendChild(ContentEditables.createEmptySpacer());
    }
};

function doUpdateCursorPosition(editor: HTMLDivElement, pos: 'start' | 'end' | number) {

    if (pos !== undefined) {

        function defineNewRange(range: Range) {

            const sel = window.getSelection();

            editor.focus();

            if (sel) {
                sel.removeAllRanges();
                sel.addRange(range);
            }

        }

        // console.log("Updating cursor position to: ", pos);

        editor.focus();

        if (pos === 'start') {
            const range = document.createRange();
            range.setStartAfter(editor)
            range.setEndAfter(editor)
        }

        if (pos === 'end') {

            const end = ContentEditables.computeEndNodeOffset(editor);

            const range = document.createRange();
            range.setStart(end.node, end.offset);
            range.setEnd(end.node, end.offset);

            defineNewRange(range);

        }

        if (typeof pos === 'number') {
            CursorPositions.jumpToPosition(editor, pos)
        }

    }

}

type IUseHandleLinkDeletionOpts = {
    elem: HTMLElement | null;
    blockID: BlockIDStr;
};
const useHandleLinkDeletion = ({ blockID, elem }: IUseHandleLinkDeletionOpts) => {
    const mutationObserverConfig = React.useMemo(() => ({ childList: true }), []);
    const blocksStore = useBlocksStore();

    useMutationObserver((mutations) => {
        const isElement = (node: Node): node is Element => node.nodeType === Node.ELEMENT_NODE;
        const mutationNodesToWikiLinks = (nodes: NodeList) =>
            Array.from(nodes)
                .filter(isElement)
                .filter(elem => elem.tagName === 'A')
                .filter(elem => elem.getAttribute('href')?.startsWith('#'));

        const compareLinks = (link1: Element) => (link2: Element) =>
            link1.getAttribute('href') === link2.getAttribute('href') &&
            link1.textContent === link2.textContent;

        for (let mutation of mutations) {
            const added = mutationNodesToWikiLinks(mutation.addedNodes);
            const removed = mutationNodesToWikiLinks(mutation.removedNodes)
            const removedLinks = removed.filter((elem) => !added.some(compareLinks(elem)));

            for (let removedLink of removedLinks) {
                const block = blocksStore.getBlock(blockID);
                const linkedBlock = blocksStore.getBlockByName(removedLink.getAttribute('href')!.slice(1));
                if (block && linkedBlock && block.content.type === 'markdown') {
                    const newContent = new MarkdownContent(block.content.toJSON());
                    newContent.removeLink(linkedBlock.id);
                    blocksStore.setBlockContent(blockID, newContent);
                }
            }
        }
    }, {
        elem,
        config: mutationObserverConfig
    })
};

