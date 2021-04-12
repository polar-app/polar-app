import { IMarkdownContent } from "../content/IMarkdownContent";
import { IBlock } from "./IBlock"
import {INameContent} from "../content/INameContent";

export namespace IBlockPredicates {

    export function isTextBlock(block: IBlock): block is IBlock<IMarkdownContent | INameContent> {
        return block.content.type === 'markdown' || block.content.type === 'name';
    }

}
