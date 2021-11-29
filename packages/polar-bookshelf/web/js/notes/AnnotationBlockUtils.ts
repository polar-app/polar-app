import React from "react";
import {reaction} from "mobx";
import {AnnotationContentType, IFlashcardAnnotationContent} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {useHistory} from "react-router";
import {AnnotationLinks} from "../annotation_sidebar/AnnotationLinks";
import {AnnotationPtrs} from "../annotation_sidebar/AnnotationPtrs";
import {ColorStr} from "../ui/colors/ColorSelectorBox";
import {AreaHighlightAnnotationContent, TextHighlightAnnotationContent} from "./content/AnnotationContent";
import {BlockPredicates} from "./store/BlockPredicates";
import {useBlocksStore} from "./store/BlocksStore";
import {IBlockPredicates} from "./store/IBlockPredicates";
import {useAnnotationBlockManager} from "./HighlightBlocksHooks";
import {BlockTextHighlights} from "polar-blocks/src/annotations/BlockTextHighlights";
import {FlashcardType} from "polar-shared/src/metadata/FlashcardType";
import {BlockFlashcards} from "polar-blocks/src/annotations/BlockFlashcards";

interface IUseHighlightBlockColorOpts {
    readonly id: BlockIDStr;
}

export const useHighlightBlockColor = ({ id }: IUseHighlightBlockColorOpts): ColorStr | undefined => {
    const blocksStore = useBlocksStore();

    const getHighlightBlockColor = React.useCallback((id: BlockIDStr) => {
        const block = blocksStore.getBlock(id);

        if (! block || ! IBlockPredicates.isAnnotationHighlightBlock(block)) {
            return undefined;
        }

        return block.content.value.color;
    }, [blocksStore]);

    const [color, setColor] = React.useState<ColorStr | undefined>(() =>
        getHighlightBlockColor(id));

    React.useEffect(() => {
        return reaction(() => getHighlightBlockColor(id), setColor);
    }, [id, getHighlightBlockColor]);

    return color;
};

export const useHighlightBlockColorChanger = () => {
    const blocksStore = useBlocksStore();

    return React.useCallback((id: BlockIDStr, color: ColorStr) => {
        const block = blocksStore.getBlockForMutation(id);

        if (! block || ! BlockPredicates.isAnnotationHighlightBlock(block)) {
            return;
        }

        const contentJSON = block.content.toJSON();

        switch (contentJSON.type) {
            case AnnotationContentType.TEXT_HIGHLIGHT:
                blocksStore.setBlockContent(id, new TextHighlightAnnotationContent({
                    ...contentJSON,
                    value: { ...contentJSON.value, color },
                }));
                break;
            case AnnotationContentType.AREA_HIGHLIGHT:
                blocksStore.setBlockContent(id, new AreaHighlightAnnotationContent({
                    ...contentJSON,
                    value: { ...contentJSON.value, color },
                }));
                break;
        }
    }, [blocksStore]);
};


export const useHighlightBlockJumpToContext = () => {
    const blocksStore = useBlocksStore();
    const history = useHistory();

    return React.useCallback((id: BlockIDStr) => {
        const block = blocksStore.getBlock(id);

        if (! block || ! IBlockPredicates.isAnnotationHighlightBlock(block)) {
            return;
        }

        const ptr = AnnotationPtrs.create({
            target: id,
            pageNum: block.content.pageNum,
            docID: block.content.docID,
        });

        history.push(AnnotationLinks.createRelativeURL(ptr));
    }, [history, blocksStore]);
};


export const useFlashcardTypeChanger = () => {
    const { getBlock } = useAnnotationBlockManager();
    const blocksStore = useBlocksStore();

    return React.useCallback((id: BlockIDStr) => {
        const block = getBlock(id, AnnotationContentType.FLASHCARD);

        if (! block) {
            return;
        }

        const getText = (): string => {
            if (! block.parent) {
                return '';
            }
            const parent = getBlock(block.parent)!;

            if (parent.content.type === AnnotationContentType.TEXT_HIGHLIGHT) {
                const highlight = parent.content.toJSON().value;
                return BlockTextHighlights.toText(highlight);
            }

            return '';
        };

        const getNewContent = (): IFlashcardAnnotationContent => {
            const text = getText();

            if (block.content.value.type === FlashcardType.BASIC_FRONT_BACK) {
                return {
                    ...contentJSON,
                    value: BlockFlashcards.createCloze(text),
                };
            } else {
                return {
                    ...contentJSON,
                    value: BlockFlashcards.createFrontBack('', text),
                };
            }
        };

        const contentJSON = block.content.toJSON();
        blocksStore.setBlockContent(id, getNewContent());
    }, [blocksStore, getBlock]);
};
