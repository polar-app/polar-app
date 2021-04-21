import {Block} from "./Block";
import {MarkdownContent} from "../content/MarkdownContent";
import { NameContent } from "../content/NameContent";

/**
 * Note we have to have IBlockPredicates and BlockPredicates as the typescript
 * compiler seems to get confused
 *
 */
export namespace BlockPredicates {

    export function isTextBlock(block: Block): block is Block<MarkdownContent | NameContent> {
        return block.content.type === 'markdown' || block.content.type === 'name';
    }

}
