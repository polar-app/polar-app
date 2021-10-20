import {MarkdownContent} from "../content/MarkdownContent";
import {NameContent} from "../content/NameContent";
import {IBlock} from "polar-blocks/src/blocks/IBlock";

export namespace IBlockPredicates {

    export function isTextBlock(block: IBlock): block is IBlock<MarkdownContent | NameContent> {
        return block.content.type === 'markdown' || block.content.type === 'name';
    }

}
