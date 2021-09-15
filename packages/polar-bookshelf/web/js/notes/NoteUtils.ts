import React from "react";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {NamedContent, useBlocksStore} from "./store/BlocksStore";
import {IBlocksStore} from "./store/IBlocksStore";
import {autorun} from "mobx";
import equal from "deep-equal";
import {useNoteLinkLoader} from "./NoteLinkLoader";
import {useLinkLoaderRef} from "../ui/util/LinkLoaderHook";
import {useHistory} from "react-router";
import {Arrays} from "polar-shared/src/util/Arrays";
import {BlockPredicates, TextContent} from "./store/BlockPredicates";
import {RoutePathnames} from "../apps/repository/RoutePathnames";
import {DocInfos} from "../metadata/DocInfos";
import {AnnotationContentType} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {DocumentContent} from "./content/DocumentContent";
import {Block} from "./store/Block";
import {FlashcardAnnotationContent, TextHighlightAnnotationContent} from "./content/AnnotationContent";
import {MarkdownStr} from "polar-shared/src/util/Strings";
import {MarkdownContent} from "./content/MarkdownContent";
import {NameContent} from "./content/NameContent";
import {DateContent} from "./content/DateContent";
import {BlockTextHighlights} from "polar-blocks/src/annotations/BlockTextHighlights";
import {IBlockFlashcard} from "polar-blocks/src/annotations/IBlockFlashcard";
import {FlashcardType} from "polar-shared/src/metadata/FlashcardType";
import {BlockFlashcards} from "polar-blocks/src/annotations/BlockFlashcards";


export const useNamedBlocks = () => {
	const blocksStore = useBlocksStore();
	const [namedBlocks, setNamedBlocks] = React.useState<ReadonlyArray<Block<NamedContent>>>([]);
	const prevNamedBlocksIDsRef = React.useRef<BlockIDStr[] | null>(null);
    
	React.useEffect(() => {
	    const disposer = autorun(() => {
		const namedBlocksIDs = Object.values(blocksStore.indexByName);
		if (! equal(prevNamedBlocksIDsRef.current, namedBlocksIDs)) {
		    const namedBlocks = blocksStore.idsToBlocks(namedBlocksIDs) as ReadonlyArray<Block<NamedContent>>;
		    setNamedBlocks(namedBlocks);
		    prevNamedBlocksIDsRef.current = namedBlocksIDs;
		}
	    });
    
	    return () => disposer();
	}, [blocksStore]);
    
	return namedBlocks;
};


// TODO: move this into BlocksStore
export const focusFirstChild = (blocksStore: IBlocksStore, id: BlockIDStr) => {
    const root = blocksStore.getBlock(id);
    if (root) {
        const getFirstChildID = (): BlockIDStr => {
            if (root.content.type === "document") {
                return root.itemsAsArray[0];
            }
            return root.itemsAsArray[0] || blocksStore.createNewBlock(root.id, { asChild: true }).id;
        };
        blocksStore.setActiveWithPosition(getFirstChildID(), 'start');
    }
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
            return BlockTextContentUtils.getTextContentMarkdown(targetBlock.content);
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

export namespace BlockTextContentUtils {

    export function updateFlashcardContentMarkdown<T extends IBlockFlashcard>(
        content: FlashcardAnnotationContent<T>,
        field: keyof T['fields'],
        markdown: MarkdownStr,
    ): FlashcardAnnotationContent {
        const flashcardContent = content.toJSON();

        return new FlashcardAnnotationContent({
            ...flashcardContent,
            value: BlockFlashcards.updateField(flashcardContent.value, field, markdown),
        });
    }

    export function updateTextContentMarkdown(content: Exclude<TextContent, FlashcardAnnotationContent>, markdown: MarkdownStr): TextContent {
        switch(content.type) {
            case "markdown":
                return new MarkdownContent({ ...content.toJSON(), data: markdown });
            case "date":
                return new DateContent({ ...content.toJSON(), data: markdown });
            case "name":
                return new NameContent({ ...content.toJSON(), data: markdown });
            case AnnotationContentType.TEXT_HIGHLIGHT:
                const textHighlightContent = content.toJSON();
                return new TextHighlightAnnotationContent({
                    ...textHighlightContent,
                    value: {
                        ...textHighlightContent.value,
                        revisedText: markdown,
                    }
                });
        }
    };

    export function getTextContentMarkdown(content: TextContent | DocumentContent) {
        switch (content.type) {
            case 'date':
            case 'name':
            case 'markdown':
                return content.data;
            case 'document':
                return DocInfos.bestTitle(content.docInfo);
            case AnnotationContentType.TEXT_HIGHLIGHT:
                return BlockTextHighlights.toText(content.value);
            case AnnotationContentType.FLASHCARD:
                return content.value.type === FlashcardType.CLOZE
                    ? content.value.fields.text
                    : content.value.fields.front;
        }
    }
}
