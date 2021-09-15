import {Block} from "./Block";
import {MarkdownContent} from "../content/MarkdownContent";
import {NameContent} from "../content/NameContent";
import {DateContent} from "../content/DateContent";
import {NamedContent} from "./BlocksStore";
import {AnnotationContent, AnnotationHighlightContent, FlashcardAnnotationContent, TextHighlightAnnotationContent} from "../content/AnnotationContent";
import {AnnotationContentType} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {IBlockClozeFlashcard, IBlockFrontBackFlashcard} from "polar-blocks/src/annotations/IBlockFlashcard";
import {FlashcardType} from "polar-shared/src/metadata/FlashcardType";

export type TextContent = MarkdownContent
                          | NameContent
                          | DateContent
                          | TextHighlightAnnotationContent
                          | FlashcardAnnotationContent;

/**
 * Note we have to have IBlockPredicates and BlockPredicates as the typescript
 * compiler seems to get confused
 *
 */
export namespace BlockPredicates {

    export function isTextBlock(block: Readonly<Block>): block is Block<TextContent> {
        return block.content.type === 'markdown'
               || block.content.type === 'name'
               || block.content.type === 'date'
               || block.content.type === AnnotationContentType.TEXT_HIGHLIGHT
               || block.content.type === AnnotationContentType.FLASHCARD;
    }

    export function isDateBlock(block: Readonly<Block>): block is Block<DateContent> {
        return block.content.type === 'date';
    }

    export function isNamedBlock(block: Readonly<Block>): block is Block<NamedContent> {
        return ['date', 'name', 'document'].indexOf(block.content.type) > -1;
    }

    export function canHaveLinks(block: Readonly<Block>): block is Block<MarkdownContent> {
        return ['markdown'].indexOf(block.content.type) > -1;
    }

    export function isAnnotationBlock(block: Readonly<Block>): block is Block<AnnotationContent> {
        return Object.values(AnnotationContentType).some(type => block.content.type === type);
    }

    export function isAnnotationHighlightBlock(block: Readonly<Block>): block is Block<AnnotationHighlightContent> {
        const highlightTypes = [AnnotationContentType.AREA_HIGHLIGHT, AnnotationContentType.TEXT_HIGHLIGHT];
        return highlightTypes.some(type => block.content.type === type);
    }

    export function isFrontBackFlashcardBlock(block: Readonly<Block>): block is Block<FlashcardAnnotationContent<IBlockFrontBackFlashcard>> {
        return block.content.type === AnnotationContentType.FLASHCARD
               && [
                   FlashcardType.BASIC_FRONT_BACK,
                   FlashcardType.BASIC_FRONT_BACK_OR_REVERSE,
                   FlashcardType.BASIC_FRONT_BACK_AND_REVERSE,
               ].indexOf(block.content.value.type) > -1;
    }

    export function isClozeFlashcardBlock(block: Readonly<Block>): block is Block<FlashcardAnnotationContent<IBlockClozeFlashcard>> {
        return block.content.type === AnnotationContentType.FLASHCARD
               && block.content.value.type === FlashcardType.CLOZE;
    }
}
