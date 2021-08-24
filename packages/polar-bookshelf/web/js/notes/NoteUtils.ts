import React from "react";
import {BlockIDStr, IBlockNamedContent} from "polar-blocks/src/blocks/IBlock";
import {NamedBlock, useBlocksStore} from "./store/BlocksStore";
import {IBlocksStore} from "./store/IBlocksStore";
import {autorun} from "mobx";
import equal from "deep-equal";
import {useNoteLinkLoader} from "./NoteLinkLoader";
import {useLinkLoaderRef} from "../ui/util/LinkLoaderHook";
import {useHistory} from "react-router";
import {Arrays} from "polar-shared/src/util/Arrays";
import {BlockPredicates} from "./store/BlockPredicates";
import { RoutePathnames } from "../apps/repository/RoutePathnames";
import {DocInfos} from "../metadata/DocInfos";
import {AnnotationContentType, IAnnotationContent} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {DocumentContent} from "./content/DocumentContent";
import {Block} from "./store/Block";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {AnnotationContentTypeMap} from "./content/AnnotationContent";

// TODO: move this into BlocksStore
export const focusFirstChild = (blocksStore: IBlocksStore, id: BlockIDStr) => {
    const root = blocksStore.getBlock(id);
    if (root && root.content.type !== "document") {
        const firstChildID = root.itemsAsArray[0] || blocksStore.createNewBlock(root.id, { asChild: true }).id;
        blocksStore.setActiveWithPosition(firstChildID, 'start');
    }
};

export const getBlockForDocument = (blocksStore: IBlocksStore, fingerprint: string) => {
    const documentBlockID = blocksStore.indexByDocumentID[fingerprint];
    const block = blocksStore.getBlock(documentBlockID);
    return block;
};

export const useAnnotationBlockManager = () => {
    const blocksStore = useBlocksStore();

    const doMutation = React.useCallback((fingerprint: string, handler: (block: Block<DocumentContent>) => void) => {
        const block = getBlockForDocument(blocksStore, fingerprint);
        if (block && block.content.type === "document") {
            handler(block as Block<DocumentContent>);
        } else {
            console.error(`Document with fingerprint ${fingerprint} was not found. Annotation block could not be created`);
        }
    }, [blocksStore]);
    
    const getBlock = React.useCallback(<T extends AnnotationContentType = AnnotationContentType>(id: BlockIDStr, type?: T): Block<AnnotationContentTypeMap[T]> | undefined => {
        const block = blocksStore.getBlockForMutation(id);

        if (! block || ! BlockPredicates.isAnnotationBlock(block)) {
            console.log(`Could not find annotation block with the ID ${id}`);
            return undefined;
        }

        if (type && type !== block.content.type) {
            console.log(`Could not find ${type} block with the ID ${id}`);
            return undefined;
        }

        return block as Block<AnnotationContentTypeMap[T]>;
    }, [blocksStore]);

    const updateMetadata = React.useCallback(<T extends IAnnotationContent>(annotation: T): T => {
        return {
            ...annotation,
            value: {
                ...annotation.value,
                lastUpdated: ISODateTimeStrings.create(),
            },
        };
    }, []);

    const create = React.useCallback((fingerprint: string, annotation: IAnnotationContent) => {
        doMutation(fingerprint, (block) => {
            blocksStore.createNewBlock(block.id, { content: updateMetadata(annotation) });
        });
    }, [blocksStore, updateMetadata, doMutation]);

    const update = React.useCallback((id: BlockIDStr, annotation: IAnnotationContent) => {
        blocksStore.setBlockContent(id, updateMetadata(annotation));
    }, [blocksStore, updateMetadata]);

    const remove = React.useCallback((id: BlockIDStr) => {
        const block = getBlock(id);

        if (block) {
            blocksStore.deleteBlocks([id]);
        }
    }, [blocksStore, getBlock]);

    return { create, update, remove, getBlock };
};

export const getNamedContentName = (content: IBlockNamedContent): string => {
    switch (content.type) {
        case 'date':
        case 'name':
            return content.data;
        case 'document':
            return DocInfos.bestTitle(content.docInfo);
    }
};

export const useNamedBlocks = () => {
    const blocksStore = useBlocksStore();
    const [namedBlocks, setNamedBlocks] = React.useState<ReadonlyArray<NamedBlock>>([]);
    const prevNamedBlocksIDsRef = React.useRef<BlockIDStr[] | null>(null);

    React.useEffect(() => {
        const disposer = autorun(() => {
            const namedBlocksIDs = Object.values(blocksStore.indexByName);
            if (! equal(prevNamedBlocksIDsRef.current, namedBlocksIDs)) {
                const namedBlocks = blocksStore.idsToBlocks(namedBlocksIDs) as ReadonlyArray<NamedBlock>;
                setNamedBlocks(namedBlocks);
                prevNamedBlocksIDsRef.current = namedBlocksIDs;
            }
        });

        return () => disposer();
    }, [blocksStore]);

    return namedBlocks;
};

export const useNoteWikiLinkCreator = () => {
    const blocksStore = useBlocksStore();

    return React.useCallback((id: BlockIDStr, linkText: string): string | null => {
        const block = blocksStore.getBlock(id);

        if (! block || block.content.type !== "markdown") {
            return null;
        }
        
        const link = block.content.links.find(({ text }) => text === linkText);

        if (! link) {
            return null;
        }

        const targetBlock = blocksStore.getBlock(link.id);

        if (targetBlock && BlockPredicates.isNamedBlock(targetBlock)) {
            return getNamedContentName(targetBlock.content);
        }

        return null;
    }, [blocksStore]);
};


type IUseLinkNavigationOpts = {
    id: BlockIDStr;
};

interface ILinkNavigationEvent {
    readonly abortEvent: () => void;
    readonly target: EventTarget | null;
}

function useLinkNavigationEventListener({ id }: IUseLinkNavigationOpts) {

    const linkLoaderRef = useLinkLoaderRef();
    const noteLinkLoader = useNoteLinkLoader();
    const noteWikiLinkCreator = useNoteWikiLinkCreator();
    const history = useHistory();

    return React.useCallback((event: ILinkNavigationEvent): boolean => {

        const {target, abortEvent} = event;

        if (target instanceof HTMLAnchorElement) {

            const href = target.getAttribute('href');

            if (href !== null) {

                if (href.startsWith('#')) {

                    const anchor = Arrays.last(href.split("#"));

                    if (anchor) {
                        const link = noteWikiLinkCreator(id, anchor);
                        if (link) {
                            noteLinkLoader(link);
                        } else {
                            noteLinkLoader(anchor);
                        }
                        abortEvent();
                        return true;
                    }

                } else {
                    if (href.startsWith(RoutePathnames.NOTE(""))) {
                        history.push(href);
                    } else {
                        const linkLoader = linkLoaderRef.current;
                        linkLoader(href, {newWindow: true, focus: true});
                    }
                    abortEvent();
                    return true;

                }

            }

        }

        return false;

    }, [noteWikiLinkCreator, linkLoaderRef, noteLinkLoader, history, id]);

}

export function useLinkNavigationClickHandler({ id }: IUseLinkNavigationOpts) {

    const linkNavigationEventListener = useLinkNavigationEventListener({ id });

    return React.useCallback((event: React.MouseEvent) => {

        function abortEvent() {
            event.stopPropagation();
            event.preventDefault();
        }

        const target = event.target;

        return linkNavigationEventListener({target, abortEvent});

    }, [linkNavigationEventListener]);

}

