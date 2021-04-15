import { IMarkdownContent } from "../content/IMarkdownContent";
import {INameContent} from "../content/INameContent";
import {Block} from "./Block";

/**
 * Note we have to have IBlockPredicates and BlockPredicates as the typescript
 * compiler seems to get confused
 *
 */
export namespace BlockPredicates {

    export function isTextBlock(block: Block): block is Block<IMarkdownContent | INameContent> {
        return block.content.type === 'markdown' || block.content.type === 'name';
    }

}
