import {MarkdownContent} from "../content/MarkdownContent";
import {IBlock, IEditableContent, INamedContent, ITextContent} from "polar-blocks/src/blocks/IBlock";
import {AnnotationContentType, IAnnotationHighlightContent, IAreaHighlightAnnotationContent, IFlashcardAnnotationContent, ITextHighlightAnnotationContent} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {IDocumentContent} from "polar-blocks/src/blocks/content/IDocumentContent";
import {FlashcardType} from "polar-shared/src/metadata/FlashcardType";
import {IBlockClozeFlashcard, IBlockFrontBackFlashcard} from "polar-blocks/src/annotations/IBlockFlashcard";
import {IHasLinksContent} from "polar-blocks/src/blocks/IBlock";
import {IDateContent} from "polar-blocks/src/blocks/content/IDateContent";

export namespace IBlockPredicates {

    export function isEditableBlock(block: Readonly<IBlock>): block is IBlock<IEditableContent> {
        return block.content.type === 'markdown'
               || block.content.type === 'name'
               || block.content.type === 'date'
               || block.content.type === AnnotationContentType.TEXT_HIGHLIGHT
               || block.content.type === AnnotationContentType.FLASHCARD;
    }

    export function isTextBlock(block: Readonly<IBlock>): block is IBlock<ITextContent> {
        return isEditableBlock(block) || block.content.type === 'document';
    }

    export function isNamedBlock(block: IBlock): block is IBlock<INamedContent> {
        return ['document', 'name', 'date'].indexOf(block.content.type) > -1;
    }

    export function isAnnotationTextHighlightBlock(block: Readonly<IBlock>): block is IBlock<ITextHighlightAnnotationContent> {
        return block.content.type === AnnotationContentType.TEXT_HIGHLIGHT;
    }

    export function isAnnotationAreaHighlightBlock(block: Readonly<IBlock>): block is IBlock<IAreaHighlightAnnotationContent> {
        return block.content.type === AnnotationContentType.AREA_HIGHLIGHT;
    }

    export function isAnnotationHighlightBlock(block: Readonly<IBlock>): block is IBlock<IAnnotationHighlightContent> {
        return [AnnotationContentType.AREA_HIGHLIGHT, AnnotationContentType.TEXT_HIGHLIGHT]
            .some(type => block.content.type === type);
    }

    export function isDateBlock(block: Readonly<IBlock>): block is IBlock<IDateContent> {
        return block.content.type === 'date';
    }

    export function isAnnotationFlashcardBlock(block: Readonly<IBlock>): block is IBlock<IFlashcardAnnotationContent> {
        return block.content.type === AnnotationContentType.FLASHCARD;
    }

    export function canHaveLinks(block: Readonly<IBlock>): block is IBlock<IHasLinksContent> {
        return [
            'markdown',
            AnnotationContentType.TEXT_HIGHLIGHT,
        ].indexOf(block.content.type) > -1;
    }

    export function isAnnotationBlock(block: Readonly<IBlock>): block is IBlock<IAnnotationHighlightContent> {
        return [
            AnnotationContentType.AREA_HIGHLIGHT,
            AnnotationContentType.TEXT_HIGHLIGHT,
            AnnotationContentType.FLASHCARD,
        ].some(type => block.content.type === type);
    }

    export function isMarkdownBlock(block: Readonly<IBlock>): block is IBlock<MarkdownContent> {
        return block.content.type === 'markdown';
    }

    export function isDocumentBlock(block: Readonly<IBlock>): block is IBlock<IDocumentContent> {
        return block.content.type === 'document';
    }

    export function isClozeFlashcardBlock(block: Readonly<IBlock>): block is IBlock<IFlashcardAnnotationContent<IBlockClozeFlashcard>> {
        return block.content.type === AnnotationContentType.FLASHCARD
               && block.content.value.type === FlashcardType.CLOZE;
    }

    export function isFrontBackFlashcardBlock(block: Readonly<IBlock>): block is IBlock<IFlashcardAnnotationContent<IBlockFrontBackFlashcard>> {
        return block.content.type === AnnotationContentType.FLASHCARD
               && [
                   FlashcardType.BASIC_FRONT_BACK,
                   FlashcardType.BASIC_FRONT_BACK_OR_REVERSE,
                   FlashcardType.BASIC_FRONT_BACK_AND_REVERSE,
               ].indexOf(block.content.value.type) > -1;
    }
}
