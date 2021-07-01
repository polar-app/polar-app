export type CodeStr = string;

export interface ICodeContent {
    readonly type: 'code';
    readonly lang: 'typescript' | 'javascript' | 'markdown' | 'java' | string;
    readonly value: CodeStr;
}
