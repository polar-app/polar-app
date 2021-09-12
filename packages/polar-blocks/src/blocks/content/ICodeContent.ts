import {IBaseContent} from "./IBaseContent";

export type CodeStr = string;

export interface ICodeContent extends IBaseContent {
    readonly type: 'code';
    readonly lang: 'typescript' | 'javascript' | 'markdown' | 'java' | string;
    readonly value: CodeStr;
}
