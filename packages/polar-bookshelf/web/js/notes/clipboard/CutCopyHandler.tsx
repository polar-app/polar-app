import React from "react";
import {BlockContentStructureConverter} from "../BlockContentStructureConverter";
import {MarkdownContentConverter} from "../MarkdownContentConverter";
import {useBlocksStore} from "../store/BlocksStore";


export const useCutCopyHandler = () => {
    const blocksStore = useBlocksStore();

    const copy = React.useCallback((e: React.ClipboardEvent<HTMLElement>): boolean => {
        if (e.clipboardData && blocksStore.hasSelected()) {
            const selectedIDs = blocksStore.selectedIDs();
            const blockContentStructure = blocksStore.createBlockContentStructure(selectedIDs);
            e.preventDefault();
            const html = BlockContentStructureConverter.toHTML(blockContentStructure);
            const markdown = MarkdownContentConverter.toMarkdown(html);
            e.clipboardData.setData('text/plain', markdown);
            e.clipboardData.setData('text/markdown', markdown);
            e.clipboardData.setData('text/html', html);
            e.clipboardData.setData('application/polarblocks+json', JSON.stringify(blockContentStructure));
            return true;
        }
        return false;
    }, [blocksStore]);

    const onCut: React.ClipboardEventHandler<HTMLElement> = React.useCallback((e) => {
        if (copy(e)) {
            blocksStore.deleteBlocks(blocksStore.selectedIDs());
        }
    }, [copy, blocksStore]);

    const onCopy: React.ClipboardEventHandler<HTMLElement> = React.useCallback((e) => copy(e), [copy]);


    return {onCopy, onCut};
};
