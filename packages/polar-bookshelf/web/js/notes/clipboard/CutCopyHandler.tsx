import React from "react";
import {RoutePathNames} from "../../apps/repository/RoutePathNames";
import {IBlockLink} from "../../../../../polar-blocks/src/blocks/IBlock";
import {arrayStream} from "../../../../../polar-shared/src/util/ArrayStreams";
import {HTMLStr, MarkdownStr} from "../../../../../polar-shared/src/util/Strings";
import {BlockContentStructureConverter} from "../BlockContentStructureConverter";
import {DOMBlocks} from "../contenteditable/DOMBlocks";
import {IBlockContentStructure} from "../HTMLToBlocks";
import {MarkdownContentConverter} from "../MarkdownContentConverter";
import {getNoteAnchorFromHref} from "../NoteLinksHooks";
import {Block} from "../store/Block";
import {useBlocksStore} from "../store/BlocksStore";
import {IBlocksStore} from "../store/IBlocksStore";

namespace CopyUtils {
    type ICopyData = {
        markdown: MarkdownStr;
        html: HTMLStr;
        polarBlocks: ReadonlyArray<IBlockContentStructure> | null;
    };

    export function extractContentsFromBlocksSelection(blocksStore: IBlocksStore): ICopyData {
        const selectedIDs = blocksStore.selectedIDs();
        const polarBlocks = blocksStore.createBlockContentStructure(selectedIDs);



        const rawHTML = BlockContentStructureConverter.toHTML(polarBlocks);
        const div = document.createElement('div');
        div.innerHTML = rawHTML;
        convertWikiLinksToFullURLs(div);

        const html = div.innerHTML;
        const markdown = MarkdownContentConverter.toMarkdown(html);

        return {
            markdown,
            html,
            polarBlocks,
        };
    }

    /**
     * Build clipboard data from the active selection range
     *
     * @param blocksStore BlocksStore instance.
     */
    export function extractContentsFromSelection(blocksStore: IBlocksStore): ICopyData | null {
        const selection = document.getSelection();

        if (! selection || selection.rangeCount === 0) {
            return null;
        }

        const range = selection.getRangeAt(0);
        const fragment = range.cloneContents();
        const div = document.createElement('div');
        const blockElem = DOMBlocks.findBlockParent(range.startContainer);
        const blockID = blockElem ? DOMBlocks.getBlockID(blockElem) : null;

        div.append(fragment);

        const getPolarBlocks = (): ReadonlyArray<IBlockContentStructure> | null => {
            const block = blockID ? blocksStore.getBlock(blockID) : null;
            if (! block) {
                return null;
            }

            const wikiLinks = getWikiLinks(block, div);

            return [{
                content: {
                    type: 'markdown',
                    links: wikiLinks,
                    data: div.innerHTML,
                },
                children: [],
            }];
        };

        const polarBlocks = getPolarBlocks();

        convertWikiLinksToFullURLs(div);

        const markdown = MarkdownContentConverter.toMarkdown(div.innerHTML);
        const html = div.innerHTML;

        return {
            html,
            markdown,
            polarBlocks,
        };
    }

    /**
     * Replace wiki links with their contents in the specified element
     *
     * @param elem The element that contains the copied contents
     */
    function convertWikiLinksToFullURLs(elem: HTMLElement) {
        const wikiAnchorElements = elem.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');

        const removeLink = (link: HTMLAnchorElement) => {
            const anchor = getNoteAnchorFromHref(link.getAttribute('href')!);

            if (anchor) {
                link.href = `${window.location.origin}${RoutePathNames.NOTE(anchor)}`;
            } else {
                const parentElem = link.parentElement;

                if (! parentElem) {
                    return;
                }

                const textNode = document.createTextNode(link.textContent || '');
                parentElem.insertBefore(textNode, link);
                parentElem.removeChild(link);
            }
        };

        Array.from(wikiAnchorElements).forEach(removeLink);
    }

    /**
     * Parse wiki links from the copied HTML
     *
     * @param block The block where the current selection range is at
     * @param elem An element that contains the copied contents
     */
    function getWikiLinks(block: Readonly<Block>, elem: HTMLElement): ReadonlyArray<IBlockLink> {
        const wikiAnchorElements = elem.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');

        const linksMap = arrayStream(block.content.links).toMap(({ text }) => text);

        return arrayStream(Array.from(wikiAnchorElements))
            .map(anchorElem => linksMap[anchorElem.getAttribute('href')!.slice(1)])
            .filterPresent()
            .collect();
    }
}

export const useCutCopyHandler = () => {
    const blocksStore = useBlocksStore();

    const copy = React.useCallback((e: React.ClipboardEvent<HTMLElement>): boolean => {
        if (! e.clipboardData) {
            return false;
        }

        const copyData = blocksStore.hasSelected()
            ? CopyUtils.extractContentsFromBlocksSelection(blocksStore)
            : CopyUtils.extractContentsFromSelection(blocksStore);


        if (! copyData) {
            return false;
        }
        const { markdown, html, polarBlocks } = copyData;

        e.clipboardData.setData('text/plain', markdown);
        e.clipboardData.setData('text/markdown', markdown);
        e.clipboardData.setData('text/html', html);

        if (polarBlocks) {
            e.clipboardData.setData('application/polarblocks+json', JSON.stringify(polarBlocks));
        }

        return true;
    }, [blocksStore]);

    const onCut: React.ClipboardEventHandler<HTMLElement> = React.useCallback((e) => {
        if (copy(e)) {
            const selectedIDs = blocksStore.selectedIDs();
            if (selectedIDs.length > 0) {
                blocksStore.deleteBlocks(selectedIDs);
            }
        }
    }, [copy, blocksStore]);

    const onCopy: React.ClipboardEventHandler<HTMLElement> = React.useCallback((e) => {
        e.preventDefault();
        copy(e);
    }, [copy]);


    return {onCopy, onCut};
};
