import React from "react";
import {BlockContentStructureConverter} from "../BlockContentStructureConverter";
import {MarkdownContentConverter} from "../MarkdownContentConverter";
import {useBlocksStore} from "../store/BlocksStore";


export const useCutCopyHandler = (): React.RefCallback<HTMLElement> => {
    const blocksStore = useBlocksStore();
    const callbackRef: React.RefCallback<HTMLElement> = React.useCallback((elem) => {
        if (! elem) {
            return;
        }

        const copy = (e: ClipboardEvent): boolean => {
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
        };

        const handleCopy = (e: ClipboardEvent) => copy(e);

        const handleCut = (e: ClipboardEvent) => {
            if (copy(e)) {
                blocksStore.doDelete(blocksStore.selectedIDs());
            }
        };

        elem.addEventListener('copy', handleCopy);
        elem.addEventListener('cut', handleCut);
        return () => {
            elem.removeEventListener('copy', handleCopy);
            elem.removeEventListener('cut', handleCut); 
        };
    }, [blocksStore]);

    return callbackRef;
};
