import {HTMLStr} from 'polar-shared/src/util/Strings';
import React from 'react';
import {ContentEditableWhitespace} from "../ContentEditableWhitespace";
import {observer} from "mobx-react-lite"
import {IActiveBlock} from '../store/BlocksStore';
import {ContentEditables} from "../ContentEditables";
import {createActionsProvider} from "../../mui/action_menu/ActionStore";
import {NoteFormatPopper} from "../NoteFormatPopper";
import {BlockContentCanonicalizer} from "./BlockContentCanonicalizer";
import {BlockAction} from "./BlockAction";
import {CursorPositions} from "./CursorPositions";
import {IPasteImageData, usePasteHandler } from '../clipboard/PasteHandlers';
import {MarkdownContentConverter} from "../MarkdownContentConverter";
import {useMutationObserver} from '../../../../web/js/hooks/ReactHooks';
import {MarkdownContent} from '../content/MarkdownContent';
import {BlockEditorGenericProps} from '../BlockEditor';
import {IBlockContentStructure} from '../HTMLToBlocks';
import {useBlocksTreeStore} from '../BlocksTree';
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {IImageContent} from "polar-blocks/src/blocks/content/IImageContent";
import {useNamedBlocks} from '../NoteRenderers';

// NOT we don't need this yet as we haven't turned on collaboration but at some point
// this will be needed
const ENABLE_CURSOR_RESET = true;
const ENABLE_CURSOR_RESET_TRACE = false;

interface IProps extends BlockEditorGenericProps {
    readonly content: HTMLStr;

    readonly onChange: (content: HTMLStr) => void;

    readonly onMouseDown?: React.MouseEventHandler<HTMLDivElement>;

    readonly spellCheck?: boolean;
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
export const BlockContentEditable = (props: IProps) => {

    const [content] = React.useState(() => MarkdownContentConverter.toHTML(props.content));
    const divRef = React.useRef<HTMLDivElement | null>(null);
    const contentRef = React.useRef(props.content);
    const blocksTreeStore = useBlocksTreeStore();

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

        blocksTreeStore.createNewBlock(props.id, {content});

    }, [blocksTreeStore, props.id]);

    const onPasteBlocks = React.useCallback((blocks: ReadonlyArray<IBlockContentStructure>) => {
        blocksTreeStore.insertFromBlockContentStructure(blocks);
    }, [blocksTreeStore]);

    const onPasteError = React.useCallback((err: Error) => {
        console.error("Got paste error: ", err);


    }, []);

    const handlePaste = usePasteHandler({onPasteImage, onPasteError, onPasteBlocks, id: props.id});
    const namedBlocks = useNamedBlocks();

    const noteLinkActions = React.useMemo(() => {
        return namedBlocks.map((block) => ({
            id: block.content.data,
            text: block.content.data,
        }));
    }, [namedBlocks]);

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

            const div = divRef.current;
            if (div && ENABLE_CURSOR_RESET) {
                const active = blocksTreeStore.active;
                const isActive = active && active.id === props.id;

                // Remove the cursor from the block if it's not active to prevent it from being reset to the start when innerHTML is set
                if (! isActive) {
                    div.blur();
                }

                div.innerHTML = MarkdownContentConverter.toHTML(props.content);
                ContentEditables.insertEmptySpacer(div);


                if (active && isActive) {
                    updateCursorPosition(div, {...active}, true);
                }

            }

        }

    }, [props.content, props.id, blocksTreeStore, updateCursorPosition]);

    const handleRef = React.useCallback((current: HTMLDivElement | null) => {

        divRef.current = current;

        if (props.innerRef) {
            props.innerRef.current = current;
        }

    }, [props]);

    useHandleLinkDeletion({ elem: divRef.current, blockID: props.id });

    return (
        <NoteContentEditableElementContext.Provider value={divRef}>

            <div onKeyDown={props.onKeyDown}
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
                             onPaste={handlePaste}
                             onClick={props.onClick}
                             onMouseDown={props.onMouseDown}
                             contentEditable={true}
                             spellCheck={props.spellCheck}
                             data-id={props.id}
                             className={props.className}
                             id={`${DOMBlocks.BLOCK_ID_PREFIX}${props.id}`}
                             style={{
                                 outline: 'none',
                                 whiteSpace: 'pre-wrap',
                                 wordBreak: 'break-word',
                                 ...props.style
                             }}
                             dangerouslySetInnerHTML={{__html: content}}/>
                    </NoteFormatPopper>

                </BlockAction>

            </div>

        </NoteContentEditableElementContext.Provider>
    );

};

/**
 * Hook which keeps track of the last nonce we updated to avoid double updates.
 */
export function useUpdateCursorPosition() {

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

function doUpdateCursorPosition(editor: HTMLDivElement, pos: 'start' | 'end' | number) {

    if (pos !== undefined) {

        function defineNewRange(range: Range) {

            const sel = window.getSelection();

            if (sel) {
                sel.removeAllRanges();
                sel.addRange(range);
            }

        }

        // console.log("Updating cursor position to: ", pos);
        editor.focus();

        if (pos === 'start' || pos === 0) {

            const range = document.createRange();
            const firstChild = editor.firstChild;
            if (firstChild) {
                range.setStartBefore(firstChild)
                range.setEndBefore(firstChild)
                defineNewRange(range);
            }

        } else if (pos === 'end') {

            const end = ContentEditables.computeEndNodeOffset(editor);

            const range = document.createRange();
            range.setStart(end.node, end.offset);
            range.setEnd(end.node, end.offset);

            defineNewRange(range);

        } else if (typeof pos === 'number') {

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
    const blocksTreeStore = useBlocksTreeStore();

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
                const block = blocksTreeStore.getBlock(blockID);
                const linkedBlock = blocksTreeStore.getBlockByName(removedLink.getAttribute('href')!.slice(1));
                if (block && linkedBlock && block.content.type === 'markdown') {
                    const newContent = new MarkdownContent(block.content.toJSON());
                    newContent.removeLink(linkedBlock.id);
                    blocksTreeStore.setBlockContent(blockID, newContent);
                }
            }
        }
    }, {
        elem,
        config: mutationObserverConfig
    })
};

export namespace DOMBlocks {
    export const BLOCK_ID_PREFIX = 'block-';

    export const getBlockHTMLID = (id: BlockIDStr) => `${BLOCK_ID_PREFIX}${id}`;

    export const getBlockElement = (id: BlockIDStr) =>
        document.querySelector<HTMLDivElement>(`#${getBlockHTMLID(id)}`);

    export function isBlockElement(node: Node): node is HTMLElement {
        if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            if (element.id && element.id.startsWith(BLOCK_ID_PREFIX)) {
                return true;
            }
        }
        return false;
    }

    export function getSiblingID(id: BlockIDStr, delta: 'next' | 'prev'): string | null {
        const currBlockElem = getBlockElement(id);
        if (currBlockElem) {
            const newActiveBlockElem = findSiblingBlock(currBlockElem, delta);
            if (newActiveBlockElem && newActiveBlockElem.dataset.id) {
                return newActiveBlockElem.dataset.id;
            }
        }
        return null;
    }

    export function findSiblingBlock(node: Node, delta: 'next' | 'prev'): HTMLElement | null {
        const sibling = delta === 'next'
                ? node.nextSibling
                : node.previousSibling;

        if (! sibling) {
            if (node.parentElement) {
                return findSiblingBlock(node.parentElement, delta);
            }
            return null;
        }

        if (sibling.nodeType === Node.ELEMENT_NODE) {
            const siblingElem = sibling as HTMLElement;
            const elements = siblingElem.querySelectorAll<HTMLDivElement>(`[id^="${BLOCK_ID_PREFIX}"]`);
            if (elements.length > 0) {
                const idx = delta === 'next' ? 0 : elements.length - 1;
                return elements[idx];
            }
        }

        if (isBlockElement(sibling)) {
            return sibling;
        }

        return findSiblingBlock(sibling, delta);
    }
}
