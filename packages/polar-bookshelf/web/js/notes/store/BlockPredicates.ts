import {Block} from "./Block";
import {MarkdownContent} from "../content/MarkdownContent";
import { NameContent } from "../content/NameContent";
import {DateContent} from "../content/DateContent";

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

}
