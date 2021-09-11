import {IBaseContent} from "./IBaseContent";

export type LatexStr = string;

export interface ILatexContent extends IBaseContent {
    readonly type: 'latex';
    readonly data: LatexStr;
}
