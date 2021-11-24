import {Block} from "./Block";
import {MarkdownContent} from "../content/MarkdownContent";
import {NameContent} from "../content/NameContent";
import {DateContent} from "../content/DateContent";
import {NamedContent} from "./BlocksStore";
import {
    AnnotationContent,
    AnnotationHighlightContent,
    AreaHighlightAnnotationContent,
    FlashcardAnnotationContent,
    TextHighlightAnnotationContent
} from "../content/AnnotationContent";
import {IBlockClozeFlashcard, IBlockFrontBackFlashcard} from "polar-blocks/src/annotations/IBlockFlashcard";
import {DocumentContent} from "../content/DocumentContent";
import {IBlockPredicates} from "./IBlockPredicates";

export type EditableContent = MarkdownContent
                              | NameContent
                              | DateContent
                              | TextHighlightAnnotationContent
                              | FlashcardAnnotationContent;

export type TextContent = EditableContent
                          | DocumentContent;


export type HasLinksContent = MarkdownContent | TextHighlightAnnotationContent;

/**
 * Note we have to have IBlockPredicates and BlockPredicates as the typescript
 * compiler seems to get confused
 *
 */
export namespace BlockPredicates {

    export function isEditableBlock(block: Readonly<Block>): block is Block<EditableContent> {
        return IBlockPredicates.isEditableBlock(block);
    }

    export function isTextBlock(block: Readonly<Block>): block is Block<TextContent> {
        return IBlockPredicates.isTextBlock(block);
    }

    export function isDateBlock(block: Readonly<Block>): block is Block<DateContent> {
        return IBlockPredicates.isDateBlock(block);
    }

    export function isNamedBlock(block: Readonly<Block>): block is Block<NamedContent> {
        return IBlockPredicates.isNamedBlock(block);
    }

    /**
     * Does the block support written backlinks
     */
    export function canHaveLinks(block: Readonly<Block>): block is Block<HasLinksContent> {
        return IBlockPredicates.canHaveLinks(block);
    }

    export function isAnnotationBlock(block: Readonly<Block>): block is Block<AnnotationContent> {
        return IBlockPredicates.isAnnotationBlock(block);
    }

    export function isAnnotationTextHighlightBlock(block: Readonly<Block>): block is Block<TextHighlightAnnotationContent> {
        return IBlockPredicates.isAnnotationTextHighlightBlock(block);
    }

    export function isAnnotationAreaHighlightBlock(block: Readonly<Block>): block is Block<AreaHighlightAnnotationContent> {
        return IBlockPredicates.isAnnotationAreaHighlightBlock(block);
    }


    export function isAnnotationHighlightBlock(block: Readonly<Block>): block is Block<AnnotationHighlightContent> {
        return IBlockPredicates.isAnnotationHighlightBlock(block);
    }

    export function isFrontBackFlashcardBlock(block: Readonly<Block>): block is Block<FlashcardAnnotationContent<IBlockFrontBackFlashcard>> {
        return IBlockPredicates.isFrontBackFlashcardBlock(block);
    }

    export function isClozeFlashcardBlock(block: Readonly<Block>): block is Block<FlashcardAnnotationContent<IBlockClozeFlashcard>> {
        return IBlockPredicates.isClozeFlashcardBlock(block);
    }

    export function isDocumentBlock(block: Readonly<Block>): block is Block<DocumentContent> {
        return IBlockPredicates.isDocumentBlock(block);
    }
    
    export function isMarkdownBlock(block: Readonly<Block>): block is Block<MarkdownContent> {
        return IBlockPredicates.isMarkdownBlock(block);
    }
}
