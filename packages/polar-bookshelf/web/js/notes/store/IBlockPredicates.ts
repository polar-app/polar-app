import { IBlock } from "./IBlock"
import { MarkdownContent } from "../content/MarkdownContent";
import { NameContent } from "../content/NameContent";

export namespace IBlockPredicates {

    export function isTextBlock(block: IBlock): block is IBlock<MarkdownContent | NameContent> {
        return block.content.type === 'markdown' || block.content.type === 'name';
    }

}
