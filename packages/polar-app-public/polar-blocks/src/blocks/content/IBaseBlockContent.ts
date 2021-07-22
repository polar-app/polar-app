import {IBlockContent} from "../IBlock";

export interface IBaseBlockContent {
    update: (content: IBlockContent) => void;
    toJSON: () => any;
}
