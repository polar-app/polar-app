import {Block} from "./Block";
import {MarkdownContent} from "../content/MarkdownContent";
import {NameContent} from "../content/NameContent";
import {DateContent} from "../content/DateContent";
import {NamedContent} from "./BlocksStore";
import {AnnotationContent, AnnotationHighlightContent, FlashcardAnnotationContent, TextHighlightAnnotationContent} from "../content/AnnotationContent";
import {AnnotationContentType} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {IBlockClozeFlashcard, IBlockFrontBackFlashcard} from "polar-blocks/src/annotations/IBlockFlashcard";
import {FlashcardType} from "polar-shared/src/metadata/FlashcardType";
import {DocumentContent} from "../content/DocumentContent";

export type EditableContent = MarkdownContent
                              | NameContent
                              | DateContent
                              | TextHighlightAnnotationContent
                              | FlashcardAnnotationContent;

export type TextContent = MarkdownContent
                          | DocumentContent
                          | NameContent
                          | DateContent
                          | TextHighlightAnnotationContent
                          | FlashcardAnnotationContent;


export type HasLinksContent = MarkdownContent | TextHighlightAnnotationContent;

/**
 * Note we have to have IBlockPredicates and BlockPredicates as the typescript
 * compiler seems to get confused
 *
 */
export namespace BlockPredicates {

    export function isEditableBlock(block: Readonly<Block>): block is Block<EditableContent> {
        return block.content.type === 'markdown'
               || block.content.type === 'name'
               || block.content.type === 'date'
               || block.content.type === AnnotationContentType.TEXT_HIGHLIGHT
               || block.content.type === AnnotationContentType.FLASHCARD;
    }

    export function isTextBlock(block: Readonly<Block>): block is Block<TextContent> {
        return isEditableBlock(block) || block.content.type === 'document';
    }

    export function isDateBlock(block: Readonly<Block>): block is Block<DateContent> {
        return block.content.type === 'date';
    }

    export function isNamedBlock(block: Readonly<Block>): block is Block<NamedContent> {
        return ['date', 'name', 'document'].indexOf(block.content.type) > -1;
    }

    export function canHaveLinks(block: Readonly<Block>): block is Block<HasLinksContent> {
        return [
            'markdown', 
            AnnotationContentType.TEXT_HIGHLIGHT,
            AnnotationContentType.AREA_HIGHLIGHT,
        ].indexOf(block.content.type) > -1;
    }

    export function isAnnotationBlock(block: Readonly<Block>): block is Block<AnnotationContent> {
        return Object.values(AnnotationContentType).some(type => block.content.type === type);
    }

    export function isAnnotationHighlightBlock(block: Readonly<Block>): block is Block<AnnotationHighlightContent> {
        return [AnnotationContentType.AREA_HIGHLIGHT, AnnotationContentType.TEXT_HIGHLIGHT]
            .some(type => block.content.type === type);
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

    export function isDocumentBlock(block: Readonly<Block>): block is Block<DocumentContent> {
        return block.content.type === 'document';
    }
}
