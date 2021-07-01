import {IBlockContent} from "polar-blocks/src/blocks/IBlock";

export interface IBaseBlockContent {
    update: (content: IBlockContent) => void;
    toJSON: () => any;
}
