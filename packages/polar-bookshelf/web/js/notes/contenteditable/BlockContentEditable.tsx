import {HTMLStr} from 'polar-shared/src/util/Strings';
import React from 'react';
import {IActiveBlock, useBlocksStore} from '../store/BlocksStore';
import {NoteFormatPopper} from "../NoteFormatPopper";
import {BlockContentCanonicalizer} from "./BlockContentCanonicalizer";
import {CursorPositions} from "./CursorPositions";
import {IPasteImageData, usePasteHandler} from '../clipboard/PasteHandlers';
import {MarkdownContentConverter} from "../MarkdownContentConverter";
import {useMutationObserver} from '../../../../web/js/hooks/ReactHooks';
import {BlockEditorGenericProps} from '../BlockEditor';
import {IBlockContentStructure} from 'polar-blocks/src/blocks/IBlock';
import {useBlocksTreeStore} from '../BlocksTree';
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {IImageContent} from "polar-blocks/src/blocks/content/IImageContent";
import {ContentEditables} from '../ContentEditables';
import {useSideNavStore} from '../../sidenav/SideNavStore';
import {BlockPredicates} from '../store/BlockPredicates';
import {DOMBlocks} from './DOMBlocks';
import {BlockActionsProvider} from './BlockActions';
import {useScrollIntoViewUsingLocation} from "../../../../apps/doc/src/annotations/ScrollIntoViewUsingLocation";

// NOT we don't need this yet as we haven't turned on collaboration but at some point
// this will be needed
const ENABLE_CURSOR_RESET = true;
const ENABLE_CURSOR_RESET_TRACE = false;

interface IProps extends BlockEditorGenericProps {
    readonly content: HTMLStr;

    readonly canHaveLinks?: boolean;

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

    const getCurrentContent = React.useCallback(() => {
        if (! divRef.current) {
            throw new Error("No element");
        }

        const div = BlockContentCanonicalizer.canonicalizeElement(divRef.current);
        return div.innerHTML;
    }, [divRef]);

    const handleChange = React.useCallback(() => {

        if (! divRef.current) {
            return;
        }

        const newContent = MarkdownContentConverter.toMarkdown(getCurrentContent());

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

    }, [props, getCurrentContent]);

    const updateMarkdownFromEditable = React.useCallback(() => {
        handleChange();
    }, [handleChange]);

    const onPasteImage = React.useCallback((image: IPasteImageData) => {
        console.log("Got paste: ", image);

        const content: IImageContent = {
            type: 'image',
            src: image.url,
            width: image.width,
            height: image.height,
            naturalWidth: image.width,
            naturalHeight: image.height,
            links: [],
        };

        blocksTreeStore.createNewBlock(props.id, {content});

    }, [blocksTreeStore, props.id]);

    const onPasteBlocks = React.useCallback((blocks: ReadonlyArray<IBlockContentStructure>) => {
        const block = blocks[0];

        const active = blocksTreeStore.active;

        if (! active) {
            throw new Error("Paste cannot be handled because there's no active block");
        }

        if (blocks.length === 1 && block.children.length === 0 && block.content.type === 'markdown') {
            document.execCommand("insertHTML", false, block.content.data);
            const existingBlock = blocksTreeStore.getBlock(props.id)!;
            // TODO: This is sort of a hack because we're changing the links in the in-memory version
            // of the block and then expecting `handleChange` to persist the new data
            block.content.links.forEach(link => existingBlock.content.addLink(link));
            handleChange(); 
        } else {
            blocksTreeStore.insertFromBlockContentStructure(blocks, { ref: active.id });
        }
    }, [blocksTreeStore, handleChange, props.id]);

    const onPasteError = React.useCallback((err: unknown) => console.error("Got paste error: ", err), []);

    const onPasteText = React.useCallback((text: string) => {
        document.execCommand("insertHTML", false, text);

        /*
         * This is mainly done so that when links are pasted they get converted into anchor tags and immediately reflected onto the UI
         *
         * Usually we don't need to update the contentEditable div with new data once it arrives
         * unless it's coming from somewhere else (another user) because the user is the one changing
         * the content of the contentEditable div, so we know that the data from the store will match
         * the data in the contentEditable div.
         *
         * But here we have to do it because MarkdownContentConverter.toHTML uses the `marked` package
         * which converts links into anchor tags automatically.
         */
        const newContent = MarkdownContentConverter.toMarkdown(getCurrentContent());

        props.onChange(newContent);

        const div = divRef.current;

        if (div) {
            const focusedBlock = DOMBlocks.getFocusedBlock();
            const currPosition = blocksTreeStore.cursorOffsetCapture();

            if (focusedBlock && currPosition) {
                div.innerHTML = MarkdownContentConverter.toHTML(newContent);
                updateCursorPosition(focusedBlock, currPosition, true);
            }
        }
    }, [blocksTreeStore, getCurrentContent, props, updateCursorPosition]);

    const handlePaste = usePasteHandler({
        onPasteImage,
        onPasteError,
        onPasteBlocks,
        onPasteText,
        id: props.id,
    });

    const handleKeyUp = React.useCallback(() => {

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
                const focusedBlock = DOMBlocks.getFocusedBlock();
                const isActive = focusedBlock && focusedBlock === div;
                const currPosition = blocksTreeStore.cursorOffsetCapture();

                /**
                 * Remove the cursor from the block if it's not active to prevent it from being reset to the start when innerHTML is set
                 *
                 * This is because of when we split the content of a block
                 * the cursor gets reset to the start in that block before getting transferred to the new one.
                 */
                if (! isActive) {
                    div.blur();
                }

                div.innerHTML = MarkdownContentConverter.toHTML(props.content);
                ContentEditables.insertEmptySpacer(div);

                if (isActive && focusedBlock && currPosition) {
                    updateCursorPosition(focusedBlock, currPosition, true);
                }

            }

        }

    }, [props.content, props.id, blocksTreeStore, updateCursorPosition]);

    const scrollIntoViewRef = useScrollIntoViewUsingLocation();

    const handleRef = React.useCallback((current: HTMLDivElement | null) => {

        divRef.current = current;

        if (props.innerRef) {
            props.innerRef.current = current;
        }

        scrollIntoViewRef(current);

    }, [props, scrollIntoViewRef]);

    useHandleLinkDeletion({ elem: divRef.current, blockID: props.id });

    return (
        <NoteContentEditableElementContext.Provider value={divRef}>

            <div onKeyDown={props.onKeyDown}
                 onKeyUp={handleKeyUp}>
                <BlockActionsProvider id={props.id}>
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
                             dangerouslySetInnerHTML={{__html: content}} />
                    </NoteFormatPopper>
                </BlockActionsProvider>
            </div>

        </NoteContentEditableElementContext.Provider>
    );

};


/**
 * Hook which keeps track of the last nonce we updated to avoid double updates.
 */
export function useUpdateCursorPosition() {

    const nonceRef = React.useRef(-1);
    const { isOpen: isSidenavOpen } = useSideNavStore(['isOpen']);

    return React.useCallback((editor: HTMLDivElement, activeBlock: IActiveBlock, force?: boolean) => {

        if (force || nonceRef.current !== activeBlock.nonce) {

            try {

                if (activeBlock.pos !== undefined) {

                    // Here we wanna prevent scrolling to the focused element if the sidenav is open
                    // because not doing so, completely fucks the layout, apparently the browser doesn't care
                    // about your CSS, it'll try to focus the element no matter what.
                    CursorPositions.jumpToPosition(editor, activeBlock.pos, isSidenavOpen);
                }

            } finally {
                nonceRef.current = activeBlock.nonce;
            }

        }

    }, [isSidenavOpen]);

}

type IUseHandleLinkDeletionOpts = {
    readonly elem: HTMLElement | null;
    readonly blockID: BlockIDStr;
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

        for (const mutation of mutations) {
            const added = mutationNodesToWikiLinks(mutation.addedNodes);
            const removed = mutationNodesToWikiLinks(mutation.removedNodes)
            const removedLinks = removed.filter((elem) => !added.some(compareLinks(elem)));

            for (const removedLink of removedLinks) {
                const block = blocksStore.getBlockForMutation(blockID);
                const linkedBlock = blocksStore.getBlockByName(removedLink.getAttribute('href')!.slice(1));
                if (block && linkedBlock && BlockPredicates.canHaveLinks(block)) {
                    block.content.removeLink(linkedBlock.id);
                    blocksStore.setBlockContent(blockID, block.content);
                }
            }
        }
    }, {
        elem,
        config: mutationObserverConfig
    })
};
