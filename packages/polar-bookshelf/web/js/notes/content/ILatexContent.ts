export type LatexStr = string;

export interface ILatexContent {
    readonly type: 'latex';
    readonly data: LatexStr;
}
