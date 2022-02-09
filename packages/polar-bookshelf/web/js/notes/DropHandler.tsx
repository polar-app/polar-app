import React from "react";
import {useBlocksTreeStore} from "./BlocksTree";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {ImageContent} from "./content/ImageContent";
import {UploadedFile, useUploadHandler} from "./UploadHandler";
import {useOnlineOnlyTaskHandler} from "../react/useOnlineOnlyTaskHandler";

const getBlockContent = (uploadedFile: UploadedFile) => {
    const {type, url} = uploadedFile;

    switch (type) {
        case 'image':
            const {width, height} = uploadedFile;

            return new ImageContent({
                type: 'image',
                src: url,
                width: width,
                height: height,
                naturalWidth: width,
                naturalHeight: height,
                links: [],
            });
    }
};

type IUseDragDropHandlerOpts = {
    id: BlockIDStr;
    isRoot: boolean;
};

export const useDragDropHandler = ({ id, isRoot }: IUseDragDropHandlerOpts) => {
    const blocksTreeStore = useBlocksTreeStore();
    const dragActive = React.useRef<boolean>(false);
    const uploadHandler = useUploadHandler();
    const divRef = React.useRef<HTMLDivElement | null>(null);

    const computeDragPosition = React.useCallback((event: React.DragEvent | React.MouseEvent) => {
        if (! isRoot && divRef.current) {

            const bcr = divRef.current.getBoundingClientRect();

            const deltaTop = Math.abs(event.clientY - bcr.top);
            const deltaBottom = Math.abs(event.clientY - bcr.bottom);

            if (deltaTop < deltaBottom) {
                return 'top';
            }

        }

        return 'bottom';

    }, [isRoot]);

    const onDragStart = React.useCallback((event: React.DragEvent) => {
        blocksTreeStore.setDropSource(id);
    }, [id, blocksTreeStore]);

    const updateDropTarget = React.useCallback((event: React.DragEvent | React.MouseEvent) => {

        const pos = computeDragPosition(event);

        blocksTreeStore.setDropTarget({id, pos});

    }, [computeDragPosition, id, blocksTreeStore]);

    const onDragEnter = React.useCallback((event: React.DragEvent) => {

        updateDropTarget(event);

        dragActive.current = true;

        event.preventDefault();
        event.stopPropagation();

    }, [updateDropTarget]);

    const onDragExit = React.useCallback(function (event: React.DragEvent) {

        dragActive.current = false;

        event.preventDefault();
        event.stopPropagation();
    }, []);

    const handleDropWhileOnline = React.useCallback((event: DragEvent) => {
        const dropTarget = blocksTreeStore.dropTarget;
        const files = event.dataTransfer?.files;
        if (! dropTarget || ! files || files.length === 0) {
            return;
        }

        const handleUploadedFile = (upload: UploadedFile | undefined) => {
            if (! upload) {
                return;
            }
            const getTargetBlock = (): { target: BlockIDStr, asChild: boolean } | undefined => {
                const block = blocksTreeStore.getBlock(id);
                if (! block) {
                    return undefined;
                }
                if (isRoot) {
                    const items = block.itemsAsArray;
                    if (items.length) {
                        return { target: items[items.length - 1], asChild: false };
                    }
                    return { target: id, asChild: true };
                }
                if (dropTarget.pos === 'top') {
                    const prevSibling = blocksTreeStore.prevSibling(dropTarget.id);
                    if (prevSibling) {
                        return { target: prevSibling, asChild: false };
                    }
                    if (block.parent) {
                        return { target: block.parent, asChild: true };
                    }
                }
                return { target: id, asChild: false };
            };

            const targetBlock = getTargetBlock();

            if (targetBlock) {
                const {target, asChild} = targetBlock;
                blocksTreeStore.createNewBlock(target, { content: getBlockContent(upload), unshift: asChild });
            }
        };

        for (const file of Array.from(files)) {
            uploadHandler({ file, target: dropTarget })
                .then(handleUploadedFile)
                .catch(e => console.log(e))
        }

        blocksTreeStore.clearDrop();

    }, [blocksTreeStore, id, isRoot, uploadHandler]);

    const handleDrop = useOnlineOnlyTaskHandler(handleDropWhileOnline);

    const onDrop = React.useCallback((event: React.DragEvent) => {

        event.preventDefault();
        event.stopPropagation();

        handleDrop(event.nativeEvent);

    }, [handleDrop]);

    return {
        ref: divRef,
        onDragLeave: onDragExit,
        onDragStart,
        onDragEnter,
        onDragExit,
        onDrop,
    };
};
