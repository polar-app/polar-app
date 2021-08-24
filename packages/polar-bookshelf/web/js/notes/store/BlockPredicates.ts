import {Block} from "./Block";
import {MarkdownContent} from "../content/MarkdownContent";
import {NameContent} from "../content/NameContent";
import {DateContent} from "../content/DateContent";
import {NamedBlock} from "./BlocksStore";
import {AnnotationContent, AnnotationHighlightContent} from "../content/AnnotationContent";
import {AnnotationContentType} from "polar-blocks/src/blocks/content/IAnnotationContent";

/**
 * Note we have to have IBlockPredicates and BlockPredicates as the typescript
 * compiler seems to get confused
 *
 */
export namespace BlockPredicates {

    export function isTextBlock(block: Readonly<Block>): block is Block<MarkdownContent | NameContent | DateContent> {
        return block.content.type === 'markdown' || block.content.type === 'name' || block.content.type === 'date';
    }

    export function isDateBlock(block: Readonly<Block>): block is Block<DateContent> {
        return block.content.type === 'date';
    }

    export function isEditableBlock(block: Readonly<Block>): block is Block<MarkdownContent> {
        return block.content.type === 'markdown';
    }

    export function isNamedBlock(block: Readonly<Block>): block is NamedBlock {
        return ['date', 'name', 'document'].indexOf(block.content.type) > -1;
    }

    export function isAnnotationBlock(block: Readonly<Block>): block is Block<AnnotationContent> {
        return Object.values(AnnotationContentType).some(type => block.content.type === type);
    }

    export function isAnnotationHighlightBlock(block: Readonly<Block>): block is Block<AnnotationHighlightContent> {
        const highlightTypes = [AnnotationContentType.AREA_HIGHLIGHT, AnnotationContentType.TEXT_HIGHLIGHT];
        return highlightTypes.some(type => block.content.type === type);
    }
}
